import { useState } from "react";
import {
  Form,
  Table,
  Button,
  Modal,
  Container,
  Row,
  Col,
  Card,
} from "react-bootstrap";
export default function EditExam({ show, onClose }) {
  const [examCodes, setExamCodes] = useState([{ code: "", answers: ["A"] }]);
  const [numberOfExamCodes, setNumberOfExamCodes] = useState(1);
  const [numberOfAnswers, setNumberOfAnswers] = useState(1);
  const handleNumberOfExamCodesChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setNumberOfExamCodes(value);

    // mở rộng hoặc cắt mảng examCodes
    const newExamCodes = Array.from({ length: value }, (_, i) => {
      return examCodes[i] || { code: ``, answers: ["A"] };
    });
    setExamCodes(newExamCodes);
  };
  const handleChangeExamCode = (index, value) => {
    const updated = [...examCodes];
    updated[index].code = value;
    setExamCodes(updated);
  };

  // ✅ Khi thay đổi số lượng câu hỏi
  const handleNumberOfAnswersChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setNumberOfAnswers(value);
    // cập nhật lại mảng answers trong từng mã đề
    const updated = examCodes.map((exam) => ({
      ...exam,
      answers: Array.from({ length: value }, (_, i) => exam.answers[i] || "A"),
    }));
    setExamCodes(updated);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dữ liệu toàn bộ mã đề:", examCodes);
  };
  const handleChangeAnswer = (examIndex, questionIndex, value) => {
    const updated = [...examCodes];
    updated[examIndex].answers[questionIndex] = value;
    setExamCodes(updated);
  };
  return (
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title style={{ color: "#007BFF" }}>Chỉnh sửa đề thi</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit} className="p-4">
          <Form.Group className="mb-3">
            <Form.Label>Tên Đề Thi</Form.Label>
            <Form.Control type="text" placeholder="Nhập tên đề thi" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Môn Học</Form.Label>
            <Form.Select>
              <option>Toán</option>
            </Form.Select>
          </Form.Group>
          {/* --- Thiết lập số lượng --- */}
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Tổng số mã đề</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={numberOfExamCodes}
                  onChange={handleNumberOfExamCodesChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Số lượng câu hỏi mỗi mã đề</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={numberOfAnswers}
                  onChange={handleNumberOfAnswersChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* --- Hiển thị từng mã đề --- */}
          <Row>
            {examCodes.map((exam, examIndex) => (
              <Col className="col-lg-4 col-md-6" key={examIndex}>
                <Card key={examIndex} className="mb-4 flex-lg-4">
                  <Card.Header className="d-flex align-items-center justify-content-between">
                    <Form.Group className="d-flex align-items-center mb-2">
                      <Form.Label className="me-2 mb-0">
                        Mã đề {examIndex + 1}:
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Nhập mã đề"
                        value={exam.code}
                        onChange={(e) =>
                          handleChangeExamCode(examIndex, e.target.value)
                        }
                      />
                    </Form.Group>
                  </Card.Header>
                  <Card.Body>
                    {Array.from({ length: numberOfAnswers }).map(
                      (_, questionIndex) => (
                        <Form.Group
                          key={questionIndex}
                          className="d-flex align-items-center mb-2"
                        >
                          <Form.Label
                            className="me-3 mb-0"
                            style={{ width: "80px" }}
                          >
                            Câu {questionIndex + 1}
                          </Form.Label>
                          <Form.Select
                            value={exam.answers[questionIndex]}
                            onChange={(e) =>
                              handleChangeAnswer(
                                examIndex,
                                questionIndex,
                                e.target.value
                              )
                            }
                            style={{ width: "100px" }}
                          >
                            <option>A</option>
                            <option>B</option>
                            <option>C</option>
                            <option>D</option>
                          </Form.Select>
                        </Form.Group>
                      )
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Hủy
        </Button>
        <Button variant="primary">Lưu</Button>
      </Modal.Footer>
    </Modal>
  );
}
