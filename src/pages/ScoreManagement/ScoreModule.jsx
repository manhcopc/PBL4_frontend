import { Row, Col, Button, Form } from "react-bootstrap";
import Detail from "./Detail";
import { useState } from "react";
import "../../assets/Share.css";
export default function ScoreModule() {
  // const [showDetail, setShowDetail] = useState(false);
  const examCodes = ["MD001", "MD002", "MD003"];
  const [showModal, setShowModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const sampleExams = [
    {
      id: 1,
      title: "Kiem tra giua ki",
      subject: "Toán",
      numberOfAnswers: 40,
      numberOfStudents: 40,
      examCodes: ["MD001", "MD002", "MD003"],
      description: "Mô tả",
    },
    {
      id: 2,
      title: "Kiem tra cuoi ki",
      subject: "Lý",
      numberOfAnswers: 50,
      numberOfStudents: 35,
      examCodes: ["MD004", "MD005"],
      description: "Mô tả",
    },
  ];

  const examDetails = {
    MD001: { totalQuestions: 40, totalStudents: 20, averageScore: 8.2 },
    MD002: { totalQuestions: 40, totalStudents: 18, averageScore: 7.9 },
    MD003: { totalQuestions: 40, totalStudents: 22, averageScore: 8.5 },
  };

  const handleSelectExam = (code) => {
    setSelectedExam(code);
    setShowModal(true);
  };

  return (
    <>
      <h1 style={{ color: "#1C59A1" }}>Quản Lý Điểm Thi</h1>
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
      <Detail />
      <div className="album py-5 bg-body-tertiary">
        <div className="container">
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {sampleExams.map((exam) => (
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
                      {exam.title}
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
                      {exam.description}
                    </p>
                    <div className="d-flex align-item-center justify-content-between mx-3">
                      <p className="card-text fw-bold">Môn học:</p>
                      <p className="card-text fw-bold">{exam.subject}</p>
                    </div>
                    <div className="d-flex align-item-center justify-content-between mx-3">
                      <p className="card-text fw-bold">Số lượng đáp án:</p>
                      <p className="card-text fw-bold">
                        {exam.numberOfAnswers}
                      </p>
                    </div>
                    <div className="d-flex align-item-center justify-content-between mx-3">
                      <p className="card-text fw-bold">Số lượng thí sinh:</p>
                      <p className="card-text fw-bold">
                        {exam.numberOfStudents}
                      </p>
                    </div>

                    <div className="d-flex btn-group justify-content-center align-items-center">
                      <Row className="justify-content-center">
                        {exam.examCodes.map((code, index) => (
                          <Col
                            key={index}
                            xs={6}
                            sm={4}
                            md={3}
                            lg={2}
                            className="mb-3 d-flex justify-content-center mx-3"
                          >
                            <Button
                              variant="outline-primary"
                              className="confirm-button"
                              onClick={() => handleSelectExam(code)}
                            >
                              {code}
                            </Button>
                          </Col>
                        ))}
                      </Row>

                      <Detail
                        show={showModal}
                        onClose={() => setShowModal(false)}
                        exam={selectedExam}
                        examDetails={examDetails}
                      />
                      {/* <EditExam show={showEditExam} onClose={handleCloseEdit} /> */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {/* </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
