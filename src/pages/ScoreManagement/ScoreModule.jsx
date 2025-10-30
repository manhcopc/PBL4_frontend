import { Row, Col, Button, Form } from "react-bootstrap";
import Detail from "./Detail";
import { useState } from "react";
export default function ScoreModule() {
  // const [showDetail, setShowDetail] = useState(false);
  const examCodes = ["MD001", "MD002", "MD003"];
  const [showModal, setShowModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);


  const examDetails = {
    MD001: {
      totalQuestions: 20,
      totalStudents: 35,
      averageScore: 7.8,
      results: [
        { id: 1, name: "Nguyễn Văn A", correct: 18, score: 9.0 },
        { id: 2, name: "Trần Thị B", correct: 15, score: 7.5 },
      ],
    },
    MD002: {
      totalQuestions: 25,
      totalStudents: 40,
      averageScore: 8.1,
      results: [
        { id: 1, name: "Phạm Minh C", correct: 20, score: 8.0 },
        { id: 2, name: "Đặng Lan D", correct: 23, score: 9.2 },
      ],
    },
    MD003: {
      totalQuestions: 30,
      totalStudents: 28,
      averageScore: 6.9,
      results: [
        { id: 1, name: "Hoàng Đức E", correct: 19, score: 6.5 },
        { id: 2, name: "Lê Hải F", correct: 22, score: 7.8 },
      ],
    },
  };
    const handleSelectExam = (code) => {
      setSelectedExam(code);
      setShowModal(true);
    };

  return (
    <>
      <h2 className="mx-auto" style={{ color: "#007BFF" }}>
        Quản Lý Điểm Thi
      </h2>
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
      <Button variant="primary mt-3">Tạo Đề Thi Mới</Button>
      {/* <CreateExam show={showCreateExam} onClose={handleCloseCreate} /> */}
      <Detail />
      <div className="album py-5 bg-body-tertiary">
        <div className="container">
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            <div className="col">
              <div className="card shadow-sm">
                <h1 className="mx-auto my-auto">Kiem tra giua ki</h1>
                <hr />
                <div className="card-body">
                  <p className="d-block card-subtitle mb-2 text-body-secondary ">
                    Mô tả
                  </p>
                  <div className="d-flex align-item-center justify-content-between mx-3">
                    <p className="card-text">Môn học:</p>
                    <p className="card-text">Toán</p>
                  </div>
                  <div className="d-flex align-item-center justify-content-between mx-3">
                    <p className="card-text">Số lượng đáp án:</p>
                    <p className="card-text">40</p>
                  </div>
                  <div className="d-flex align-item-center justify-content-between mx-3">
                    <p className="card-text">Số lượng thí sinh:</p>
                    <p className="card-text">40</p>
                  </div>

                  <div className="d-flex btn-group justify-content-center align-items-center">
                    <Row className="justify-content-center">
                      {examCodes.map((code, index) => (
                        <Col
                          key={index}
                          xs={6}
                          sm={4}
                          md={3}
                          lg={2}
                          className="mb-3 d-flex justify-content-center"
                        >
                          <Button
                            variant="outline-primary"
                            className="w-100"
                            onClick={() => handleSelectExam(code)}
                          >
                            {code}
                          </Button>
                        </Col>
                      ))}
                    </Row>
                    <Detail show={showModal} onClose={() => setShowModal(false)} exam={selectedExam} examDetails={examDetails} />
                    {/* <EditExam show={showEditExam} onClose={handleCloseEdit} /> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card shadow-sm">
                <h1 className="mx-auto my-auto">Kiem tra cuoi ki</h1>
                <hr />
                <div className="card-body">
                  <p className="d-block card-subtitle mb-2 text-body-secondary mx-auto">
                    Mô tả
                  </p>
                  <div className="d-flex align-item-center justify-content-between mx-3">
                    <p className="card-text">Môn học:</p>
                    <p className="card-text">Toán</p>
                  </div>
                  <div className="d-flex align-item-center justify-content-between mx-3">
                    <p className="card-text">Số lượng mã đề:</p>
                    <p className="card-text">3</p>
                  </div>
                  <div className="d-flex align-item-center justify-content-between mx-3">
                    <p className="card-text">Số lượng đáp án:</p>
                    <p className="card-text">40</p>
                  </div>
                  <div className="d-flex align-item-center justify-content-between mx-3">
                    <p className="card-text">Số lượng thí sinh:</p>
                    <p className="card-text">40</p>
                  </div>

                  <div className="d-flex btn-group justify-content-center align-items-center">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
