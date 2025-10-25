import React from "react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { Container, Row, Col, Offcanvas } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const TeacherLayout = () => {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const handleCloseMobileSidebar = () => setShowMobileSidebar(false);
  const handleShowMobileSidebar = () => setShowMobileSidebar(true);
  return (
    <>
      {/* <Navbar userName={userName} onLogout={onLogout} /> */}
      <Navbar onToggleSidebar={handleShowMobileSidebar} />
      <Container fluid className="p-0">
        <Row className="g-0">
          <Col
            // md={2}
            // className="sidebar"
            lg={2}
            xl={2}
            className="d-none d-lg-block sidebar"
            style={{
              backgroundColor: "#FFFFFF",
              borderRight: "1px solid #E3F2FD",
              minHeight: "calc(100vh - 56px)",
              position: "sticky",
              top: "56px",
              zIndex: 1020,
            }}
          >
            <Sidebar />
          </Col>
          <Col
            md={10}
            // className="p-4"
            xs={12}
            lg={10}
            xl={10}
            className="main-content"
            style={{
              minHeight: "calc(100vh - 56px)",
              backgroundColor: "#F8F9FA",
            }}
          >
            <div className="p-4">
              <Outlet />
            </div>
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
          style={{ backgroundColor: "#007BFF", color: "white" }}
        >
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          <Sidebar />
        </Offcanvas.Body>
      </Offcanvas>

      <Footer />
    </>
  );
};

export default TeacherLayout;
