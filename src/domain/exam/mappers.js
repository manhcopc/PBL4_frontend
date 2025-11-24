import { createExam, createExamPaper, createExamStudent } from "./models";

const ANSWER_OPTIONS = ["A", "B", "C", "D"];
const DEFAULT_ANSWER = "A";

const coerceAnswerIndex = (value) => {
  if (value === null || value === undefined) {
    return 0;
  }
  const normalized = value.toString().trim();
  if (!normalized) {
    return 0;
  }
  const upper = normalized.toUpperCase();
  const letterIndex = ANSWER_OPTIONS.indexOf(upper);
  if (letterIndex !== -1) {
    return letterIndex;
  }
  const numeric = Number(upper);
  if (!Number.isNaN(numeric)) {
    if (numeric >= 0 && numeric < ANSWER_OPTIONS.length) {
      return Math.floor(numeric);
    }
    if (numeric >= 1 && numeric <= ANSWER_OPTIONS.length) {
      return Math.floor(numeric) - 1;
    }
  }
  return 0;
};

export const answerIndexFromValue = (value) => coerceAnswerIndex(value);

const answerLetterFromValue = (value) =>
  ANSWER_OPTIONS[coerceAnswerIndex(value)] || DEFAULT_ANSWER;

export const mapExamResponse = (data) =>
  createExam({
    id: data.id,
    name: data.name || data.title || "",
    description: data.description || "",
    examDate: (data.exam_date || data.examDate || "").slice(0, 10),
    subject: data.subject || "",
    questionCount: data.question_count || data.questionCount || 0,
  });

export const mapPaperResponse = (
  paper,
  answers,
  questionCount,
  rawEntries = []
) =>
  createExamPaper({
    id: paper.id,
    code:
      paper.exam_paper_code ||
      paper.code ||
      paper.paper_code ||
      paper.title ||
      paper.name ||
      `Paper-${paper.id}`,
    questionCount:
      paper.number_of_questions ||
      paper.question_count ||
      paper.questionCount ||
      questionCount ||
      answers.length ||
      0,
    answers:
      answers && answers.length
        ? answers
        : Array.from(
            { length: questionCount || answers.length || 0 },
            () => "A"
          ),
    answerEntries: Array.isArray(rawEntries)
      ? rawEntries.map((entry, index) => ({
          id: entry.id ?? entry.answer_id ?? null,
          question_number:
            entry.question_number ??
            entry.questionNumber ??
            entry.order ??
            index + 1,
        }))
      : [],
  });

export const normalizeAnswers = (rawAnswers, fallback = 0) => {
  if (!Array.isArray(rawAnswers) || rawAnswers.length === 0) {
    return Array.from({ length: fallback }, () => "A");
  }
  return rawAnswers
    .map((answer, index) => ({
      order:
        answer.question_number ??
        answer.questionNumber ??
        answer.order ??
        answer.index ??
        index,
      value:
        answerLetterFromValue(
          answer.answer_number ??
            answer.answerNumber ??
            answer.answer ??
            answer.answers ??
            answer.value
        ),
    }))
    .sort((a, b) => a.order - b.order)
    .map((entry) => entry.value || "A");
};

export const mapStudentRecord = (record) =>
  createExamStudent({
    recordId: record.id,
    examineeId:
      record.examinee?.id ??
      record.student?.id ??
      record.examinee ??
      record.examinee_id ??
      record.student_id,
    studentCode:
      record.examinee?.student_ID ??
      record.student?.student_ID ??
      record.examinee_code ??
      record.student_ID ??
      "",
    fullName:
      record.examinee?.name ?? record.student?.name ?? record.name ?? "",
    className:
      record.examinee?.className ??
      record.student?.className ??
      record.className ??
      "",
  });

export const mapExamineeEntity = (examinee) =>
  createExamStudent({
    recordId: null,
    examineeId: examinee.id ?? examinee.examinee ?? null,
    studentCode:
      examinee.student_ID ??
      examinee.studentCode ??
      examinee.examinee_code ??
      "",
    fullName: examinee.name ?? examinee.fullName ?? "",
    className: examinee.className ?? examinee.class_name ?? "",
  });
