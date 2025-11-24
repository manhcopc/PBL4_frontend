import { Row, Col, Button, Form, Spinner } from "react-bootstrap";
import Detail from "./Detail";
import { useEffect, useState } from "react";
import "../../assets/Share.css";
import scoreManagementService from "../../application/scoreManagement";

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("vi-VN");
};

export default function ScoreModule() {
  const [showModal, setShowModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [exams, setExams] = useState([]);
  const [isLoadingExams, setIsLoadingExams] = useState(false);
  const [examError, setExamError] = useState("");

  const fetchExams = async () => {
    setIsLoadingExams(true);
    setExamError("");
    try {
      const list = await scoreManagementService.listExams();
      setExams(list);
    } catch (error) {
      console.error("Không thể tải danh sách đề thi", error);
      setExamError("Không thể tải danh sách đề thi.");
      setExams([]);
    } finally {
      setIsLoadingExams(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleOpenDetail = (exam) => {
    setSelectedExam(exam);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedExam(null);
  };

  return (
    <>
      <h1 style={{ color: "#1C59A1" }}>Quản Lý Điểm Thi</h1>
      <Form className="mb-4">
        <Row>
          <Col>
            <Form.Control
              type="text"
              placeholder="Tìm kiếm đề thi..."
              className="mr-sm-2"
              disabled
            />
          </Col>
          <Col>
            <Button variant="primary" type="button" disabled>
              Tìm Kiếm
            </Button>
          </Col>
        </Row>
      </Form>

      {isLoadingExams ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : examError ? (
        <div className="text-danger text-center py-5">{examError}</div>
      ) : exams.length === 0 ? (
        <div className="text-center text-muted py-5">Chưa có kỳ thi nào.</div>
      ) : (
        <div className="album py-5 bg-body-tertiary">
          <div className="container">
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
              {exams.map((exam) => (
                  <div className="col" key={exam.id}>
                    <div
                      style={{
                        borderRadius: "1rem",
                      }}
                      className="card"
                    >
                      <div
                        className="text-white card-header"
                        style={{
                          borderRadius: "1rem 1rem 0 0",
                          backgroundColor: "#1C59A1",
                        }}
                      >
                        <h3 className="mx-auto my-auto mt-2 text-white text-center mb-2">
                          {exam.name}
                        </h3>
                      </div>

                      <div
                        style={{
                          boxShadow:
                            " -2px 1px 15px 0px rgba(152, 182, 246, 0.97), inset 2px -1px 15px 0px rgba(158, 142, 142, 0.33)",
                          borderRadius: "0 0 1rem 1rem",
                        }}
                        className="card-body "
                      >
                        <p className="d-block card-subtitle mb-2 text-body-secondary ">
                          {exam.description || "Không có mô tả"}
                        </p>
                        <div className="d-flex align-item-center justify-content-between mx-3">
                          <p className="card-text fw-bold">Môn học:</p>
                          <p className="card-text fw-bold">{exam.subject}</p>
                        </div>
                        <div className="d-flex align-item-center justify-content-between mx-3">
                          <p className="card-text fw-bold">Ngày thi:</p>
                          <p className="card-text fw-bold">{formatDate(exam.examDate)}</p>
                        </div>
                        <div className="d-flex align-item-center justify-content-between mx-3">
                          <p className="card-text fw-bold">Số câu hỏi:</p>
                          <p className="card-text fw-bold">{exam.questionCount || "—"}</p>
                        </div>
                        <div className="d-flex align-item-center justify-content-between mx-3">
                          <p className="card-text fw-bold">Số mã đề:</p>
                          <p className="card-text fw-bold">{exam.paperCount || "—"}</p>
                        </div>
                        <div className="d-flex align-item-center justify-content-between mx-3">
                          <p className="card-text fw-bold">Số thí sinh:</p>
                          <p className="card-text fw-bold">{exam.studentCount || "—"}</p>
                        </div>

                        <div className="mt-4 text-center">
                          <Button
                            variant="outline-primary"
                            onClick={() => handleOpenDetail(exam)}
                          >
                            Xem chi tiết
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Detail
        show={showModal}
        onClose={handleCloseModal}
        exam={selectedExam}
      />
    </>
  );
}
