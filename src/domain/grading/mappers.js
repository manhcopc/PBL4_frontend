import { createGradingRecord, createProcessedResult } from "./models";

const ANSWER_OPTIONS = ["A", "B", "C", "D"];

const toAnswerLetter = (value) => {
  const index = Number(value);
  if (!Number.isNaN(index) && index >= 0 && index < ANSWER_OPTIONS.length) {
    return ANSWER_OPTIONS[index];
  }
  const upper = (value || "").toString().trim().toUpperCase();
  if (ANSWER_OPTIONS.includes(upper)) {
    return upper;
  }
  return ANSWER_OPTIONS[0];
};

const mapDetailEntries = (entries = []) =>
  Array.isArray(entries)
    ? entries.map((entry, index) => ({
        questionNumber:
          entry.question_number ??
          entry.questionNumber ??
          entry.order ??
          index + 1,
        answerNumber: entry.answer_number ?? entry.answerNumber ?? 0,
        answerLetter: toAnswerLetter(entry.answer_number ?? entry.answerLetter),
        markResult: Boolean(entry.mark_result ?? entry.markResult ?? false),
      }))
    : [];

export const mapRecordResponse = (record = {}, fallbackIndex = 0) => {
  const examinee = record.examinee || record.student || {};
  return createGradingRecord({
    recordId: record.id ?? record.recordId ?? null,
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
      `SV-${fallbackIndex + 1}`,
    fullName: examinee.name ?? record.name ?? `Thí sinh ${fallbackIndex + 1}`,
    className: examinee.className ?? record.className ?? "—",
    correctCount:
      record.correct_count ?? record.correctCount ?? record.correct ?? 0,
    score: record.score ?? record.total_score ?? record.mark ?? 0,
  });
};

export const enrichRecordsWithDetails = (records, detailMap) =>
  records.map((record) => {
    if (!record.examineeId || !detailMap.has(record.examineeId)) {
      return record;
    }
    const detail = detailMap.get(record.examineeId);
    return createGradingRecord({
      ...record,
      studentCode: detail.student_ID || record.studentCode,
      fullName: detail.name || record.fullName,
      className: detail.class_name || record.className,
    });
  });

export const mapProcessingResponse = (payload = {}) =>
  createProcessedResult({
    recordId:
      payload.record_id ?? payload.recordId ?? payload.id ?? null,
    sbd:
      payload.sbd ?? payload.examinee_code ?? "",
    made:
      payload.made ?? payload.exam_code ?? "",
    answers:
      payload.answers ?? {},
    examPaperCode:
      payload.exam_paper_code ?? payload.made ?? "",
    totalQuestions:
      payload.total_questions ?? payload.totalQuestions ?? payload.question_count ?? 0,
    correctAnswers:
      payload.correct_answers ?? payload.correctAnswers ?? payload.correct ?? 0,
    score:
      payload.score ?? payload.total_score ?? payload.mark ?? 0,
    details: mapDetailEntries(
      payload.details ??
        payload.result?.details ??
        payload.answer_details ??
        []
    ),
    originalImage: payload.original_image ?? null, // Map original image
    originalImageName: payload.original_image_name ?? null, // Map original image name
    processedImage: payload.processed_image ?? null, // Map processed image
    processedImageName: payload.processed_image_name ?? null, // Map processed image name
  });

export const mapRecordResultResponse = (payload = {}) =>
  createProcessedResult({
    recordId: payload.id ?? payload.recordId ?? null,
    sbd: payload.result?.sbd ?? payload.examinee?.student_ID ?? "",
    made:
      payload.result?.exam_paper_code ??
      payload.result?.made ??
      payload.exam_paper_code ??
      "",
    answers: {},
    examPaperCode:
      payload.result?.exam_paper_code ??
      payload.exam_paper_code ??
      payload.result?.made ??
      "",
    totalQuestions: payload.result?.total_questions ?? 0,
    correctAnswers: payload.result?.correct_answers ?? 0,
    score: payload.result?.score ?? 0,
    details: mapDetailEntries(payload.result?.details || []),
  });
