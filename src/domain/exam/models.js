export const createExam = (props) => ({
  id: props.id ?? null,
  name: props.name ?? "",
  description: props.description ?? "",
  examDate: props.examDate ?? "",
  subject: props.subject ?? "",
  questionCount: props.questionCount ?? 0,
  examCodes: props.examCodes ?? [],
  students: props.students ?? [],
});

export const createExamPaper = (props) => ({
  id: props.id ?? null,
  code: props.code ?? "",
  questionCount: props.questionCount ?? 0,
  answers: props.answers ?? [],
  answerEntries: props.answerEntries ?? [],
});

export const createExamStudent = (props) => ({
  recordId: props.recordId ?? null,
  examineeId: props.examineeId ?? null,
  studentCode: props.studentCode ?? "",
  fullName: props.fullName ?? "",
  className: props.className ?? "",
});
