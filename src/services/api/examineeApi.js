// src/api/examineeApi.js
import api from "../api";

const examineeApi = {
  addExaminee: (data) =>
    api.post("/Examinees/", data),
  updateExaminee: (id, data) =>
    api.patch(`/Examinees/${id}`, data),
  getExamineeById: (id) =>
    api.get(`/Examinees/${id}`),
  deleteExaminee: (id) =>
    api.delete(`/Examinees/${id}`),
  getAllExaminees: () =>
    api.get("/Examinees/"),
  getRecordDetail: (id) =>
    api.get(`Examinee/${id}/RecordsDetail`),
};

export default examineeApi;

