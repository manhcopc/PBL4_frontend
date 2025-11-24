import { useEffect, useMemo, useState } from "react";
import { Form, Table, Button, Modal, Spinner } from "react-bootstrap";
import examManagementService from "../../application/examManagement";

export default function AddStudentToExam({
  show,
  onClose,
  onConfirm,
  existingStudentIds = new Set(),
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [studentOptions, setStudentOptions] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (show) {
      fetchStudents();
    } else {
      setSearchTerm("");
      setSelectedIds(new Set());
      setErrorMessage("");
    }
  }, [show]);

  const fetchStudents = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const candidates = await examManagementService.listAvailableStudents();
      setStudentOptions(candidates || []);
    } catch (error) {
      console.error("Không thể tải danh sách thí sinh", error);
      setErrorMessage("Không thể tải danh sách thí sinh.");
      setStudentOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const getStudentKey = (student) =>
    student.examineeId ?? student.id ?? student.recordId;

  const filteredStudents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return (studentOptions || []).filter((student) => {
      if (existingStudentIds.has(getStudentKey(student))) {
        return false;
      }
      if (!term) return true;
      return (
        student.fullName?.toLowerCase().includes(term) ||
        student.name?.toLowerCase().includes(term) ||
        student.studentCode?.toLowerCase().includes(term) ||
        student.student_ID?.toLowerCase().includes(term) ||
        student.className?.toLowerCase().includes(term)
      );
    });
  }, [studentOptions, searchTerm, existingStudentIds]);

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

  const handleConfirm = async () => {
    if (selectedIds.size === 0) {
      onClose?.();
      return;
    }
    setIsSubmitting(true);
    try {
      const selectedStudents = studentOptions.filter((student) =>
        selectedIds.has(getStudentKey(student))
      );
      await onConfirm(selectedStudents);
      onClose?.();
    } catch (error) {
      console.error("Không thể thêm thí sinh", error);
      alert("Không thể thêm thí sinh vào kỳ thi.");
    } finally {
      setIsSubmitting(false);
    }
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
        {loading ? (
          <div className="py-4 text-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : errorMessage ? (
          <div className="text-danger text-center py-3">{errorMessage}</div>
        ) : (
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>Chọn</th>
                <th>Mã Sinh Viên</th>
                <th>Họ Tên</th>
                <th>Lớp</th>
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
                filteredStudents.map((student) => {
                  const key = getStudentKey(student);
                  return (
                    <tr key={key}>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={selectedIds.has(key)}
                          onChange={() => toggleSelection(key)}
                        />
                      </td>
                      <td>
                        {student.studentCode || student.student_ID || key}
                      </td>
                      <td>{student.fullName || student.name || ""}</td>
                      <td>{student.className || ""}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
          Hủy
        </Button>
        <Button
          variant="primary"
          onClick={handleConfirm}
          disabled={selectedIds.size === 0 || isSubmitting}
        >
          {isSubmitting ? "Đang thêm..." : `Thêm${selectedIds.size ? ` (${selectedIds.size})` : ""}`}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
