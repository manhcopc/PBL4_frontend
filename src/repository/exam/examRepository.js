import examApi from "../../api/examApi";
import examPaperApi from "../../api/examPaperApi";
import examAnswerApi from "../../api/examAnswerApi";
import examineeRecordApi from "../../api/examineeRecordApi";
import examineeApi from "../../api/examineeApi";
import {
  createExamPaper,
  createExamStudent,
} from "../../domain/exam/models";
import {
  mapExamResponse,
  mapPaperResponse,
  mapStudentRecord,
  normalizeAnswers,
  mapExamineeEntity,
  answerIndexFromValue,
} from "../../domain/exam/mappers";

const fillStudentDetail = async (studentList) => {
  const idsToFetch = Array.from(
    new Set(
      studentList
        .filter(
          (student) =>
            student.examineeId &&
            (!student.fullName ||
              student.fullName.startsWith("Thí sinh") ||
              !student.studentCode ||
              student.studentCode.startsWith("SV-"))
        )
        .map((student) => student.examineeId)
    )
  );

  if (!idsToFetch.length) {
    return studentList;
  }

  const fetchedDetails = await Promise.all(
    idsToFetch.map((id) =>
      examineeApi
        .getExamineeById(id)
        .then((res) => ({ id, detail: res.data }))
        .catch(() => ({ id, detail: null }))
    )
  );

  const detailMap = new Map();
  fetchedDetails.forEach(({ id, detail }) => {
    if (detail) {
      detailMap.set(id, detail);
    }
  });

  return studentList.map((student) => {
    if (!student.examineeId || !detailMap.has(student.examineeId)) {
      return student;
    }
    const detail = detailMap.get(student.examineeId);
    return createExamStudent({
      ...student,
      studentCode: student.studentCode || detail.student_ID,
      fullName: detail.name || student.fullName,
      className: detail.class_name || student.className,
    });
  });
};

const fetchPapersWithAnswers = async (examId) => {
  const papersRes = await examPaperApi.getAllPaper(examId);
  const papers = Array.isArray(papersRes.data) ? papersRes.data : [];

  const papersWithAnswers = await Promise.all(
    papers.map(async (paper) => {
      try {
        const answersRes = await examAnswerApi.getAllAnswer(paper.id);
        const answersRaw = Array.isArray(answersRes.data)
          ? answersRes.data
          : answersRes.data?.results || [];
        const answers = normalizeAnswers(
          answersRaw,
          paper.number_of_questions || 0
        );
        return mapPaperResponse(
          paper,
          answers,
          paper.number_of_questions,
          answersRaw
        );
      } catch (error) {
        return mapPaperResponse(
          paper,
          [],
          paper.number_of_questions || paper.question_count || 0
        );
      }
    })
  );

  return papersWithAnswers;
};

export default function createExamRepository() {
  return {
    async getExamDetail(examId) {
      const [examRes, studentsRes, papers] = await Promise.all([
        examApi.getExamById(examId),
        examineeRecordApi.getAllRecord(examId),
        fetchPapersWithAnswers(examId),
      ]);
      const exam = mapExamResponse(examRes.data || {});
      const studentsRaw = Array.isArray(studentsRes.data)
        ? studentsRes.data
        : [];
      const mappedStudents = await fillStudentDetail(
        studentsRaw.map((record) => mapStudentRecord(record))
      );
      return {
        exam,
        papers,
        students: mappedStudents,
      };
    },
    updateExam(examId, payload) {
      return examApi.updateExam(examId, payload);
    },
    createPaper(examId, payload) {
      return examPaperApi.createPaper(examId, payload);
    },
    updatePaper(examId, paperId, payload) {
      return examPaperApi.updatePaper(examId, paperId, payload);
    },
    deletePaper(examId, paperId) {
      return examPaperApi.deletePaper(examId, paperId);
    },
    batchAnswers(paperId, answers, questionCount) {
      const payload = {
        answers,
      };
      if (typeof questionCount === "number" && !Number.isNaN(questionCount)) {
        payload.number_of_questions = questionCount;
      }
      return examPaperApi.batchAnswer(paperId, payload);
    },
    addStudent(examId, payload) {
      return examineeRecordApi.addRecord(examId, payload);
    },
    removeStudent(examId, recordId) {
      return examineeRecordApi.deleteRecord(examId, recordId);
    },
    async findPaperByCode(examId, code) {
      const res = await examPaperApi.getAllPaper(examId);
      const papers = Array.isArray(res.data) ? res.data : [];
      const match = papers.find(
        (paper) =>
          (paper.exam_paper_code ||
            paper.code ||
            paper.paper_code ||
            paper.title ||
            paper.name) === code
      );
      return match ? match.id : null;
    },
    mapAnswersForSave(answers, questionCount, existingEntries = []) {
      const entryIdMap = new Map();
      if (Array.isArray(existingEntries)) {
        existingEntries.forEach((entry) => {
          const questionNumber =
            entry.question_number ??
            entry.questionNumber ??
            entry.order ??
            entry.index ??
            null;
          if (questionNumber !== null && entry.id) {
            entryIdMap.set(Number(questionNumber), entry.id);
          }
        });
      }
      const normalizedAnswers = Array.isArray(answers)
        ? answers.map((value, index) => {
            const questionNumber = index + 1;
            const answerEntry = {
              question_number: questionNumber,
              answer_number: answerIndexFromValue(value),
            };
            const existingId = entryIdMap.get(questionNumber);
            if (existingId) {
              answerEntry.id = existingId;
            }
            return answerEntry;
          })
        : [];
      const expectedLength = Number.isFinite(Number(questionCount))
        ? Math.max(0, Number(questionCount))
        : normalizedAnswers.length;
      if (expectedLength === 0) {
        return normalizedAnswers.map((entry, index) => ({
          ...entry,
          question_number: index + 1,
        }));
      }
      const result = [...normalizedAnswers];
      while (result.length < expectedLength) {
        const questionNumber = result.length + 1;
        const fallbackEntry = {
          question_number: questionNumber,
          answer_number: 0,
        };
        const existingId = entryIdMap.get(questionNumber);
        if (existingId) {
          fallbackEntry.id = existingId;
        }
        result.push(fallbackEntry);
      }
      return result.slice(0, expectedLength).map((entry, index) => ({
        ...entry,
        question_number: index + 1,
        ...(entryIdMap.get(index + 1) ? { id: entryIdMap.get(index + 1) } : {}),
      }));
    },
    async listExaminees() {
      const res = await examineeApi.getAllExaminees();
      const examinees = Array.isArray(res.data) ? res.data : [];
      return examinees.map((item) => mapExamineeEntity(item));
    },
  };
}
