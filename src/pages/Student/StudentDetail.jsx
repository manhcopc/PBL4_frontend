import { useEffect, useState } from "react";
import { Container, Modal, Row, Col, Card, Button } from "react-bootstrap";

function StudentDetail({ show, onClose, data }) {
  const [studentDetail, setStudentDetail] = useState({name: "", date_of_birth:""});
  useEffect(() => {
    if (data) {
      setStudentDetail((prev) => ({
        ...prev,
        fullName: data.name,
        // studentCode: data.mssv,
        date_of_birth: data.date_of_birth,
      }));
    }
  }, [data]);
  if (!data) return null;
  const handleResetToSample = () => {
    setStudentDetail();
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) {
      return isoDate;
    }
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <Modal
      style={{ borderRadius: "1rem" }}
      show={show}
      onHide={onClose}
      className="py-5 px-4 "
    >
      <h2 className="text-center mt-2 fw-bold">Thông tin sinh viên</h2>
      <Container
        fluid
        className="text-white p-4"
        style={{ backgroundColor: "#1C59A1" }}
      >
        <Row className="align-items-center text-sm-start text-center">
          <Col sm={6} className="mb-3 mb-sm-0">
            <img
              className="img-fluid rounded bg-light p-1"
              src="https://i.pravatar.cc/200?img=12"
              alt={data.name}
              style={{ maxWidth: "200px" }}
            />
          </Col>

          <Col sm={6}>
            <p className="mb-1 fw-bold">Họ và tên: {data.name}</p>
            <p className="mb-1 fw-bold">MSSV: {data.mssv}</p>
            <p className="mb-0 fw-bold">Ngày sinh: {formatDate(data.date_of_birth)}</p>
          </Col>
        </Row>
        <hr className="mb-0" />
        <Row className="mt-0 ">
          <Col>
            <h3 className="fw-bold text-center ">Thông tin bài thi</h3>
          </Col>
        </Row>
        <Row className="mt-0">
          {studentDetail.exams.length === 0 ? (
            <Col>
              <div className="bg-white text-center text-secondary py-4 px-3 rounded mt-4">
                Chưa có bài thi nào được ghi nhận.
              </div>
            </Col>
          ) : (
            studentDetail.exams.map((exam) => (
              <Col className="col-md-6 mb-3" key={exam.examId}>
                <Card className="mt-4 border-0 shadow-sm h-100">
                  <Card.Body className="d-flex flex-column justify-content-between">
                    <div>
                      <h5 className="fw-bold text-primary">{exam.examName}</h5>
                      <p className="text-secondary mb-2">Mã đề: {exam.examCode}</p>
                      <p className="mb-2 text-dark">
                        Ngày thi: {formatDate(exam.takenAt)}
                      </p>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="text-center flex-fill">
                        <p className="fw-bold text-black mb-1">Số câu đúng</p>
                        <h4 className="text-success fs-5 mb-0">
                          {exam.correctCount} / {exam.totalQuestions}
                        </h4>
                      </div>
                      <div className="text-center flex-fill">
                        <p className="fw-bold text-black mb-1">Điểm</p>
                        <h4 className="text-primary fw-bold mb-0">{exam.score}</h4>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
        <Row className="mt-3">
          <Col className="d-flex justify-content-end gap-2">
            <Button variant="outline-light" onClick={handleResetToSample}>
              Tải lại dữ liệu mẫu
            </Button>
            <Button variant="light" onClick={onClose}>
              Đóng
            </Button>
          </Col>
        </Row>
      </Container>
    </Modal>
  );
}

export default StudentDetail;
