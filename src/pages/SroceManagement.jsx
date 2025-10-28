// pages/ScoreManagementPage.js
import React from "react";
import { Row, Col, Nav, Form, Table, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const ScoreManagement = () => {
  return (
    <>
      <h2 style={{ color: "#007BFF" }}>Quản Lý Điểm</h2>
      <Form>
        <Row>
          <Col>
            <Form.Control
              type="text"
              placeholder="Tìm kiếm đề thi..."
              className="mr-sm-2"
            />
          </Col>
          <Col>
            <Button variant="primary" type="submit">
              Tìm Kiếm
            </Button>
          </Col>
        </Row>
      </Form>
      {/* <Form.Select className="mt-3">
        <option>Chọn Lớp/Môn</option>
      </Form.Select> */}
      <Table striped bordered hover className="mt-3">
        <thead style={{ backgroundColor: "#007BFF", color: "#FFFFFF" }}>
          <tr>
            <th>Mã đề thi</th>
            <th>Tên đề thi</th>
            <th>Môn học</th>
            <th>Ngày thi</th>
            <th>Thời gian làm bài</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Đề thi 1</td>
            <td>Đề thi Toán</td>
            <td>Toán học</td>
            <td>01/01/2023</td>
            <td>90 phút</td>
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
