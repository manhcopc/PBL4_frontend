import React from "react";
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import {
  FaSignOutAlt,
  FaCamera,
  FaTable,
  FaFileAlt,
  FaUsers,
  FaCog,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

// const Sidebar = () => {
//   const location = useLocation();
const Sidebar = ({ items = [], isMobile = false, onItemClick }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleItemClick = () => {
    // Đóng sidebar trên mobile khi click vào item
    if (isMobile && onItemClick) {
      onItemClick();
    }
  };
  const handleLogout = () => {
    // onLogout();
    navigate("/login");
  }

  return (
    // <div style={{ backgroundColor: "#f8f9fa" }} className="h-100">
    <div
      style={{ backgroundColor: "#1C59A1" }}
      className="d-flex flex-column h-100"
    >
      <span className="d-flex flex-column align-items-center">
        <img
          src="/logo192.png"
          alt="Logo"
          className="d-inline mx-auto mt-3 w-3 h-auto mx-auto my-auto"
          // style={{ width: "80px", height: "80px", borderRadius: "50%" }}
        />
        <h2 className="d-block text-center mt-2 text-white">Tên giáo viên</h2>
      </span>

      <hr />
      <Nav className="flex-column justify-content-around text-align-center h-100 p-3">
        <Nav.Link
          className={`
                py-3 px-3 mb-2 rounded text-decoration-none
              
                ${isMobile ? "border-bottom" : ""}
              `}
          as={Link}
          to="/grading"
          active={location.pathname === "/grading"}
          style={{ color: "#FFFFFF", marginBottom: "10px" }}
        >
          <FaCamera /> Chấm Bài Tập
        </Nav.Link>
        <Nav.Link
          className={`
                py-3 px-3 mb-2 rounded text-decoration-none
              
                ${isMobile ? "border-bottom" : ""}
              `}
          as={Link}
          to="/scores"
          active={location.pathname === "/scores"}
          style={{ color: "#FFFFFF", marginBottom: "10px" }}
        >
          <FaTable /> Quản Lý Điểm
        </Nav.Link>
        <Nav.Link
          className={`
                py-3 px-3 mb-2 rounded text-decoration-none

                ${isMobile ? "border-bottom" : ""}
              `}
          as={Link}
          to="/exams"
          active={location.pathname === "/exams"}
          style={{ color: "#FFFFFF", marginBottom: "10px" }}
        >
          <FaFileAlt /> Quản Lý Đề Thi
        </Nav.Link>
        <Nav.Link
          className={`
                py-3 px-3 mb-2 rounded text-decoration-none
               
                ${isMobile ? "border-bottom" : ""}
              `}
          as={Link}
          to="/classes"
          active={location.pathname === "/classes"}
          style={{ color: "#FFFFFF", marginBottom: "10px" }}
        >
          <FaUsers /> Quản lí sinh viên
        </Nav.Link>
        <Nav.Link
          className={`
                py-3 px-3 mb-2 rounded text-decoration-none
                
                ${isMobile ? "border-bottom" : ""}
              `}
          as={Link}
          to="/settings"
          active={location.pathname === "/settings"}
          style={{ color: "#FFFFFF", marginBottom: "10px" }}
        >
          <FaCog /> Cài Đặt
        </Nav.Link>
        <Nav.Link
          onClick={handleLogout}
          className="btn btn-danger text-white "
          style={{ backgroundColor: "#ff4d4f", color: "white", margin: "20px" }}
        >
          <FaSignOutAlt /> Đăng Xuất
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
