// pages/ScoreManagementPage.js
import React from "react";
import { Nav, Form, Table, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const ScoreManagement = () => {
  return (
    <>
      <h2 style={{ color: "#007BFF" }}>Quản Lý Điểm</h2>
      <Nav variant="tabs" defaultActiveKey="/class">
        <Nav.Item>
          <Nav.Link eventKey="class">Theo Lớp</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="subject">Theo Môn Học</Nav.Link>
        </Nav.Item>
      </Nav>
      <Form.Select className="mt-3">
        <option>Chọn Lớp/Môn</option>
      </Form.Select>
      <Table striped bordered hover className="mt-3">
        <thead style={{ backgroundColor: "#007BFF", color: "#FFFFFF" }}>
          <tr>
            <th>Tên Sinh Viên</th>
            <th>Mã SV</th>
            <th>Điểm</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Nguyễn Văn A</td>
            <td>SV001</td>
            <td>9.0</td>
            <td>
              <Button variant="primary" size="sm">
                Chỉnh Sửa
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
      <Button variant="primary">Xuất Excel</Button>
    </>
  );
};

export default ScoreManagement;
