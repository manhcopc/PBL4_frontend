import api from "./api";
export default {
  createPaper: (examId, data) => api.post(`/Exams/${examId}/Papers/`, data),
  updatePaper: (examId, paperId, data) =>
    api.patch(`/Exams/${examId}/Papers/${paperId}/`, data),
  deletePaper: (examId, paperId) =>
    api.delete(`/Exams/${examId}/Papers/${paperId}/`),
  getAllPaper: (examId) => api.get(`/Exams/${examId}/Papers/`),
  batchAnswer: (paperId, data) =>
    api.post(`/ExamPapers/${paperId}/BatchAnswer/`, data),
};

