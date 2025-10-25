import { useParams } from "react-router-dom";
import { Table, Container } from "react-bootstrap";

function ExamDetail() {
  const { id, examId } = useParams();

  const versions = [
    { code: "A", questionCount: 50 },
    { code: "B", questionCount: 50 },
    { code: "C", questionCount: 50 },
  ];

  return (
    <Container className="py-4">
      <h3>
        Danh sách mã đề cho đề thi #{examId} (Lớp {id})
      </h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Mã đề</th>
            <th>Số câu hỏi</th>
          </tr>
        </thead>
        <tbody>
          {versions.map((v, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{v.code}</td>
              <td>{v.questionCount}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default ExamDetail;
