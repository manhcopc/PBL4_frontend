import { Table, Button, Container } from "react-bootstrap";
import { useState } from "react";
import {
  useParams, useNavigate
} from "react-router-dom";
import StudentAdding from "./StudentAdding.jsx";
import StudentDetail from "./StudentDetail.jsx";

function StudentManager() {
  const { id } = useParams();
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [students, setStudents] = useState([
    { id: 1, name: "Nguyễn Văn A", date: "01/01/2000", mssv: "SV001" },
    { id: 2, name: "Trần Thị B", date: "02/02/2000", mssv: "SV002" },
  ]);
    
    const handleDeleteStudent = (id) => {
      setStudents(students.filter(student => student.id !== id));
    };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Danh sách sinh viên lớp </h3>
        <Button variant="primary" onClick={() => setShowAddStudent(true)}>
          + Thêm sinh viên
        </Button>
      </div>

      <StudentAdding show={showAddStudent} onClose={() => setShowAddStudent(false)}/>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>STT</th>
            <th>MSSV</th>
            <th>Họ tên</th>
            <th>Ngày sinh</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {students.map((sv, i) => (
            <tr key={sv.id}>
              <td>{i + 1}</td>
              <td>{sv.mssv}</td>
              <td>{sv.name}</td>
              <td>{sv.date}</td>
              <td>
                <Button size="sm" variant="danger">
                  Xóa
                </Button>
                <Button
                  size="sm"
                  variant="info"
                  onClick={() => setShowDetail(true)}
                  className="ms-2"
                >
                  Chi tiết
                </Button>
                <StudentDetail show={showDetail} onClose={() => setShowDetail(false)} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default StudentManager;
