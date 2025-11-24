import { createScoreExam, createScoreRecord } from "./models";

export const mapExamSummaryResponse = (data = {}) =>
  createScoreExam({
    id: data.id,
    name: data.name || data.title || `Kỳ thi ${data.id}`,
    subject: data.subject || "Chưa cập nhật",
    description: data.description || "",
    examDate: data.exam_date || data.examDate || "",
    questionCount: data.question_count || data.questionCount || 0,
    studentCount: data.user || data.examinee_count || data.student_count || 0,
    paperCount: data.paper_count || data.paperCount || 0,
  });

export const mapScoreRecord = (record = {}, index = 0) => {
  const examinee = record.examinee || record.student || {};
  const examPaper = record.exam_paper || record.paper || {};
  const correctCount =
    record.correct_count ?? record.correctCount ?? record.correct ?? 0;
  const score =
    record.score ?? record.total_score ?? record.totalScore ?? record.mark ?? 0;

  return createScoreRecord({
    recordId: record.id,
    examineeId:
      examinee.id ??
      record.examinee ??
      record.examinee_id ??
      record.student_id ??
      null,
    studentCode:
      examinee.student_ID ??
      record.student_ID ??
      record.examinee_code ??
      examinee.code ??
      `SV-${index + 1}`,
    fullName: examinee.name ?? record.name ?? `Thí sinh ${index + 1}`,
    paperCode:
      examPaper.exam_paper_code ??
      examPaper.code ??
      record.exam_paper_code ??
      record.paper_code ??
      "—",
    correctCount: Number(correctCount) || 0,
    score: Number(score) || 0,
    pendingImage:
      record.pending_image_url ??
      record.before_grade_image ??
      record.pendingImage ??
      null,
    gradedImage:
      record.graded_image_url ??
      record.after_grade_image ??
      record.gradedImage ??
      null,
  });
};

export const enrichScoreRecords = (records, detailMap) =>
  records.map((record) => {
    if (!record.examineeId || !detailMap.has(record.examineeId)) {
      return record;
    }
    const detail = detailMap.get(record.examineeId);
    return createScoreRecord({
      ...record,
      studentCode: record.studentCode || detail.student_ID,
      fullName: detail.name ?? record.fullName,
      paperCode: record.paperCode,
    });
  });
