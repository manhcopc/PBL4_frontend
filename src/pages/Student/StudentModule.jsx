import { Table, Button, Container, Form, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import StudentAdding from "./StudentAdding.jsx";
import StudentDetail from "./StudentDetail.jsx";
import studentService from "../../service/studentManagement";
function StudentModule() {
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDeleteStudent = async (id) => {
    const confirmDelete = window.confirm("Ban co chac muon xoa thi sinh nay");
    if (!confirmDelete) return;

    try {
      await studentService.deleteStudent(id);
      fetchStudents();
    } catch (error) {
      console.error("Lỗi xoá:", error);
      alert("Không thể xoá thí sinh!");
    }
  };

  const fetchStudents = async () => {
    try {
      const list = await studentService.listStudents();
      setStudents(list);
    } catch (error) {
      console.error("Không thể tải danh sách thí sinh", error);
      setStudents([]);
    }
  };
  useEffect(() => {
    fetchStudents();
  }, []);


  return (
    <>
      <h1 className="mx-auto" style={{ color: "#1C59A1" }}>
        Danh sách sinh viên lớp{" "}
      </h1>
      <Form onSubmit={(e) => e.preventDefault()}>
        <Row>
          <Col>
            <Form.Control
              type="text"
              placeholder="Tìm kiếm sinh viên..."
              className="mr-sm-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col>
            <Button
              variant="outline-secondary"
              type="button"
              onClick={() => setSearchTerm("")}
            >
              Xóa tìm kiếm
            </Button>
          </Col>
        </Row>
      </Form>
      <Button
        style={{ backgroundColor: "#1C59A1", color: "white" }}
        className="mb-4 mt-3"
        onClick={() => setShowAddStudent(true)}
      >
        + Thêm sinh viên
      </Button>
      <StudentAdding
        show={showAddStudent}
        onClose={() => setShowAddStudent(false)}
        onSuccess={fetchStudents}
      />
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th className="fs-6">STT</th>
            <th className="fs-6">MSSV</th>
            <th className="fs-6">Họ tên</th>
            <th className="fs-6">Ngày sinh</th>
            <th className="fs-6">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {students
            .filter((student) => {
              const term = searchTerm.trim().toLowerCase();
              if (!term) return true;
              return (
                student.fullName.toLowerCase().includes(term) ||
                student.studentCode.toLowerCase().includes(term)
              );
            })
            .map((sv, i) => (
              <tr key={sv.id}>
                <td>{i + 1}</td>
                <td>{sv.studentCode}</td>
                <td>{sv.fullName}</td>
                <td>{sv.dateOfBirth}</td>
                <td>
                  <Button
                    size="sm"
                    className="mx-auto my-auto"
                    variant="danger"
                    onClick={() => handleDeleteStudent(sv.id)}
                  >
                    Xóa
                  </Button>
                  <Button
                    size="sm"
                    variant="info"
                    onClick={() => {
                      setSelectedStudent(sv);
                      setShowDetail(true);
                    }}
                    className="ms-2 mx-auto my-auto"
                  >
                    Chi tiết
                  </Button>
                </td>
              </tr>
            ))}
          <StudentDetail
            show={showDetail}
            onClose={() => setShowDetail(false)}
            data={selectedStudent}
          />
        </tbody>
      </Table>
    </>
  );
}

export default StudentModule;
