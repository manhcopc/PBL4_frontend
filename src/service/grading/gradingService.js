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
      if (!examId) return Promise.resolve([]);
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
        if (!exam) throw new Error("Thiếu ID kỳ thi (exam).");
        if (!result) throw new Error("Thiếu kết quả chấm (result).");
        const payload = {
          exam: exam,
          result: {
            sbd: result.sbd || "",
            made: result.made || "",
            answers: result.answers || {}, 
            
            original_image: result.originalImage || null,
            original_image_name: result.originalImageName || null,
            processed_image: result.processedImage || null,
            processed_image_name: result.processedImageName || null,
          },
        };

        const response = await gradingRepository.saveResult(payload);
        return response;
      } catch (error) {
        console.error("Lỗi saveResult Service:", error);
        throw error;
      }
    },
    
    fetchRecordResult(recordId) {
      if (!recordId) return Promise.resolve(null);
      return gradingRepository.fetchRecordResult(recordId);
    },
  };
}