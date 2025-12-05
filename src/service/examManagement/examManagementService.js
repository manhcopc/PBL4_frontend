import { createExam } from "../../domain/exam/models";
import createExamRepository from "../../repository/exam/examRepository";

const examRepository = createExamRepository();

const resolveQuestionCount = (exam, papers) => {
  const examCount = Number(exam?.questionCount) || 0;
  const papersCount = Array.isArray(papers)
    ? papers.reduce(
        (max, paper) =>
          Math.max(
            max,
            Number(paper.questionCount) ||
              (Array.isArray(paper.answers) ? paper.answers.length : 0)
          ),
        0
      )
    : 0;
  return Math.max(examCount, papersCount, 0);
};

const normalizeExamForm = (exam, papers, students) =>
  createExam({
    ...exam,
    questionCount: resolveQuestionCount(exam, papers),
    examCodes: papers,
    students,
  });

const buildOriginalExamCodes = (papers) =>
  papers.map((paper) => ({
    id: paper.id,
    code: paper.code,
    questionCount: paper.questionCount,
  }));

const buildAnswersPayload = (answers, questionCount, answerEntries = []) =>
  examRepository.mapAnswersForSave(answers, questionCount, answerEntries);

const buildPaperPayload = (paper, questionCount) => ({
  exam_paper_code: paper.code || "",
  number_of_questions: questionCount,
});

export default function createExamManagementService() {
  return {
    async loadExamDetail(examId) {
      const { exam, papers, students } = await examRepository.getExamDetail(
        examId
      );
      const examForm = normalizeExamForm(exam, papers, students);
      const metadata = {
        originalExamCodes: buildOriginalExamCodes(papers),
      };
      return { examForm, metadata };
    },
    async saveExamDetail({ examForm, metadata, removedPaperIds = [] }) {
      if (!examForm?.id) return;
      const originalExamCodes = metadata?.originalExamCodes || [];
      const deletePromises = removedPaperIds.map((paperId) =>
        examRepository.deletePaper(examForm.id, paperId)
      );

      const syncedExamCodes = [];
      for (let index = 0; index < examForm.examCodes.length; index += 1) {
        const paper = examForm.examCodes[index];
        let paperId = paper.id;
        if (!paperId) {
          const payload = buildPaperPayload(paper, examForm.questionCount);
          const createRes = await examRepository.createPaper(
            examForm.id,
            payload
          );
          const created = createRes?.data;
          paperId = created?.id ?? created?.data?.id;
          if (!paperId) {
            paperId = await examRepository.findPaperByCode(
              examForm.id,
              payload.exam_paper_code
            );
          }
          if (!paperId) {
            throw new Error("Không thể lấy ID mã đề vừa tạo");
          }
        } else {
          const original = originalExamCodes.find(
            (item) => item.id === paperId
          );
          if (
            original &&
            (original.code !== paper.code ||
              original.questionCount !== examForm.questionCount)
          ) {
            await examRepository.updatePaper(examForm.id, paperId, {
              exam_paper_code: paper.code,
              number_of_questions: examForm.questionCount,
            });
          }
        }

        const answersPayload = buildAnswersPayload(
          paper.answers,
          examForm.questionCount,
          paper.answerEntries
        );
        const batchRes = await examRepository.batchAnswers(
          paperId,
          answersPayload,
          examForm.questionCount
        );
        const answerEntries =
          Array.isArray(batchRes?.data) || Array.isArray(batchRes)
            ? (batchRes?.data || batchRes).map((entry, index) => ({
                id: entry.id ?? entry.answer_id ?? null,
                question_number:
                  entry.question_number ??
                  entry.questionNumber ??
                  entry.order ??
                  index + 1,
              }))
            : answersPayload.map((entry) => ({
                id: entry.id ?? null,
                question_number: entry.question_number,
              }));
        syncedExamCodes.push({
          ...paper,
          id: paperId,
          questionCount: examForm.questionCount,
          answerEntries,
        });
      }

      await Promise.all(deletePromises);
      await examRepository.updateExam(examForm.id, {
        name: examForm.name,
        description: examForm.description,
        subject: examForm.subject,
        exam_date: examForm.examDate,
        question_count: examForm.questionCount,
      });

      return {
        examForm: {
          ...examForm,
          examCodes: syncedExamCodes,
        },
        metadata: {
          originalExamCodes: buildOriginalExamCodes(syncedExamCodes),
        },
      };
    },
    async addStudents(examId, students) {
      if (!examId || !students?.length) return;
      await Promise.all(
        students.map((student) => {
          const examineeId =
            student.id ??
            student.examineeId ??
            student.examinee ??
            student.examinee_id ??
            student.recordId;
          const examineeCode =
            student.student_ID ??
            student.studentCode ??
            student.examinee_code ??
            student.code;
          if (!examineeId || !examineeCode) {
            throw new Error("Thiếu thông tin thí sinh để thêm vào kỳ thi.");
          }
          return examRepository.addStudent(examId, {
            examinee: examineeId,
            examinee_code: examineeCode,
          });
        })
      );
    },
    async removeStudent(examId, recordId) {
      if (!examId || !recordId) return;
      await examRepository.removeStudent(examId, recordId);
    },
    async listAvailableStudents() {
      return examRepository.listExaminees();
    },
  };
}
