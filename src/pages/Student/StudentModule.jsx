import { Table, Button, Container, Form, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
import StudentAdding from "./StudentAdding.jsx";
import StudentDetail from "./StudentDetail.jsx";
import examineeApi from "../../services/api/examineeApi.js";
function StudentModule() {
  // const { id } = useParams();
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  // const [students, setStudents] = useState([
  //   { id: 1, name: "Nguyễn Văn A", date: "01/01/2000", mssv: "SV001" },
  //   { id: 2, name: "Trần Thị B", date: "02/02/2000", mssv: "SV002" },
  // ]);
  const [students, setStudents] = useState([]);

  const handleDeleteStudent = async (id) => {
    const confirmDelete = window.confirm("Ban co chac muon xoa thi sinh nay")
    if (!confirmDelete) return;

    try {
      await examineeApi.deleteExaminee(id);
      fetchStudents();
    } catch (error) {
      console.error("Lỗi xoá:", error);
      alert("Không thể xoá thí sinh!");
    }
  };

  const fetchStudents = async () => {
    const res = await examineeApi.getAllExaminees();
    setStudents(res.data);
  };
  useEffect(() => {
    fetchStudents();
  }, []);
  // console.log(JSON.stringify(students,null,2))

  return (
    <Container className="mx-auto">
      <h1 style={{ color: "#1C59A1" }}>Danh sách sinh viên lớp </h1>
      <Form>
        <Row>
          <Col>
            <Form.Control
              type="text"
              placeholder="Tìm kiếm sinh viên..."
              className="mr-sm-2"
            />
          </Col>
          <Col>
            <Button variant="primary" type="submit">
              Tìm Kiếm
            </Button>
          </Col>
        </Row>
      </Form>
      <Button
        variant="primary"
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
          {students.map((sv, i) => (
            <tr key={sv.id}>
              <td>{i + 1}</td>
              <td>{sv.mssv}</td>
              <td>{sv.name}</td>
              <td>{sv.date_of_birth}</td>
              <td>
                <Button size="sm" className="mx-auto my-auto" variant="danger" onClick={()=>handleDeleteStudent(sv.id)}>
                  Xóa
                </Button>
                <Button
                  size="sm"
                  variant="info"
                  onClick={() => setShowDetail(true)}
                  className="ms-2 mx-auto my-auto"
                >
                  Chi tiết
                </Button>
                <StudentDetail
                  show={showDetail}
                  onClose={() => setShowDetail(false)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default StudentModule;
