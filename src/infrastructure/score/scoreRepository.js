import examApi from "../../services/api/examApi";
import examPaperApi from "../../services/api/examPaperApi";
import examineeRecordApi from "../../services/api/examineeRecordApi";
import examineeApi from "../../services/api/examineeApi";
import {
  enrichScoreRecords,
  mapExamSummaryResponse,
  mapScoreRecord,
} from "../../domain/score/mappers";

const collectMissingDetails = (records) =>
  Array.from(
    new Set(
      records
        .filter(
          (record) =>
            record.examineeId &&
            (!record.fullName ||
              record.fullName.startsWith("Thí sinh") ||
              !record.studentCode ||
              record.studentCode.startsWith("SV-"))
        )
        .map((record) => record.examineeId)
    )
  );

const fetchDetailMap = async (records) => {
  const ids = collectMissingDetails(records);
  if (!ids.length) return new Map();

  const detailPairs = await Promise.all(
    ids.map((id) =>
      examineeApi
        .getExamineeById(id)
        .then((res) => ({ id, detail: res.data }))
        .catch(() => ({ id, detail: null }))
    )
  );

  const map = new Map();
  detailPairs.forEach(({ id, detail }) => {
    if (detail) {
      map.set(id, detail);
    }
  });
  return map;
};

const pickImageValue = (recordValue, uploadValue) => {
  if (uploadValue instanceof File || uploadValue instanceof Blob) {
    return uploadValue;
  }
  if (uploadValue) {
    return uploadValue;
  }
  if (recordValue instanceof File || recordValue instanceof Blob) {
    return recordValue;
  }
  return recordValue || "";
};

const buildUpdatePayload = (record, original) => {
  const payload = {
    correct_count: record.correctCount,
    score: record.score,
  };
  if (original?.pendingImage !== record.pendingImage) {
    payload.before_grade_image = pickImageValue(
      record.pendingImage,
      record.pendingImageUpload
    );
    if (!record.pendingImage) {
      payload.before_grade_image = "";
    }
  }
  if (original?.gradedImage !== record.gradedImage) {
    payload.after_grade_image = pickImageValue(
      record.gradedImage,
      record.gradedImageUpload
    );
    if (!record.gradedImage) {
      payload.after_grade_image = "";
    }
  }
  return payload;
};

const shouldUseFormData = (payload) =>
  Object.values(payload).some(
    (value) => value instanceof File || value instanceof Blob
  );

const buildRequestBody = (payload) => {
  if (!shouldUseFormData(payload)) {
    return payload;
  }
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }
    if (value instanceof File || value instanceof Blob) {
      formData.append(key, value, value.name || `${key}.jpg`);
    } else {
      formData.append(key, value);
    }
  });
  return formData;
};

export default function createScoreRepository() {
  return {
    async listExams() {
      const res = await examApi.getAllExams();
      const data = Array.isArray(res.data) ? res.data : [];
      const enriched = await Promise.all(
        data.map(async (exam) => {
          try {
            const [papersRes, recordsRes] = await Promise.all([
              examPaperApi.getAllPaper(exam.id),
              examineeRecordApi.getAllRecord(exam.id),
            ]);
            const papers = Array.isArray(papersRes.data)
              ? papersRes.data
              : [];
            const paperCount = papers.length;
            const derivedQuestionCount = papers.reduce(
              (max, paper) =>
                Math.max(
                  max,
                  paper.number_of_questions ||
                    paper.question_count ||
                    paper.questionCount ||
                    0
                ),
              0
            );
            const students = Array.isArray(recordsRes.data)
              ? recordsRes.data.length
              : 0;
            return mapExamSummaryResponse({
              ...exam,
              question_count:
                exam.question_count || exam.questionCount || derivedQuestionCount,
              student_count:
                exam.user || exam.examinee_count || exam.student_count || students,
              paper_count: exam.paper_count || paperCount,
            });
          } catch (error) {
            return mapExamSummaryResponse(exam);
          }
        })
      );
      return enriched;
    },
    async getExamRecords(examId) {
      const res = await examineeRecordApi.getAllRecord(examId);
      const data = Array.isArray(res.data) ? res.data : [];
      let records = data.map((record, index) => mapScoreRecord(record, index));
      const detailMap = await fetchDetailMap(records);
      if (detailMap.size) {
        records = enrichScoreRecords(records, detailMap);
      }
      return records;
    },
    updateRecord(examId, recordId, record, originalRecord) {
      const payload = buildUpdatePayload(record, originalRecord);
      const body = buildRequestBody(payload);
      return examineeRecordApi.updateRecord(body, examId, recordId);
    },
  };
}
