export const createStudent = (props = {}) => ({
  id: props.id ?? null,
  studentCode: props.studentCode ?? "",
  fullName: props.fullName ?? "",
  dateOfBirth: props.dateOfBirth ?? "",
  className: props.className ?? "",
});

export const createStudentExamRecord = (props = {}) => ({
  examId: props.examId ?? null,
  examName: props.examName ?? "",
  examCode: props.examCode ?? "",
  takenAt: props.takenAt ?? "",
  correctCount: props.correctCount ?? 0,
  totalQuestions: props.totalQuestions ?? 0,
  score: props.score ?? 0,
});

export const getStudentDetail = (props = {}) => ({
  student: props.student ?? createStudent(),
  records: Array.isArray(props.records) ? props.records : [],
  averageScore: props.records.length > 0 ? props.records.reduce((acc, record) => acc + record.score, 0) / props.records.length : 0,
});
