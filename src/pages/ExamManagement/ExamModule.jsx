// pages/ExamManagementPage.js
import React, { useState } from "react";
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

const ExamModule = () => {
    const sampleExams = [
      {
        id: 1,
        title: "Kiem tra giua ki",
        date: "2023-10-15",
        description: "Mô tả",
        subject: "Toán",
        examCount: 3,
        answerCount: 40,
        studentCount: 40,
      },
      {
        id: 2,
        title: "Kiem tra cuoi ki",
        date: "2023-12-20",
        description: "Mô tả",
        subject: "Lý",
        examCount: 2,
        answerCount: 50,
        studentCount: 35,
      },
    ];
  const [showCreateExam, setShowCreateClass] = useState(false);
  const [showEditExam, setShowEditExam] = useState(false);
  const handleShowCreate = () => setShowCreateClass(true);
    const handleCloseCreate = () => setShowCreateClass(false);
    const handleShowEdit = () => setShowEditExam(true)
  const handleCloseEdit = () => setShowEditExam(false)
  

  return (
    <>
      <h1 className="mx-auto" style={{ color: "#1C59A1" }}>
        Quản Lý Đề Thi và Đáp Án
      </h1>
      <Form>
        <Row>
          <Col>
            <Form.Control
              type="text"
              placeholder="Tìm kiếm đề thi..."
              className="mr-sm-2"
            />
          </Col>
          <Col>
            <Button variant="primary" type="submit">
              Tìm Kiếm
            </Button>
          </Col>
        </Row>
      </Form>
      <Button variant="primary mt-3" onClick={handleShowCreate}>
        Tạo Đề Thi Mới
      </Button>
      <CreateExam show={showCreateExam} onClose={handleCloseCreate} />

      <div className="album py-5 bg-body-tertiary">
        <div className="container">
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {sampleExams.map((exam) => (
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
                    style={{ backgroundColor: "#1C59A1", borderRadius: "1rem 1rem 0 0" }}
                  >
                    <h3 className="text-center">{exam.title}</h3>
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
                      {exam.description}
                    </p>

                    <div className="d-flex align-item-center justify-content-between mx-3">
                      <p className="card-text fw-bold">Ngày kiểm tra</p>
                      <p className="card-text fw-bold">{exam.date}</p>
                    </div>
                    <div className="d-flex align-item-center justify-content-between mx-3">
                      <p className="card-text fw-bold">Môn học:</p>
                      <p className="card-text fw-bold">{exam.subject}</p>
                    </div>
                    <div className="d-flex align-item-center justify-content-between mx-3">
                      <p className="card-text fw-bold">Số lượng mã đề:</p>
                      <p className="card-text fw-bold">{exam.examCount}</p>
                    </div>
                    <div className="d-flex align-item-center justify-content-between mx-3">
                      <p className="card-text fw-bold">Số lượng đáp án:</p>
                      <p className="card-text fw-bold">{exam.answerCount}</p>
                    </div>
                    <div className="d-flex align-item-center justify-content-between mx-3">
                      <p className="card-text fw-bold">Số lượng thí sinh:</p>
                      <p className="card-text fw-bold">{exam.studentCount}</p>
                    </div>

                    <div className="d-flex btn-group justify-content-center align-items-center">
                      <Button
                        type="button"
                        variant="btn btn-sm btn-outline-primary"
                        className="confirm-button"
                        onClick={handleShowEdit}
                      >
                        Chỉnh sửa
                      </Button>
                      <EditExam show={showEditExam} onClose={handleCloseEdit} />
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
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ExamModule;
