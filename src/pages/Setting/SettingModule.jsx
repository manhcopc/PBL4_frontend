// src/pages/Classes/index.jsx
import { Routes, Route } from "react-router-dom";
import ChangePassword from "./ChangePassword.jsx";

function SettingModule() {
  return (
    <Routes>
      <Route path="/" element={<ChangePassword />} />
      {/* <Route path="/create" element={<ClassCreate />} />
      <Route path="/:id" element={<ClassDetail />} />
      <Route path="/:id/exam/:examId" element={<ExamDetail />} />
      <Route path="/:id/students" element={<StudentManager />} /> */}
    </Routes>
  );
}

export default SettingModule;
