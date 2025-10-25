// pages/ExamManagementPage.js
import React, { useState } from "react";
import { Form, Table, Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const ExamManagement = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <>
      <h2 style={{ color: "#007BFF" }}>Quản Lý Đề Thi và Đáp Án</h2>
      <div className="d-flex justify-content-between mb-3">
        <Form.Control
          type="text"
          className="w-50"
          placeholder="Tra cứu đề thi"
        />
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          Tạo Đề Thi Mới
        </Button>
      </div>
      <Table striped bordered hover>
        <thead style={{ backgroundColor: "#007BFF", color: "#FFFFFF" }}>
          <tr>
            <th>ID Đề Thi</th>
            <th>Tên Đề Thi</th>
            <th>Môn Học</th>
            <th>Số Mã Đề</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>DT001</td>
            <td>Đề Thi Toán</td>
            <td>Toán</td>
            <td>3</td>
            <td>
              <Button variant="info" size="sm">
                Xem
              </Button>{" "}
              <Button variant="warning" size="sm">
                Chỉnh Sửa
              </Button>{" "}
              <Button variant="danger" size="sm">
                Xóa
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>

      {/* Modal Tạo (tương tự cho Edit/View) */}
      <Modal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "#007BFF" }}>Tạo Đề Thi Mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tên Đề Thi</Form.Label>
              <Form.Control type="text" placeholder="Nhập tên đề thi" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Môn Học</Form.Label>
              <Form.Select>
                <option>Toán</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Số Lượng Mã Đề</Form.Label>
              <Form.Control type="number" min="1" defaultValue="1" />
            </Form.Group>
            {/* Đáp án động */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Hủy
          </Button>
          <Button variant="primary">Tạo</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ExamManagement;
