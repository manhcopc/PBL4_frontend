import { useState } from "react";
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
import examApi from "../../api/examApi";
export default function CreateExam({ show, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    subject: "",
    description: "",
    exam_date: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        exam_date: form.exam_date,
      };
      await examApi.addExam(payload);
      alert("Đã thêm kì thi thành công!");
      setForm({ name: "", subject: "", description: "", exam_date: "" });
      if (onSuccess) onSuccess();
      onClose();
      console.log(JSON.stringify(form, null, 2));
    } catch (error) {
      console.error("Lỗi thêm kì thi:", error);
      alert("Không thể thêm kì thi!");
    }
  };
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
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Tên Đề Thi</Form.Label>
            <Form.Control
              id="examName"
              name="name"
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              required
              type="text"
              placeholder="Nhập tên đề thi"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Mô tả</Form.Label>
            <Form.Control
              id="description"
              name="description"
              autoComplete="description"
              value={form.description}
              onChange={handleChange}
              required
              type="text"
              placeholder="Nhập mô tả"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Ngày thi</Form.Label>
            <Form.Control
              id="date"
              name="exam_date"
              autoComplete="bday"
              value={form.exam_date || ""}
              onChange={handleChange}
              required
              type="date"
              placeholder="Nhập ngày thi"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Môn Học</Form.Label>
            <Form.Control
              id="subject"
              name="subject"
              autoComplete="subject"
              value={form.subject}
              onChange={handleChange}
              required
              type="text"
              placeholder="Nhập môn học"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Số Lượng Mã Đề</Form.Label>
            <Form.Control type="number" min="1" defaultValue="1" />
          </Form.Group>
          {/* Đáp án động */}
          <Button variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button variant="primary" type="submit">
            Tạo
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
}
