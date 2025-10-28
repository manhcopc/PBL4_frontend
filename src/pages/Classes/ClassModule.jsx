// src/pages/Classes/index.jsx
import { Routes, Route } from "react-router-dom";
import ClassList from "./ClassList.jsx";
import ClassCreate from "./ClassCreate.jsx";
import ClassDetail from "./ClassDetail.jsx";
import ExamDetail from "./ExamDetail.jsx";
import StudentManager from "./StudentManager.jsx";

function ClassModule() {
  return (
    <Routes>
      <Route path="/" element={<ClassList />} />
      <Route path="/:id" element={<ClassDetail />} />
      <Route path="/:id/exam/:examId" element={<ExamDetail />} />
      <Route path="/:id/students" element={<StudentManager />} />
    </Routes>
  );
}

export default ClassModule;
