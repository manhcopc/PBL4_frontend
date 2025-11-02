import { Modal, Table, Button, Row, Col, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
export default function Detail({ show, onClose, exam, examDetails, onSave }) {
    const [localData, setLocalData] = useState(null);

  const sampleDetail = {
    MD001: {
      totalQuestions: 40,
      totalStudents: 20,
      results: [
        { id: 1, name: "Nguyễn Văn A", correct: 35, score: 8.5 },
        { id: 2, name: "Trần Thị B", correct: 30, score: 7.2 },
      ],
    },
    MD002: {
      totalQuestions: 40,
      totalStudents: 18,
      results: [
        { id: 1, name: "Phạm Văn C", correct: 32, score: 8.0 },
        { id: 2, name: "Đỗ Minh D", correct: 29, score: 7.0 },
      ],
    },
  };
  const detail = exam ? sampleDetail[exam] : null;


  useEffect(() => {
    if (detail) {
      setLocalData(JSON.parse(JSON.stringify(detail)));
    }
  }, [exam]);
  useEffect(() => {
    if (exam && examDetails[exam]) {
      setLocalData(JSON.parse(JSON.stringify(examDetails[exam]))); 
    }
  }, [exam, examDetails]);

  if (!exam || !localData) return null;

  const handleChange = (id, field, value) => {
    const updated = localData.results.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setLocalData({ ...localData, results: updated });
  };

  const handleSave = () => {
    console.log("Dữ liệu đã lưu:", localData);
    if (onSave) onSave(exam, localData);
    onClose();
  };

const averageScore =
  localData && localData.results && localData.results.length > 0
    ? (
        localData.results.reduce(
          (acc, cur) => acc + parseFloat(cur.score || 0),
          0
        ) / localData.results.length
      ).toFixed(2)
    : 0;
  return (
    <Modal
      style={{ boxShadow: "0 4px 20px rgba(13, 110, 253, 0.3)" }}
      className="shadow-lg"
      show={show}
      onHide={onClose}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Chi tiết mã đề <span className="text-primary fw-bold">{exam}</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>
          <strong>Tổng số câu hỏi:</strong> {detail.totalQuestions}
        </p>
        <p>
          <strong>Tổng số sinh viên:</strong> {detail.totalStudents}
        </p>
        <p>
          <strong>Điểm trung bình: </strong>

          {averageScore}
        </p>

        <hr />
        <h6 className="fw-bold text-secondary mb-3">Danh sách kết quả</h6>

        <Table bordered hover responsive>
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Tên sinh viên</th>
              <th>Số câu đúng</th>
              <th>Điểm</th>
              <th>Bài thi chưa chấm</th>
              <th>Bài thi đã chấm</th>
            </tr>
          </thead>
          <tbody>
            {detail.results.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td style={{ width: "150px" }}>
                  <Form.Control
                    type="number"
                    min="0"
                    max={localData.totalQuestions}
                    value={item.correct}
                    onChange={(e) =>
                      handleChange(item.id, "correct", e.target.value)
                    }
                  />
                </td>
                <td style={{ width: "150px" }}>
                  <Form.Control
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={item.score}
                    onChange={(e) =>
                      handleChange(item.id, "score", e.target.value)
                    }
                  />
                </td>
                <td><img src="#" alt="Ảnh chưa chấm" /></td>
                <td><img src="#" alt="Ảnh đã chấm" /></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Đóng
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Lưu thay đổi
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
