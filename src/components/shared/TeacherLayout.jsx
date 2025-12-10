import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Container, Row, Col, Offcanvas } from "react-bootstrap";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";

const TeacherLayout = () => {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const handleCloseMobileSidebar = () => setShowMobileSidebar(false);
  const handleShowMobileSidebar = () => setShowMobileSidebar(true);

  return (
    <>
      <Navbar
        className="position-sticky top-0 w-100 shadow-sm"
        onToggleSidebar={handleShowMobileSidebar}
        style={{
          zIndex: 1030,
          backgroundColor: "white",
          minHeight: "var(--bs-navbar-height, 56px)",
        }}
      />
      <Container fluid className="p-0">
        <Row className="g-0 flex-nowrap">
          <Col
            lg={2}
            xl={2}
            className="d-none d-lg-block"
            style={{
              backgroundColor: "#FFFFFF",
              borderRight: "1px solid #E3F2FD",
              position: "sticky",
              top: 0,
              height: "100vh",
              overflowY: "auto",
            }}
          >
            <Sidebar />
          </Col>
          <Col
            xs={12}
            lg={10}
            xl={10}
            className="p-4"
            style={{
              backgroundColor: "#F8F9FA",
              minHeight: "100vh",
            }}
          >
            <Outlet />
          </Col>
        </Row>
      </Container>
      <Offcanvas
        show={showMobileSidebar}
        onHide={handleCloseMobileSidebar}
        placement="start"
        className="d-lg-none"
      >
        <Offcanvas.Header
          closeButton
          style={{ backgroundColor: "#1C59A1", color: "white" }}
        >

        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          <Sidebar />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default TeacherLayout;
