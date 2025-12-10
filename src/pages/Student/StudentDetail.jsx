import { useEffect, useState } from "react";
import { Container, Modal, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import studentService from "../../service/studentManagement";

function StudentDetail({ show, onClose, data }) {
  const [studentDetail, setStudentDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      if (!show || !data?.id) {
        return;
      }
      setIsLoading(true);
      setErrorMessage("");
      try {
        const detail = await studentService.getStudentDetail(data.id);
        setStudentDetail({
          name: detail.student.fullName || data.fullName || data.name || "",
          mssv: detail.student.studentCode || data.studentCode || data.student_ID || "",
          date_of_birth: detail.student.dateOfBirth || data.dateOfBirth || data.date_of_birth || "",
          exams: detail.records || [],
        });
      } catch (error) {
        console.error("Không thể tải chi tiết sinh viên", error);
        setErrorMessage("Không thể tải thông tin chi tiết của sinh viên.");
        setStudentDetail({
          name: data.fullName ?? data.name ?? "",
          mssv: data.studentCode ?? data.student_ID ?? data.mssv ?? "",
          date_of_birth: data.dateOfBirth ?? data.date_of_birth ?? "",
          exams: [],
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [show, data]);

  if (!data) return null;

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) return isoDate;
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <Modal
      style={{ borderRadius: "1rem" }}
      show={show}
      onHide={onClose}
      className="py-5 px-4"
    >
      <h2 className="text-center mt-2 fw-bold">Thông tin sinh viên</h2>

      <Container
        fluid
        className="text-white p-4"
        style={{ backgroundColor: "#1C59A1" }}
      >
        {/* THÔNG TIN CƠ BẢN */}
        <Row className="align-items-center text-sm-start text-center">
          <Col sm={6}>
            <img
              className="img-fluid rounded bg-light p-1"
              src="https://i.pravatar.cc/200?img=12"
              alt={data.fullName || data.name}
              style={{ maxWidth: "200px" }}
            />
          </Col>

          <Col sm={6}>
            <p className="mb-1 fw-bold">Họ và tên: {studentDetail?.name || data.fullName || data.name}</p>
            <p className="mb-1 fw-bold">
              MSSV: {studentDetail?.mssv || data.studentCode || data.student_ID || data.mssv}
            </p>
            <p className="mb-0 fw-bold">
              Ngày sinh: {formatDate(studentDetail?.date_of_birth || data.dateOfBirth || data.date_of_birth)}
            </p>
          </Col>
        </Row>

        <hr />

        <Row>
          <Col>
            <h3 className="fw-bold text-center">Thông tin bài thi</h3>
          </Col>
        </Row>

        <Row>
          {isLoading ? (
            <Col className="text-center py-4">
              <Spinner animation="border" variant="light" />
            </Col>
          ) : errorMessage ? (
            <Col>
              <div className="bg-white text-center text-danger py-4 px-3 rounded mt-4">
                {errorMessage}
              </div>
            </Col>
          ) : !studentDetail?.exams?.length ? (
            <Col>
              <div className="bg-white text-center text-secondary py-4 px-3 rounded mt-4">
                Chưa có bài thi nào được ghi nhận.
              </div>
            </Col>
          ) : (
            studentDetail.exams.map((exam) => (
              <Col className="col-md-6 mb-3" key={exam.examId || exam.examCode}>
                <Card className="mt-4 border-0 shadow-sm h-100">
                  <Card.Body>
                    <h5 className="fw-bold text-primary text-center">{exam.examName}</h5>
                    {/* <p className="text-secondary mb-2">Mã đề: {exam.examCode}</p> */}
                    <p className="mb-2 text-dark text-center">
                      Ngày thi: {formatDate(exam.takenAt)}
                    </p>
                    <div className="d-flex justify-content-between">
                      {/* <div className="text-center flex-fill">
                        <p className="fw-bold text-black mb-1">Số câu đúng</p>
                        <h4 className="text-success fs-5 mb-0">
                          {exam.correctCount} / {exam.totalQuestions}
                        </h4>
                      </div> */}
                      <div className="text-center flex-fill">
                        <p className="fw-bold text-black mb-1">Điểm</p>
                        <h4 className="text-primary fw-bold mb-0">
                          {exam.score}
                        </h4>
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
            <Button
              variant="outline-light"
              onClick={() => studentDetail && data?.id && onClose && onClose()}
              disabled={isLoading}
            >
              Đóng
            </Button>
          </Col>
        </Row>
      </Container>
    </Modal>
  );
}

export default StudentDetail;
