import api from "../api";
export default {
    createPaper: (examId, data) =>
        api.post(`/Exams/${examId}/Papers`, data),
    updatePaper: (examId, paperId, data) =>
        api.patch(`/Exams/${examId}/Papers/${paperId}`, data),
    deletePaper: (examId, paperId, data) =>
        api.delete(`/Exams/${examId}/Papers/${paperId}`, data),
    getAllPaper: (examId) =>
        api.get(`/Exams/${examId}/Papers`)
};
