import api from "./clientApi";

const examApi = {
    addExam: (data) => api.post("/Exams/", data),
    updateExam: (id, data) => api.patch(`/Exams/${id}`, data),
    deleteExam: (id) => api.delete(`/Exams/${id}`),
    getExamById: (id) => api.get(`/Exams/${id}`),
    getAllExams: () => api.get("/Exams"),
}

export default examApi;

