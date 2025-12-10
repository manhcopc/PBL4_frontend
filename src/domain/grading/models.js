export const createGradingRecord = (props = {}) => ({
  recordId: props.recordId ?? null,
  examineeId: props.examineeId ?? null,
  studentCode: props.studentCode ?? "",
  fullName: props.fullName ?? "",
  correctCount: props.correctCount ?? 0,
  score: props.score ?? 0,

  originalImage: props.originalImage ?? null,
  processedImage: props.processedImage ?? null,
});

export const createProcessedResult = (props = {}) => ({
  recordId: props.recordId ?? null,
  sbd: props.sbd ?? "",
  made: props.made ?? "",
  answers: props.answers ?? {},
  // examPaperCode: props.examPaperCode ?? props.made ?? "",
  totalQuestions: props.totalQuestions ?? 0,
  correctAnswers: props.correctAnswers ?? 0,
  score: props.score ?? 0,
  details: props.details ?? [],
  originalImage: props.originalImage ?? props.original_image ?? null, 
  processedImage: props.processedImage ?? props.processed_image ?? null,
});