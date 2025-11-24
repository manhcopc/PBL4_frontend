import examineeApi from "../../services/api/examineeApi";
import {
  mapStudentEntity,
  mapStudentDetailResponse,
} from "../../domain/student/mappers";

export default function createStudentRepository() {
  return {
    async getStudents() {
      const res = await examineeApi.getAllExaminees();
      const list = Array.isArray(res.data) ? res.data : [];
      return list.map((item) => mapStudentEntity(item));
    },
    async addStudent(payload) {
      return examineeApi.addExaminee(payload);
    },
    async deleteStudent(studentId) {
      return examineeApi.deleteExaminee(studentId);
    },
    async getStudentDetail(studentId) {
      const res = await examineeApi.getRecordDetail(studentId);
      return mapStudentDetailResponse(res.data || {}, { id: studentId });
    },
  };
}
