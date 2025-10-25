import { useNavigate, useParams } from "react-router-dom";
import { Table, Button, Container } from "react-bootstrap";

function ClassDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const exams = [
    { id: 101, title: "Giữa kỳ AI", totalVersions: 3 },
    { id: 102, title: "Cuối kỳ AI", totalVersions: 2 },
  ];

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Danh sách đề thi của lớp #{id}</h3>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Tên đề thi</th>
            <th>Số mã đề</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((ex, index) => (
            <tr key={ex.id}>
              <td>{index + 1}</td>
              <td>{ex.title}</td>
              <td>{ex.totalVersions}</td>
              <td>
                <Button
                  size="sm"
                  variant="info"
                  onClick={() => navigate(`/classes/${id}/exam/${ex.id}`)}
                >
                  Xem mã đề
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default ClassDetail;
