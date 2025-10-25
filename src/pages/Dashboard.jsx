// pages/TeacherDashboard.js
import React from "react";
import { Row, Col, Button, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = () => {
  return (
    <>
      <h2 style={{ color: "#007BFF" }}>Dashboard Giáo Viên</h2>
      <Row>
        <Col md={4}>
          <Card className="p-3" style={{ border: "1px solid #E3F2FD" }}>
            <h5>Số Lớp Học</h5>
            <p className="display-4">5</p>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="p-3" style={{ border: "1px solid #E3F2FD" }}>
            <h5>Bài Tập Cần Chấm</h5>
            <p className="display-4">12</p>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="p-3" style={{ border: "1px solid #E3F2FD" }}>
            <h5>Điểm Trung Bình</h5>
            <p className="display-4">8.5</p>
          </Card>
        </Col>
      </Row>
      <Button variant="primary" className="mt-4">
        Tạo Bài Tập Mới
      </Button>
      {/* Thêm ChartComponent nếu cần */}
      <canvas id="scoreChart" className="mt-4"></canvas>
    </>
  );
};

export default Dashboard;
