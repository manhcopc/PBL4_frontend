import { Table, Button, Container } from "react-bootstrap";
import { useParams } from "react-router-dom";

function StudentManager() {
  const { id } = useParams();

  const students = [
    { id: 1, name: "Nguyễn Văn A", mssv: "SV001" },
    { id: 2, name: "Trần Thị B", mssv: "SV002" },
  ];

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Danh sách sinh viên lớp #{id}</h3>
        <Button variant="primary">+ Thêm sinh viên</Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>MSSV</th>
            <th>Họ tên</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {students.map((sv, i) => (
            <tr key={sv.id}>
              <td>{i + 1}</td>
              <td>{sv.mssv}</td>
              <td>{sv.name}</td>
              <td>
                <Button size="sm" variant="danger">
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default StudentManager;
