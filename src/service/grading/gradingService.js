import createGradingRepository from "../../repository/grading/gradingRepository";

const gradingRepository = createGradingRepository();

const ANSWER_OPTIONS = ["A", "B", "C", "D", "?"];

const letterToNumber = (letter) => {
  const index = ANSWER_OPTIONS.indexOf(letter);
  return index !== -1 ? index : null;
};
const ensureFileObject = (file) => {
  if (!file) return null;
  if (file instanceof File) {
    return file;
  }
  return new File([file], `capture-${Date.now()}.jpg`, {
    type: file.type || "image/jpeg",
  });
};

export default function createGradingService() {
  return {
    fetchCameraStreamUrl() {
      return gradingRepository.fetchCameraFrame();
    },
    
    fetchCameraSnapshot() {
      return gradingRepository.fetchCameraSnapshot();
    },
    
    listRecords(examId) {
      if (!examId) return Promise.resolve([]);
      return gradingRepository.listRecords(examId);
    },
    
    async processImage({ file }) {
      if (!file) {
        throw new Error("Thiếu ảnh để chấm bài thi.");
      }
      const normalizedFile = ensureFileObject(file);
      console.log("Processing file:", normalizedFile);
      return gradingRepository.processImage(normalizedFile);
    },
    
    async saveResult({ exam, result }) {
      try {
        if (!exam) throw new Error("Thiếu ID kỳ thi (exam).");
        if (!result) throw new Error("Thiếu kết quả chấm (result).");
        const mappedDetails = result.details?.map(d => ({
           question_number: Number(d.questionNumber),
           answer_number: letterToNumber(d.answerLetter) ?? d.answerNumber ?? 0,
           
           mark_result: Boolean(d.markResult)
        })) || [];
        const answersPayload = result.answers || {};
        const payload = {
          exam: Number(exam),
          result: {
            sbd: result.sbd || "",
            made: result.made || "",

            answers: answersPayload,
            details: mappedDetails,
            original_image: result.originalImage || result.original_image || null,
            processed_image: result.processedImage || result.processed_image || null,
            score: Number(result.score || 0),
            correct_answers: Number(result.correctAnswers || 0),
            total_questions: Number(result.totalQuestions || 0),
          },
        };
        console.log("Payload sent:", JSON.stringify(payload, null, 2));

        const response = await gradingRepository.saveResult(payload);
        console.log("saveResult Service:", response);
        return response;
      } catch (error) {
        console.error("Server error:", error.response?.data || error.message);
        throw error;
      }
    },
    
    fetchRecordResult(recordId) {
      if (!recordId) return Promise.resolve(null);
      return gradingRepository.fetchRecordResult(recordId);
    },
  };
}