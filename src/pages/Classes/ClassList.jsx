import { useNavigate } from "react-router-dom";
import { Table, Button, Container } from "react-bootstrap";

function ClassList() {
  const navigate = useNavigate();

  const classes = [
    {
      id: 1,
      name: "Lớp AI01",
      subject: "Trí tuệ nhân tạo",
      semester: "HK1 2025",
    },
    { id: 2, name: "Lớp CV02", subject: "Xử lý ảnh", semester: "HK1 2025" },
  ];

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Danh sách lớp học</h3>
        <Button variant="primary" onClick={() => navigate("/classes/create")}>
          + Tạo lớp học
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Tên lớp</th>
            <th>Môn học</th>
            <th>Học kỳ</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((cls, index) => (
            <tr key={cls.id}>
              <td>{index + 1}</td>
              <td>{cls.name}</td>
              <td>{cls.subject}</td>
              <td>{cls.semester}</td>
              <td>
                <Button
                  size="sm"
                  variant="info"
                  onClick={() => navigate(`/classes/${cls.id}`)}
                >
                  Xem lớp
                </Button>{" "}
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => navigate(`/classes/${cls.id}/students`)}
                >
                  Quản lý SV
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default ClassList;
