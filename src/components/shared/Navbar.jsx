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
        expand="lg"
        className=""
        style={{
          minHeight: "56px",
          zIndex: 1030,
          backgroundColor: "#1C59A1",
        }}
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
            to="/"
            style={{ color: "#1C59A1", fontWeight: "600" }}
            className="text-white mx-auto fs-3"
          >
            Hệ Thống Chấm Điểm Thông Minh
          </BootstrapNavbar.Brand>
        </Container>
      </BootstrapNavbar>
    </>
  );
};

export default Navbar;
