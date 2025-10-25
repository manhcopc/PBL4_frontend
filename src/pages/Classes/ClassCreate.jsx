import { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function ClassCreate() {
  const [form, setForm] = useState({ name: "", subject: "", semester: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Tạo lớp:", form);
    navigate("/classes");
  };

  return (
    <Container className="py-4">
      <h3>Tạo lớp học mới</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Tên lớp</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Môn học</Form.Label>
          <Form.Control
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Học kỳ</Form.Label>
          <Form.Control
            type="text"
            name="semester"
            value={form.semester}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="success" type="submit">
          Lưu lớp học
        </Button>
      </Form>
    </Container>
  );
}

export default ClassCreate;
