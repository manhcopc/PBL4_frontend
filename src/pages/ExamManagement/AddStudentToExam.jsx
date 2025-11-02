import { useEffect, useState } from "react";
import { BiSolidDetail } from "react-icons/bi";
import { FaList } from "react-icons/fa";
import {
  Tab,
  Nav,
  Form,
  Table,
  Button,
  Modal,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import "../../assets/NavbarHover.css";
const STUDENT_POOL = [
  { id: "SV001", fullName: "Nguyễn Văn A" },
  { id: "SV002", fullName: "Trần Thị B" },
  { id: "SV003", fullName: "Lê Thị C" },
  { id: "SV004", fullName: "Phạm Quốc D" },
  { id: "SV005", fullName: "Đỗ Minh E" },
];
function AddStudentToExam({ show, onClose, onConfirm, existingStudentIds }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState(new Set());

  useEffect(() => {
    if (!show) {
      setSearchTerm("");
      setSelectedIds(new Set());
    }
  }, [show]);

  const normalizedTerm = searchTerm.trim().toLowerCase();

  const filteredStudents = STUDENT_POOL.filter((student) => {
    if (existingStudentIds.has(student.id)) {
      return false;
    }
    if (!normalizedTerm) {
      return true;
    }
    return (
      student.id.toLowerCase().includes(normalizedTerm) ||
      student.fullName.toLowerCase().includes(normalizedTerm) ||
      student.className.toLowerCase().includes(normalizedTerm)
    );
  });

  const toggleSelection = (studentId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(studentId)) {
        next.delete(studentId);
      } else {
        next.add(studentId);
      }
      return next;
    });
  };

  const handleConfirm = () => {
    if (selectedIds.size === 0) {
      onClose();
      return;
    }
    const selectedStudents = STUDENT_POOL.filter((student) =>
      selectedIds.has(student.id)
    );
    onConfirm(selectedStudents);
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Thêm thí sinh vào kỳ thi</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="mb-3" onSubmit={(e) => e.preventDefault()}>
          <Form.Control
            type="text"
            placeholder="Tìm kiếm theo mã, họ tên hoặc lớp..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form>
        <Table striped hover responsive>
          <thead>
            <tr>
              <th>Chọn</th>
              <th>Mã Sinh Viên</th>
              <th>Họ Tên</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-muted py-3">
                  Không tìm thấy thí sinh phù hợp.
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={selectedIds.has(student.id)}
                      onChange={() => toggleSelection(student.id)}
                    />
                  </td>
                  <td>{student.id}</td>
                  <td>{student.fullName}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Hủy
        </Button>
        <Button
          variant="primary"
          onClick={handleConfirm}
          disabled={selectedIds.size === 0}
        >
          Thêm {selectedIds.size > 0 ? `(${selectedIds.size})` : ""}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
export default AddStudentToExam;
