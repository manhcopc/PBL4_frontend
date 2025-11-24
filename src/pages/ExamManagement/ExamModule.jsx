// pages/ExamManagementPage.js
import React, { useEffect, useState } from "react";
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
import "bootstrap/dist/css/bootstrap.min.css";
import CreateExam from "./CreateExam";
import EditExam from "./EditExam";
import "../../assets/Share.css"
import examApi from "../../services/api/examApi";
import examManagementService from "../../application/examManagement";
const ExamModule = () => {
  const [showCreateExam, setShowCreateExam] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [showEditExam, setShowEditExam] = useState(false);
  const [exams, setExams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [examError, setExamError] = useState("");
  
  const handleShowCreate = () => setShowCreateExam(true);
  const handleCloseCreate = () => setShowCreateExam(false);
  const handleShowEdit = (exam) => {
    setSelectedExam(exam);
    setShowEditExam(true);
  };
  const handleCloseEdit = () => {
    setShowEditExam(false);
    setSelectedExam(null);
  };
  
  const fetchExams = async () => {
    setIsLoading(true);
    setExamError("");
    try {
      const res = await examApi.getAllExams();
      const raw = Array.isArray(res.data) ? res.data : [];
      const enriched = await Promise.all(
        raw.map(async (exam) => {
          try {
            const { examForm } = await examManagementService.loadExamDetail(
              exam.id
            );
            return {
              ...exam,
              exam_date: exam.exam_date || examForm.examDate,
              questionCount: examForm.questionCount,
              paperCount: examForm.examCodes.length,
              studentCount: examForm.students.length,
            };
          } catch (detailError) {
            return {
              ...exam,
              questionCount:
                exam.question_count ||
                exam.questionCount ||
                exam.total_questions ||
                0,
              paperCount: exam.paper_count || exam.examCount || 0,
              studentCount:
                exam.user || exam.examinee_count || exam.student_count || 0,
            };
          }
        })
      );
      setExams(enriched);
    } catch (error) {
      console.error("Không thể tải danh sách đề thi", error);
      setExamError("Không thể tải danh sách đề thi");
      setExams([]);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchExams()
  },[])

  return (
    <>
      <h1 className="mx-auto" style={{ color: "#1C59A1" }}>
        Quản Lý Đề Thi và Đáp Án
      </h1>
      <Form>
        <Row>
          <Col>
            <Form.Control
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              placeholder="Tìm kiếm đề thi..."
              className="mr-sm-2"
            />
          </Col>
          <Col>
            <Button
              variant="outline-secondary"
              type="button"
              onClick={() => setSearchTerm("")}
            >
              Xóa tìm kiếm
            </Button>
          </Col>
        </Row>
      </Form>
      <Button
        variant="mt-3"
        className="mb-4 mt-3"
        style={{ backgroundColor: "#1C59A1", color: "white" }}
        onClick={handleShowCreate}
      >
        Tạo Đề Thi Mới
      </Button>
      <CreateExam
        show={showCreateExam}
        onClose={handleCloseCreate}
        onSuccess={fetchExams}
      />

      <div className="album py-5 bg-body-tertiary">
        <div className="container">
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {isLoading ? (
              <div className="text-center py-5">Đang tải danh sách đề thi...</div>
            ) : examError ? (
              <div className="text-center text-danger py-5 col-12">{examError}</div>
            ) : exams.length === 0 ? (
              <div className="text-center text-muted py-5 col-12">
                Chưa có kỳ thi nào.
              </div>
            ) : (
              exams
                .filter((exam) => {
                  const term = searchTerm.trim().toLowerCase();
                  if (!term) return true;
                const name = (exam.name || "").toLowerCase();
                const description = (exam.description || "").toLowerCase();
                const subject = (exam.subject || "").toLowerCase();
                const date = (exam.exam_date || "").toLowerCase();
                return (
                  name.includes(term) ||
                  description.includes(term) ||
                  subject.includes(term) ||
                  date.includes(term)
                );
              })
              .map((exam) => (
                <div
                  key={exam.id}
                  className="col border-0"
                  style={{ borderRadius: "1rem" }}
                >
                  <div
                    className="border-0 card shadow-sm"
                    style={{ borderRadius: "1rem" }}
                  >
                    <div
                      className="text-white card-header"
                      style={{
                        backgroundColor: "#1C59A1",
                        borderRadius: "1rem 1rem 0 0",
                      }}
                    >
                      <h3 className="text-center">{exam.name}</h3>
                    </div>

                    <div
                      className="card-body"
                      style={{
                        boxShadow:
                          " -2px 1px 15px 0px rgba(152, 182, 246, 0.97), inset 2px -1px 15px 0px rgba(158, 142, 142, 0.33)",
                        borderRadius: "0 0 1rem 1rem",
                      }}
                    >
                      <p className="d-block card-subtitle mb-2 text-body-secondary text-center">
                        {exam.description || "Không có mô tả"}
                      </p>

                      <div className="d-flex align-item-center justify-content-between mx-3">
                        <p className="card-text fw-bold">Ngày kiểm tra</p>
                        <p className="card-text fw-bold">{exam.exam_date}</p>
                      </div>
                      <div className="d-flex align-item-center justify-content-between mx-3">
                        <p className="card-text fw-bold">Môn học:</p>
                        <p className="card-text fw-bold">{exam.subject}</p>
                      </div>
                      <div className="d-flex align-item-center justify-content-between mx-3">
                        <p className="card-text fw-bold">Số câu hỏi:</p>
                        <p className="card-text fw-bold">
                          {exam.questionCount ?? "—"}
                        </p>
                      </div>
                      <div className="d-flex align-item-center justify-content-between mx-3">
                        <p className="card-text fw-bold">Số lượng mã đề:</p>
                        <p className="card-text fw-bold">
                          {exam.paperCount ?? "—"}
                        </p>
                      </div>
                      <div className="d-flex align-item-center justify-content-between mx-3">
                        <p className="card-text fw-bold">Số lượng thí sinh:</p>
                        <p className="card-text fw-bold">
                          {exam.studentCount ?? "—"}
                        </p>
                      </div>

                      <div className="d-flex btn-group justify-content-center align-items-center">
                        <Button
                          type="button"
                          variant="btn btn-sm btn-outline-primary"
                          className="confirm-button"
                          onClick={() => handleShowEdit(exam)}
                        >
                          Chỉnh sửa
                        </Button>
                        <button
                          type="button"
                          className="cancel-button btn btn-sm btn-outline-danger"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <EditExam
        show={showEditExam && !!selectedExam}
        onClose={handleCloseEdit}
        examId={selectedExam?.id}
        examSummary={selectedExam}
        onUpdated={fetchExams}
      />
    </>
  );
};

export default ExamModule;
