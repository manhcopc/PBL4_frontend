import { useState } from "react";
import { Form, Button, Container, Modal } from "react-bootstrap";
import examineeApi from "../../services/api/examineeApi";

function StudentAdding({ show, onClose, data, onSuccess }) {
  const isEdit = !!data;
  // const [form, setForm] = useState({ name: "", mssv: "", date_of_birth: "" });
  const [form, setForm] = useState({ name: "", date_of_birth: "" });

  const handleChange = (e) => {
    // setForm({ ...form, [e.target.name]: e.target.value });
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
              date_of_birth: form.date_of_birth, 
            };
      await examineeApi.addExaminee(payload);
      alert("Đã thêm sinh viên thành công!");
      setForm({ name: "", studentId: "", className: "" });
      if (onSuccess) onSuccess();
      onClose();
      console.log(JSON.stringify(form, null, 2));
    } catch (error) {
      console.error("Lỗi thêm sinh viên:", error);
      alert("Không thể thêm sinh viên!");
    }
  };
  return (
    <Modal show={show} onHide={onClose} className="py-4 px-4">
      <div style={{ backgroundColor: "#1C59A1" }}>
        {" "}
        <h3 className="text-center text-white m-2">
          {isEdit ? "Chỉnh sửa thí sinh" : "Thêm sinh viên mới"}
        </h3>
      </div>

      <Form className="m-3" onSubmit={handleSubmit}>
        {/* Tên sinh viên */}
        <Form.Group className="mb-3">
          <Form.Label htmlFor="studentName">Tên sinh viên</Form.Label>
          <Form.Control
            id="studentName"
            type="text"
            name="name"
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* MSSV */}
        <Form.Group className="mb-3">
          <Form.Label htmlFor="studentCode">MSSV</Form.Label>
          <Form.Control
            id="studentCode"
            type="text"
            name="mssv"
            autoComplete="off"
            value={form.mssv || ""}
            onChange={handleChange}
          />
        </Form.Group>

        {/* Ngày sinh */}
        <Form.Group className="mb-3">
          <Form.Label htmlFor="dob">Ngày sinh</Form.Label>
          <Form.Control
            id="dob"
            type="date"
            name="date_of_birth"
            value={form.date_of_birth || ""}
            onChange={handleChange}
            autoComplete="bday"
            required
          />
        </Form.Group>

        <Button className="d-block mx-auto" variant="primary" type="submit">
          Lưu
        </Button>
      </Form>
    </Modal>
  );
}

export default StudentAdding;
