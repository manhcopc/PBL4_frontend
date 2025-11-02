// import { useState } from "react";
// App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import LoginPage from './pages/LoginPage';
import Dashboard from "./pages/Dashboard";
import Grading from "./pages/Grading";
import ScoreManagement from "./pages/ScoreManagement/ScoreModule";
import ExamManagement from "./pages/ExamManagement/ExamModule";
import TeacherLayout from "./components/shared/TeacherLayout";
import StudentManagement from "./pages/Student/StudentModule";
import Login from "./pages/Login";
import SettingModule from "./pages/Setting/SettingModule";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* <Route path="/login" element={<LoginPage />} /> */}
        <Route element={<TeacherLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/grading" element={<Grading />} />
          <Route path="/scores" element={<ScoreManagement />} />
          <Route path="/exams" element={<ExamManagement />} />
          <Route path="/classes" element={<StudentManagement />} />
          <Route path="/settings" element={<SettingModule />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
