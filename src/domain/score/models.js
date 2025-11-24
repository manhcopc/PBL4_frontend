export const createScoreExam = (props = {}) => ({
  id: props.id ?? null,
  name: props.name ?? "",
  subject: props.subject ?? "",
  description: props.description ?? "",
  examDate: props.examDate ?? "",
  questionCount: props.questionCount ?? 0,
  studentCount: props.studentCount ?? 0,
  paperCount: props.paperCount ?? 0,
});

export const createScoreRecord = (props = {}) => ({
  recordId: props.recordId ?? null,
  examineeId: props.examineeId ?? null,
  studentCode: props.studentCode ?? "",
  fullName: props.fullName ?? "",
  paperCode: props.paperCode ?? "",
  correctCount: props.correctCount ?? 0,
  score: props.score ?? 0,
  pendingImage: props.pendingImage ?? null,
  gradedImage: props.gradedImage ?? null,
});
