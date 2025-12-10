import React from "react";
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { MdDashboard } from 'react-icons/md';
import {
  FaSignOutAlt,
  FaCamera,
  FaTable,
  FaFileAlt,
  FaUsers,
  FaCog,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/NavbarHover.css"
import { useNavigate } from "react-router-dom";
import authService from "../../service/auth";
import logo from "../../assets/logo.png";

// const Sidebar = () => {
//   const location = useLocation();
const Sidebar = ({ items = [], isMobile = false, onItemClick }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleItemClick = () => {
    if (isMobile && onItemClick) {
      onItemClick();
    }
  };
  const handleLogout = () => {
    authService.logout();
    navigate("/login", { replace: true });
  };
  // if (!isAuthenticated) {
  //   navigate("/login", { replace: true });
  //   return null;
  // }

  return (
    // <div style={{ backgroundColor: "#f8f9fa" }} className="h-100">
    <div
      style={{ backgroundColor: "#1C59A1" }}
      className="d-flex flex-column h-100"
    >
      <span className="d-flex flex-column align-items-center mt-4">
        <img
          className="img-fluid rounded bg-light p-1"
          src={logo}
          alt="Logo"
          style={{ maxWidth: "100px", borderRadius: "100%" }}
        />
        {/* <h2 className="d-block text-center mt-2 text-white">Tên giáo viên</h2> */}
      </span>
      {/* <img src={logo} width="40" className="me-2" alt="logo" /> */}

      <hr />
      <Nav
        variant="tabs"
        defaultActiveKey="dashboard"
        className="custom-nav flex-column justify-content-around text-align-center h-100 p-3"
      >
        {/* <Nav.Item>
          <Nav.Link
            eventKey="dashboard"
            className={`nav-link
                  py-3 px-3 mb-2 rounded text-decoration-none
          
                  ${isMobile ? "border-bottom" : ""}
                `}
            as={Link}
            to="/"
            active={location.pathname === "/"}
            style={{ color: "#FFFFFF", marginBottom: "10px" }}
          >
            <MdDashboard /> Dashboard
          </Nav.Link>
        </Nav.Item> */}
        <Nav.Link
          eventKey={"grading"}
          className={`nav-link
                py-3 px-3 mb-2 rounded text-decoration-none
              
                ${isMobile ? "border-bottom" : ""}
              `}
          as={Link}
          to="/"
          active={location.pathname === "/"}
          style={{ color: "#FFFFFF", marginBottom: "10px" }}
        >
          <FaCamera /> Chấm Bài Tập
        </Nav.Link>
        <Nav.Link
          eventKey={"scores"}
          className={`nav-link
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
          eventKey={"exams"}
          className={`nav-link
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
          eventKey={"classes"}
          className={`nav-link
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
          eventKey={"settings"}
          className={`nav-link
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
