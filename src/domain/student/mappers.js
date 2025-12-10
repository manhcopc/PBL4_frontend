import { createStudent, createStudentExamRecord } from "./models";

export const mapStudentEntity = (data = {}) =>
  createStudent({
    id: data.id ?? data.examinee ?? null,
    studentCode:
      data.student_ID ?? data.studentCode ?? data.examinee_code ?? "",
    fullName: data.name ?? data.fullName ?? "",
    dateOfBirth: data.date_of_birth ?? data.dateOfBirth ?? "",
    className: data.className ?? data.class_name ?? "",
  });

export const mapStudentDetailResponse = (detail = {}, fallback = {}) => ({
  student: createStudent({
    id: detail.id ?? fallback.id ?? null,
    studentCode:
      detail.student_ID ?? fallback.studentCode ?? fallback.student_ID ?? "",
    fullName: detail.name ?? fallback.fullName ?? fallback.name ?? "",
    dateOfBirth:
      detail.date_of_birth ?? fallback.dateOfBirth ?? fallback.date_of_birth ?? "",
    className: detail.className ?? detail.class_name ?? fallback.className ?? "",
  }),
  records: Array.isArray(detail.records)
    ? detail.records.map((record) => mapStudentExamRecord(record))
    : [],
});

export const mapStudentExamRecord = (record = {}) => {
  const examInfo = record.exam || {};
  const result = record.result || {};
  const paper = record.exam_paper || record.paper || {};
  const takenAt =
    record.taken_at ||
    record.exam_date ||
    record.takenAt ||
    examInfo.exam_date ||
    examInfo.examDate ||
    record.date ||
    "";

  return createStudentExamRecord({
    examId:
      record.exam_id ??
      record.examId ??
      examInfo.id ??
      record.id ??
      null,
    examName:
      record.exam_name ??
      record.examName ??
      examInfo.name ??
      "Kỳ thi",
    examCode:
      result.exam_paper_code ??
      result.examCode ??
      paper.exam_paper_code ??
      paper.code ??
      record.paper_code ??
      record.exam_code ??
      "—",
    takenAt,
    correctCount:
      result.correct_answers ??
      result.correctCount ??
      record.correct_count ??
      record.correctCount ??
      record.correct ??
      record.total_correct ??
      0,
    totalQuestions:
      result.total_questions ??
      result.totalQuestions ??
      record.total_questions ??
      record.question_count ??
      0,
    score:
      result.score ??
      record.score ??
      record.total_score ??
      record.mark ??
      0,
  });
};
