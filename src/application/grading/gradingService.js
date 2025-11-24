import createGradingRepository from "../../infrastructure/grading/gradingRepository";

const gradingRepository = createGradingRepository();

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
    fetchCameraSnapshot() {
      return gradingRepository.fetchCameraFrame();
    },
    listRecords(examId) {
      if (!examId) return [];
      return gradingRepository.listRecords(examId);
    },
    async processImage({ file }) {
      if (!file) {
        throw new Error("Thiếu ảnh để chấm bài thi.");
      }
      const normalizedFile = ensureFileObject(file);
      return gradingRepository.processImage(normalizedFile);
    },
    async saveResult({ examId, result }) {
      if (!examId || !result) {
        throw new Error("Thiếu dữ liệu để lưu kết quả chấm.");
      }
      await gradingRepository.saveResult({
        exam: examId,
        result,
      });
    },
    fetchRecordResult(recordId) {
      if (!recordId) return null;
      return gradingRepository.fetchRecordResult(recordId);
    },
  };
}
