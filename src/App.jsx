// import { useState } from "react";
// App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import LoginPage from './pages/LoginPage';
import Dashboard from "./pages/Dashboard";
import Grading from "./pages/Grading";
import ScoreManagement from "./pages/SroceManagement";
import ExamManagement from "./pages/ExamManagement/ExamModule";
import TeacherLayout from "./components/shared/TeacherLayout";
import ClassModule from "./pages/Classes/ClassModule";
import ClassCreate from "./pages/Classes/ClassCreate";
import ClassDetail from "./pages/Classes/ClassDetail";
import ExamDetail from "./pages/Classes/ExamDetail";
import StudentManager from "./pages/Classes/StudentManager";
import SettingModule from "./pages/Setting/SettingModule";
import Login from "./pages/Login";

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
          <Route path="/classes" element={<ClassModule />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
