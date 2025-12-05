import createGradingRepository from "../../repository/grading/gradingRepository";

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
    fetchCameraStreamUrl() {
      return gradingRepository.fetchCameraFrame();
    },
    fetchCameraSnapshot() {
      return gradingRepository.fetchCameraSnapshot();
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
    async saveResult({ exam, result }) {
      try {
        if (!exam) {
          throw new Error("Exam data is missing or undefined.");
        }
        const payload = {
          exam,
          result: {
            sbd: result.sbd,
            made: result.made, 
            answers: result.answers,
            original_image: result.originalImage || null, 
            original_image_name: result.originalImageName || null, 
            processed_image: result.processedImage || null, 
            processed_image_name: result.processedImageName || null, 
          },
        };

        console.log("Payload gửi đến API:", payload);

        const response = await gradingRepository.saveResult(payload);
        console.log("Phản hồi từ API:", response);
        return response;
      } catch (error) {
        console.error("Lỗi từ API:", error.response?.data || error.message);
        throw error;
      }
    },
    fetchRecordResult(recordId) {
      if (!recordId) return null;
      return gradingRepository.fetchRecordResult(recordId);
    },
  };
}
