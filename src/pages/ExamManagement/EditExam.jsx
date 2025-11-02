import { useEffect, useMemo, useState } from "react";
import { BiSolidDetail } from "react-icons/bi";
import { FaList } from "react-icons/fa";
import { Tab, Nav, Form, Table, Button, Modal, Row, Col, Card } from "react-bootstrap";
import "../../assets/NavbarHover.css";
import AddStudentToExam from "./AddStudentToExam";

const SUBJECT_OPTIONS = ["Toán", "Ngữ Văn", "Tiếng Anh", "Vật Lý", "Hóa Học"];



const SAMPLE_EXAM_DATA = {
  name: "Thi giữa kỳ Toán 12",
  description: "Đề thi trắc nghiệm giữa kỳ môn Toán khối 12.",
  examDate: "2024-11-20",
  subject: "Toán",
  questionCount: 4,
  examCodes: [
    { code: "TOAN-A", answers: ["A", "B", "C", "D"] },
    { code: "TOAN-B", answers: ["B", "C", "D", "A"] },
  ],
  students: [
    { id: "SV001", fullName: "Nguyễn Văn A" },
    { id: "SV003", fullName: "Lê Thị C" },
  ],
};

const createEmptyAnswers = (length) => Array.from({ length }, () => "A");

const createInitialExamData = () => ({
  ...SAMPLE_EXAM_DATA,
  examCodes: SAMPLE_EXAM_DATA.examCodes.map((exam) => ({
    ...exam,
    answers: [...exam.answers],
  })),
  students: SAMPLE_EXAM_DATA.students.map((student) => ({ ...student })),
});



export default function EditExam({ show, onClose }) {
  const [examForm, setExamForm] = useState(() => createInitialExamData());
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [showStudentModal, setShowStudentModal] = useState(false);

  const numberOfExamCodes = examForm.examCodes.length;
  const questionCount = examForm.questionCount;

  const existingStudentIds = useMemo(
    () => new Set(examForm.students.map((student) => student.id)),
    [examForm.students]
  );

  const displayedStudents = useMemo(() => {
    const normalizedTerm = studentSearchTerm.trim().toLowerCase();
    if (!normalizedTerm) {
      return examForm.students;
    }
    return examForm.students.filter(
      (student) =>
        student.id.toLowerCase().includes(normalizedTerm) ||
        student.fullName.toLowerCase().includes(normalizedTerm) ||
        student.className.toLowerCase().includes(normalizedTerm)
    );
  }, [examForm.students, studentSearchTerm]);

  const handleDetailChange = (field, value) => {
    setExamForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNumberOfExamCodesChange = (rawValue) => {
    const value = Math.max(1, rawValue);
    setExamForm((prev) => {
      const nextExamCodes = prev.examCodes.slice(0, value).map((exam) => {
        const answers = exam.answers.slice(0, prev.questionCount);
        if (answers.length < prev.questionCount) {
          answers.push(...createEmptyAnswers(prev.questionCount - answers.length));
        }
        return { ...exam, answers };
      });

      while (nextExamCodes.length < value) {
        nextExamCodes.push({
          code: "",
          answers: createEmptyAnswers(prev.questionCount),
        });
      }

      return {
        ...prev,
        examCodes: nextExamCodes,
      };
    });
  };

  const handleNumberOfAnswersChange = (rawValue) => {
    const value = Math.max(1, rawValue);
    setExamForm((prev) => ({
      ...prev,
      questionCount: value,
      examCodes: prev.examCodes.map((exam) => {
        const answers = exam.answers.slice(0, value);
        if (answers.length < value) {
          answers.push(...createEmptyAnswers(value - answers.length));
        }
        return { ...exam, answers };
      }),
    }));
  };

  const handleChangeExamCode = (index, value) => {
    setExamForm((prev) => {
      const updated = prev.examCodes.map((exam, idx) =>
        idx === index
          ? {
              ...exam,
              code: value,
            }
          : exam
      );
      return { ...prev, examCodes: updated };
    });
  };

  const handleChangeAnswer = (examIndex, questionIndex, value) => {
    setExamForm((prev) => {
      const updated = prev.examCodes.map((exam, idx) => {
        if (idx !== examIndex) {
          return exam;
        }
        const answers = [...exam.answers];
        answers[questionIndex] = value;
        return { ...exam, answers };
      });
      return { ...prev, examCodes: updated };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Exam payload gửi API:", examForm);
    onClose?.();
  };

  const handleAddStudentsToExam = (students) => {
    setExamForm((prev) => {
      const unique = new Map(prev.students.map((student) => [student.id, student]));
      students.forEach((student) => {
        unique.set(student.id, { ...student });
      });
      return {
        ...prev,
        students: Array.from(unique.values()),
      };
    });
  };

  const handleRemoveStudent = (studentId) => {
    setExamForm((prev) => ({
      ...prev,
      students: prev.students.filter((student) => student.id !== studentId),
    }));
  };

  const handleResetToSample = () => {
    setExamForm(createInitialExamData());
    setStudentSearchTerm("");
  };

  return (
    <>
      <Modal show={show} onHide={onClose} size="lg">
        <Tab.Container defaultActiveKey="students" mountOnEnter unmountOnExit>
          <Modal.Header style={{ border: "none", backgroundColor: "#1C59A1" }} closeButton>
            <div className="w-100">
              <h2 className="text-white text-center">Chỉnh sửa đề thi</h2>
            </div>
          </Modal.Header>
          <Nav
            variant="tabs"
            className="custom-nav justify-content-around"
            style={{ backgroundColor: "#1C59A1" }}
          >
            <Nav.Item>
              <Nav.Link eventKey="details" className="nav-link text-white fw-semibold">
                <BiSolidDetail className="me-2" />
                Chi tiết đề thi
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="students" className="nav-link text-white fw-semibold">
                <FaList className="me-2" />
                Danh sách thí sinh
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Modal.Body className="mt-0">
            <Tab.Content>
              <Tab.Pane eventKey="details" className="p-4">
                <Form id="edit-exam-form" onSubmit={handleSubmit}>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Tên Đề Thi</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Nhập tên đề thi"
                          value={examForm.name}
                          onChange={(e) => handleDetailChange("name", e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Ngày thi</Form.Label>
                        <Form.Control
                          type="date"
                          value={examForm.examDate}
                          onChange={(e) => handleDetailChange("examDate", e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label>Mô tả</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          placeholder="Nhập mô tả"
                          value={examForm.description}
                          onChange={(e) => handleDetailChange("description", e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Môn Học</Form.Label>
                        <Form.Select
                          value={examForm.subject}
                          onChange={(e) => handleDetailChange("subject", e.target.value)}
                        >
                          {SUBJECT_OPTIONS.map((subject) => (
                            <option key={subject} value={subject}>
                              {subject}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Tổng số mã đề</Form.Label>
                        <Form.Control
                          type="number"
                          min="1"
                          value={numberOfExamCodes}
                          onChange={(e) =>
                            handleNumberOfExamCodesChange(parseInt(e.target.value, 10) || 0)
                          }
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Số câu hỏi mỗi mã đề</Form.Label>
                        <Form.Control
                          type="number"
                          min="1"
                          value={questionCount}
                          onChange={(e) =>
                            handleNumberOfAnswersChange(parseInt(e.target.value, 10) || 0)
                          }
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="g-3 mt-2">
                    {examForm.examCodes.map((exam, examIndex) => (
                      <Col className="col-lg-4 col-md-6" key={examIndex}>
                        <Card className="mb-3">
                          <Card.Header className="d-flex align-items-center">
                            <Form.Group className="w-100 mb-0">
                              <Form.Label className="mb-1">Mã đề {examIndex + 1}</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Nhập mã đề"
                                value={exam.code}
                                onChange={(e) => handleChangeExamCode(examIndex, e.target.value)}
                              />
                            </Form.Group>
                          </Card.Header>
                          <Card.Body>
                            {Array.from({ length: questionCount }).map((_, questionIndex) => (
                              <Form.Group
                                key={questionIndex}
                                className="d-flex align-items-center mb-2"
                              >
                                <Form.Label className="me-3 mb-0" style={{ width: "80px" }}>
                                  Câu {questionIndex + 1}
                                </Form.Label>
                                <Form.Select
                                  value={exam.answers[questionIndex] || "A"}
                                  onChange={(e) =>
                                    handleChangeAnswer(examIndex, questionIndex, e.target.value)
                                  }
                                  style={{ width: "100px" }}
                                >
                                  <option value="A">A</option>
                                  <option value="B">B</option>
                                  <option value="C">C</option>
                                  <option value="D">D</option>
                                </Form.Select>
                              </Form.Group>
                            ))}
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Form>
              </Tab.Pane>
              <Tab.Pane eventKey="students" className="p-4">
                <Form className="mb-3" onSubmit={(e) => e.preventDefault()}>
                  <Row className="g-2 align-items-center">
                    <Col md={6}>
                      <Form.Control
                        type="text"
                        placeholder="Tìm kiếm theo mã, họ tên hoặc lớp..."
                        value={studentSearchTerm}
                        onChange={(e) => setStudentSearchTerm(e.target.value)}
                      />
                    </Col>
                    <Col md="auto">
                      <Button variant="primary" type="button" onClick={() => setShowStudentModal(true)}>
                        Thêm thí sinh
                      </Button>
                    </Col>
                    <Col md="auto">
                      <Button
                        variant="outline-secondary"
                        type="button"
                        onClick={() => setStudentSearchTerm("")}
                      >
                        Xóa tìm kiếm
                      </Button>
                    </Col>
                  </Row>
                </Form>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Mã Sinh Viên</th>
                      <th>Họ Tên</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedStudents.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center text-muted py-3">
                          Không có thí sinh nào phù hợp.
                        </td>
                      </tr>
                    ) : (
                      displayedStudents.map((student, index) => (
                        <tr key={student.id}>
                          <td>{index + 1}</td>
                          <td>{student.id}</td>
                          <td>{student.fullName}</td>
                          <td>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleRemoveStudent(student.id)}
                            >
                              Xóa
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </Tab.Pane>
            </Tab.Content>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={handleResetToSample}>
              Tải lại dữ liệu mẫu
            </Button>
            <div className="ms-auto d-flex gap-2">
              <Button variant="secondary" onClick={onClose}>
                Hủy
              </Button>
              <Button variant="primary" type="submit" form="edit-exam-form">
                Lưu
              </Button>
            </div>
          </Modal.Footer>
        </Tab.Container>
      </Modal>
      <AddStudentToExam
        show={showStudentModal}
        onClose={() => setShowStudentModal(false)}
        onConfirm={handleAddStudentsToExam}
        existingStudentIds={existingStudentIds}
      />
    </>
  );
}
