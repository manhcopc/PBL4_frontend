import { createGradingRecord, createProcessedResult } from "./models";

const ANSWER_OPTIONS = ["A", "B", "C", "D", "?"];

const toAnswerLetter = (value) => {
  const index = Number(value);
  if (!Number.isNaN(index) && index >= 0 && index < ANSWER_OPTIONS.length) {
    return ANSWER_OPTIONS[index];
  }
  const upper = (value || "").toString().trim().toUpperCase();
  if (ANSWER_OPTIONS.includes(upper)) {
    return upper;
  }
  return ANSWER_OPTIONS[4];
};

const mapDetailEntries = (entries = []) =>
  Array.isArray(entries)
    ? entries.map((entry, index) => {
      console.log(`Mapping detail ${index}:`, entry);
        return {
          questionNumber:
            entry.question_number ??
            entry.questionNumber ??
            entry.order ??
            index + 1,
          answerNumber: entry.answer_number ?? entry.answerNumber ?? 0,
          answerLetter: toAnswerLetter(entry.answer_number ?? entry.answerLetter),
          markResult: Boolean(entry.mark_result ?? entry.markResult ?? false),
        };
      })
    : [];

export const mapRecordResponse = (record = {}, fallbackIndex = 0) => {
  const examinee = record.examinee || record.student || {};
  
  const examineeId = typeof record.examinee === 'object' ? record.examinee?.id : record.examinee;

  return createGradingRecord({
    recordId: record.id ?? record.recordId ?? null,
    examineeId: examineeId ?? record.examinee_id ?? null,
    studentCode: examinee.student_ID ?? record.student_ID ,
    fullName: examinee.name ?? record.name ?? `Thí sinh ${fallbackIndex + 1}`,
    score: record.score ?? 0,
    originalImage: 
      record.original_image ||   
      null,

    processedImage: 
      record.processed_image ||  
      record.processedImage ||   
      null,
  });
};

export const enrichRecordsWithDetails = (records, detailMap) =>
  records.map((record) => {
    const key = String(record.examineeId);
    if (!record.examineeId || !detailMap.has(key)) {
      return record;
    }
    
    const detail = detailMap.get(key);
    
    return createGradingRecord({
      ...record,
      studentCode: detail.student_ID || detail.code || record.studentCode,
      fullName: detail.name || detail.fullName || record.fullName,
      className: detail.class_name || record.className,
      originalImage: detail.original_image || record.originalImage,
      processedImage: detail.processed_image || record.processedImage
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
    // examPaperCode:
    //   payload.exam_paper_code ?? payload.made ?? "",
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
    originalImage: payload.original_image ?? null, 
    processedImage: payload.processed_image ?? null, 
  });


export const mapRecordResultResponse = (payload = {}) => {
  const resultData = payload.result || {}; 

  return createProcessedResult({
    recordId: payload.id || payload.recordId,
    score: resultData.score ?? 0,
    correctAnswers: resultData.correct_answers ?? resultData.correctAnswers ?? 0,
    totalQuestions: resultData.total_questions ?? resultData.totalQuestions ?? 0,
    examPaperCode: resultData.exam_paper_code ?? "",
    details: mapDetailEntries(resultData.details || [])

  });
};