import { useState } from "react";
import { Form, Button, Container, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function StudentAdding({show, onClose}) {
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
    <Modal show={show} onHide={onClose} className="py-4 px-4 ">
      <h3 className="text-center">Thêm sinh viên mới</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Tên sinh viên</Form.Label> {/* Updated label */}
          <Form.Control
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>MSSV</Form.Label>
          <Form.Control
            type="text"
            name="mssv" 
            value={form.mssv} 
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Ngày sinh</Form.Label>
          <Form.Control
            type="text"
            name="dateOfBirth"
            value={form.dateOfBirth}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button className="d-block px-auto" variant="success" type="submit">
          Lưu
        </Button>
      </Form>
    </Modal>
  );
}

export default StudentAdding;
