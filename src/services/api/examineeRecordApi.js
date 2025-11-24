import api from "../api";
const examineeRecordApi = {
    addRecord: (examId, data) =>
        api.post(`/Exams/${examId}/ExamineeRecords/`, data),
    updateRecord: (data, examId, recordId) =>
        api.patch(`/Exams/${examId}/ExamineeRecords/${recordId}/`, data),
    deleteRecord: (examId, recordId) =>
        api.delete(`/Exams/${examId}/ExamineeRecords/${recordId}/`),
    getAllRecord: (examId) =>
        api.get(`/Exams/${examId}/ExamineeRecords`),
    getRecordByPaper: (examId, paperId) =>
        api.get(`/Exams/${examId}/ExamineeRecords`, {
            params: { paper: paperId },
        }),
    getResult: (id) =>
        api.get(`/ExamineeRecords/${id}/Result`)
}
export default examineeRecordApi;

