export const createGradingRecord = (props = {}) => ({
  recordId: props.recordId ?? null,
  examineeId: props.examineeId ?? null,
  studentCode: props.studentCode ?? "",
  fullName: props.fullName ?? "",
  className: props.className ?? "",
  correctCount: props.correctCount ?? 0,
  score: props.score ?? 0,
});

export const createProcessedResult = (props = {}) => ({
  recordId: props.recordId ?? null,
  sbd: props.sbd ?? "",
  made: props.made ?? "",
  answers: props.answers ?? {},
  examPaperCode: props.examPaperCode ?? props.made ?? "",
  totalQuestions: props.totalQuestions ?? 0,
  correctAnswers: props.correctAnswers ?? 0,
  score: props.score ?? 0,
  details: props.details ?? [],
  originalImage: props.originalImage ?? null, // New field for original image
  originalImageName: props.originalImageName ?? null, // New field for original image name
  processedImage: props.processedImage ?? null, // New field for processed image
  processedImageName: props.processedImageName ?? null, // New field for processed image name
});
