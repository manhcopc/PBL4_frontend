// import { useState } from "react";
import {
  Form,
  Table,
  Button,
  Modal,
  Container,
  Row,
  Col,
  Card,
} from "react-bootstrap";
export default function CreateExam({show, onClose}) {

    
  return (
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title
          className="modal-title me-5 fs-2 mx-auto"
          style={{ color: "#007BFF" }}
        >
          Tạo Đề Thi Mới
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Tên Đề Thi</Form.Label>
            <Form.Control type="text" placeholder="Nhập tên đề thi" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Mô tả</Form.Label>
            <Form.Control type="text" placeholder="Nhập mô tả" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Ngày thi</Form.Label>
            <Form.Control type="date" placeholder="Nhập ngày thi" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Môn Học</Form.Label>
            <Form.Select>
              <option>Toán</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Mô tả</Form.Label>
            <Form.Control type="text" placeholder="Nhập mô tả" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Số Lượng Mã Đề</Form.Label>
            <Form.Control type="number" min="1" defaultValue="1" />
          </Form.Group>
          {/* Đáp án động */}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Hủy
        </Button>
        <Button variant="primary">Tạo</Button>
      </Modal.Footer>
    </Modal>
  );
}
