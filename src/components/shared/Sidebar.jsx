import React from "react";
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { FaCamera, FaTable, FaFileAlt, FaUsers, FaCog } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

// const Sidebar = () => {
//   const location = useLocation();
const Sidebar = ({ items = [], isMobile = false, onItemClick }) => {
  const location = useLocation();

  const handleItemClick = () => {
    // Đóng sidebar trên mobile khi click vào item
    if (isMobile && onItemClick) {
      onItemClick();
    }
  };

  return (
    <div className="h-100">
      <Nav className="flex-column">
        <Nav.Link
          className={`
                py-3 px-3 mb-2 rounded text-decoration-none
              
                ${isMobile ? "border-bottom" : ""}
              `}
          as={Link}
          to="/grading"
          active={location.pathname === "/grading"}
          style={{ color: "#007BFF", marginBottom: "10px" }}
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
          style={{ color: "#007BFF", marginBottom: "10px" }}
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
          style={{ color: "#007BFF", marginBottom: "10px" }}
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
          style={{ color: "#007BFF", marginBottom: "10px" }}
        >
          <FaUsers /> Quản Lý Lớp
        </Nav.Link>
        <Nav.Link
          className={`
                py-3 px-3 mb-2 rounded text-decoration-none
                
                ${isMobile ? "border-bottom" : ""}
              `}
          as={Link}
          to="/settings"
          active={location.pathname === "/settings"}
          style={{ color: "#007BFF", marginBottom: "10px" }}
        >
          <FaCog /> Cài Đặt
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
