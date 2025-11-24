import createStudentRepository from "../../infrastructure/student/studentRepository";

const studentRepository = createStudentRepository();

export default function createStudentService() {
  return {
    listStudents() {
      return studentRepository.getStudents();
    },
    async addStudent(studentForm) {
      const payload = {
        name: studentForm.fullName ?? studentForm.name ?? "",
        student_ID: studentForm.studentCode ?? studentForm.student_ID ?? "",
        date_of_birth:
          studentForm.dateOfBirth ?? studentForm.date_of_birth ?? "",
        className: studentForm.className ?? "",
      };
      return studentRepository.addStudent(payload);
    },
    deleteStudent(studentId) {
      return studentRepository.deleteStudent(studentId);
    },
    getStudentDetail(studentId) {
      return studentRepository.getStudentDetail(studentId);
    },
  };
}
