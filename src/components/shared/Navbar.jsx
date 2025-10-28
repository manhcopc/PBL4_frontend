import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Navbar as BootstrapNavbar,
  Nav,
  Container,
  Offcanvas,
} from "react-bootstrap";
import { FaCamera, FaTable, FaFileAlt, FaUsers, FaCog } from "react-icons/fa";
import { FaBell, FaSignOutAlt, FaBars } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);

  const handleLogout = () => {
    // onLogout();
    navigate("/login");
  };

  return (
    <>
      <BootstrapNavbar 
        bg="white"
        expand="lg"
        className="border-bottom"
        style={{ borderColor: "#1C59A1", minHeight: "56px", zIndex: 1030 }}
      >
        <Container fluid>
          <button
            variant="outline-primary"
            className="btn btn-outline-primary d-lg-none me-2"
            onClick={onToggleSidebar}
            style={{ border: "none" }}
          >
            <FaBars />
          </button>

          <BootstrapNavbar.Brand
            as={Link}
            to="/dashboard"
            style={{ color: "#007BFF", fontWeight: "600", fontSize: "1.1rem" }}
            className="mx-auto"
          >
            Hệ Thống Chấm Điểm Thông Minh
          </BootstrapNavbar.Brand>

        </Container>
      </BootstrapNavbar>
    </>
  );
};

export default Navbar;
