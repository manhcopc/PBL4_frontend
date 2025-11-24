import { useState } from "react";
import { Form, Button, Container, Modal } from "react-bootstrap";
import studentService from "../../application/studentManagement";

function StudentAdding({ show, onClose, data, onSuccess }) {
  const isEdit = !!data;
  const [form, setForm] = useState({
    fullName: "",
    studentCode: "",
    dateOfBirth: "",
    className: "",
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
              fullName: form.fullName,
              studentCode: form.studentCode,
              dateOfBirth: form.dateOfBirth,
              className: form.className,
            };
      await studentService.addStudent(payload);
      alert("Đã thêm sinh viên thành công!");
      setForm({ fullName: "", studentCode: "", dateOfBirth: "", className: "" });
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
        <Form.Group className="mb-3">
          <Form.Label htmlFor="studentName">Tên sinh viên</Form.Label>
          <Form.Control
            id="studentName"
            type="text"
            name="fullName"
            autoComplete="name"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Nhập tên sinh viên"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="studentCode">MSSV</Form.Label>
          <Form.Control
            id="studentCode"
            type="text"
            name="studentCode"
            autoComplete="student_ID"
            value={form.studentCode}
            onChange={handleChange}
            placeholder="Nhập mã số sinh viên"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="dob">Ngày sinh</Form.Label>
          <Form.Control
            id="dob"
            type="date"
            name="dateOfBirth"
            value={form.dateOfBirth || ""}
            onChange={handleChange}
            placeholder="Nhập ngày sinh"
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

        // <Form.Group className="mb-3">
        //   <Form.Label htmlFor="className">Lớp</Form.Label>
        //   <Form.Control
        //     id="className"
        //     type="text"
        //     name="className"
        //     value={form.className || ""}
        //     onChange={handleChange}
        //     placeholder="Nhập lớp"
        //   />
        // </Form.Group>
