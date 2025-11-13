import api from "../api";
const paperAnswerApi = {
    addAnswer: (paperId, data) =>
        api.post(`/ExamPapers/${paperId}/Answers/`, data),
    updateAnswer: (data, paperId, answerId) =>
        api.patch(`/ExamPapers/${paperId}/Answers/${answerId}/`, data),
    deleteAnswer: (paperId, answerId) =>
        api.delete(`/ExamPapers/${paperId}/Answers/${answerId}/`),
    getAllAnswer: (paperId) =>
        api.get(`/ExamPapers/${paperId}/Answers`),
}
export default paperAnswerApi;