import { useCallback, useEffect, useMemo, useState } from "react";
import { BiSolidDetail } from "react-icons/bi";
import { FaList } from "react-icons/fa";
import { Tab, Nav, Form, Table, Button, Modal, Row, Col, Card, Spinner } from "react-bootstrap";
import "../../assets/NavbarHover.css";
import examManagementService from "../../service/examManagement/";
import AddStudentToExam from "./AddStudentToExam";

const SUBJECT_OPTIONS = ["Toán", "Ngữ Văn", "Tiếng Anh", "Vật Lý", "Hóa Học"];
const ANSWER_OPTIONS = ["A", "B", "C", "D"];

const normalizeAnswerInput = (value) => {
  if (value === null || value === undefined) return "A";
  const raw = value.toString().trim().toUpperCase();
  if (!raw) return "A";
  if (ANSWER_OPTIONS.includes(raw)) return raw;
  const numeric = Number(raw);
  if (!Number.isNaN(numeric)) {
    if (numeric >= 1 && numeric <= ANSWER_OPTIONS.length) {
      return ANSWER_OPTIONS[Math.floor(numeric) - 1];
    }
    if (numeric >= 0 && numeric < ANSWER_OPTIONS.length) {
      return ANSWER_OPTIONS[Math.floor(numeric)];
    }
  }
  const firstChar = raw.charAt(0);
  if (ANSWER_OPTIONS.includes(firstChar)) {
    return firstChar;
  }
  return "A";
};

const createEmptyAnswers = (length) =>
  Array.from({ length }, () => ANSWER_OPTIONS[0]);

const createEmptyExamForm = () => ({
  id: null,
  name: "",
  description: "",
  examDate: "",
  subject: SUBJECT_OPTIONS[0] || "",
  questionCount: 1,
  examCodes: [
    {
      id: null,
      code: "",
      questionCount: 1,
      answers: createEmptyAnswers(1),
      answerEntries: [],
    },
  ],
  students: [],
});

export default function EditExam({ show, onClose, examId, examSummary, onUpdated }) {
  const [examForm, setExamForm] = useState(createEmptyExamForm());
  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [isUpdatingStudents, setIsUpdatingStudents] = useState(false);
  const [metadata, setMetadata] = useState({ originalExamCodes: [] });
  const [removedPaperIds, setRemovedPaperIds] = useState([]);

  const numberOfExamCodes = examForm.examCodes.length;
  const questionCount = examForm.questionCount;

  const existingStudentIds = useMemo(() => {
    const ids = examForm.students
      .map(
        (student) =>
          student.examineeId ||
          student.id ||
          student.recordId ||
          student.studentCode
      )
      .filter(Boolean);
    return new Set(ids);
  }, [examForm.students]);

  useEffect(() => {
    if (examSummary) {
      setExamForm((prev) => ({
        ...prev,
        id: examSummary.id ?? prev.id,
        name: examSummary.name ?? prev.name,
        description: examSummary.description ?? prev.description,
        examDate: (examSummary.exam_date || examSummary.examDate || prev.examDate || "").slice(0, 10),
        subject: examSummary.subject ?? prev.subject,
        questionCount: examSummary.questionCount ?? prev.questionCount,
      }));
    }
  }, [examSummary]);

  const displayedStudents = useMemo(() => {
    const normalizedTerm = studentSearchTerm.trim().toLowerCase();
    if (!normalizedTerm) {
      return examForm.students;
    }
    return examForm.students.filter(
      (student) =>
        student.studentCode?.toLowerCase().includes(normalizedTerm) ||
        student.fullName?.toLowerCase().includes(normalizedTerm) ||
        student.className?.toLowerCase().includes(normalizedTerm)
    );
  }, [examForm.students, studentSearchTerm]);

  const fetchExamDetail = useCallback(async () => {
    if (!examId) return;
    setIsLoading(true);
    setLoadingError("");
    try {
      const { examForm: loadedForm, metadata: loadedMetadata } =
        await examManagementService.loadExamDetail(examId);
      setExamForm(loadedForm);
      setMetadata(loadedMetadata);
      setRemovedPaperIds([]);
    } catch (error) {
      console.error("Không thể tải dữ liệu đề thi", error);
      setLoadingError("Không thể tải dữ liệu đề thi. Vui lòng thử lại.");
      setExamForm((prev) =>
        prev.id ? prev : { ...createEmptyExamForm(), id: examId }
      );
    } finally {
      setIsLoading(false);
    }
  }, [examId]);

  useEffect(() => {
    if (show && examId) {
      fetchExamDetail();
    } else if (show && !examId) {
      setExamForm(createEmptyExamForm());
    }
  }, [show, examId, fetchExamDetail]);

  const handleDetailChange = (field, value) => {
    setExamForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNumberOfExamCodesChange = (rawValue) => {
    const value = Math.max(0, rawValue);
    setExamForm((prev) => {
      if (value < prev.examCodes.length) {
        const removed = prev.examCodes.slice(value).filter((paper) => paper.id);
        if (removed.length) {
          setRemovedPaperIds((prevRemoved) => [
            ...prevRemoved,
            ...removed.map((paper) => paper.id),
          ]);
        }
      }
      const nextExamCodes = prev.examCodes.slice(0, value).map((exam) => {
        const answers = exam.answers.slice(0, prev.questionCount);
        const answerEntries = (exam.answerEntries || []).slice(
          0,
          prev.questionCount
        );
        if (answers.length < prev.questionCount) {
          answers.push(
            ...createEmptyAnswers(prev.questionCount - answers.length)
          );
        }
        return {
          ...exam,
          questionCount: prev.questionCount,
          answers,
          answerEntries,
        };
      });

      while (nextExamCodes.length < value) {
        nextExamCodes.push({
          id: null,
          code: "",
          questionCount: prev.questionCount,
          answers: createEmptyAnswers(prev.questionCount),
          answerEntries: [],
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
        const answerEntries = (exam.answerEntries || []).slice(0, value);
        if (answers.length < value) {
          answers.push(...createEmptyAnswers(value - answers.length));
        }
        return {
          ...exam,
          questionCount: value,
          answers,
          answerEntries,
        };
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
        answers[questionIndex] = normalizeAnswerInput(value);
        return { ...exam, answers };
      });
      return { ...prev, examCodes: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!examForm.id) {
      return;
    }
    setIsSaving(true);
    try {
      const result = await examManagementService.saveExamDetail({
        examForm,
        metadata,
        removedPaperIds,
      });
      if (result) {
        setExamForm(result.examForm);
        setMetadata(result.metadata);
        setRemovedPaperIds([]);
      }
      if (onUpdated) {
        onUpdated();
      }
      onClose?.();
    } catch (error) {
      console.error("Không thể cập nhật đề thi", error);
      alert("Không thể cập nhật đề thi. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddStudentsToExam = async (students) => {
    if (!examForm.id || !students?.length) {
      return;
    }
    setIsUpdatingStudents(true);
    try {
      await examManagementService.addStudents(examForm.id, students);
      await fetchExamDetail();
    } catch (error) {
      console.error("Không thể thêm thí sinh", error);
      alert("Không thể thêm thí sinh vào kỳ thi.");
    } finally {
      setIsUpdatingStudents(false);
    }
  };

  const handleRemoveStudent = async (recordId) => {
    if (!examForm.id || !recordId) {
      return;
    }
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa thí sinh này khỏi kỳ thi?");
    if (!confirmDelete) {
      return;
    }
    try {
      await examManagementService.removeStudent(examForm.id, recordId);
      await fetchExamDetail();
    } catch (error) {
      console.error("Không thể xóa thí sinh", error);
      alert("Không thể xóa thí sinh khỏi kỳ thi.");
    }
  };

  if (!examId) {
    return null;
  }

  return (
    <>
      <Modal show={show} onHide={onClose} size="lg">
        <Tab.Container defaultActiveKey="details" mountOnEnter unmountOnExit>
          <Modal.Header
            style={{ border: "none", backgroundColor: "#1C59A1" }}
            closeButton
          >
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
              <Nav.Link
                eventKey="details"
                className="nav-link text-white fw-semibold"
              >
                <BiSolidDetail className="me-2" />
                Chi tiết đề thi
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="students"
                className="nav-link text-white fw-semibold"
              >
                <FaList className="me-2" />
                Danh sách thí sinh
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Modal.Body className="mt-0">
            <Tab.Content>
              <Tab.Pane eventKey="details" className="p-4">
                {isLoading ? (
                  <div className="py-4 text-center">
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : loadingError ? (
                  <div className="text-danger text-center py-4">
                    {loadingError}
                  </div>
                ) : (
                  <Form id="edit-exam-form" onSubmit={handleSubmit}>
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Tên Đề Thi</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Nhập tên đề thi"
                            value={examForm.name}
                            onChange={(e) =>
                              handleDetailChange("name", e.target.value)
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Ngày thi</Form.Label>
                          <Form.Control
                            type="date"
                            value={examForm.examDate || ""}
                            onChange={(e) =>
                              handleDetailChange("examDate", e.target.value)
                            }
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
                            onChange={(e) =>
                              handleDetailChange("description", e.target.value)
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Môn Học</Form.Label>
                          <Form.Control
                            value={examForm.subject}
                            placeholder="Nhập môn học"
                            onChange={(e) =>
                              handleDetailChange("subject", e.target.value)
                            }
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>Tổng số mã đề</Form.Label>
                          <Form.Control
                            type="number"
                            min="0"
                            value={numberOfExamCodes}
                            onChange={(e) =>
                              handleNumberOfExamCodesChange(
                                parseInt(e.target.value, 10) || 0
                              )
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>Số câu hỏi mỗi mã đề</Form.Label>
                          <Form.Control
                            type="number"
                            min="0"
                            value={questionCount}
                            onChange={(e) =>
                              handleNumberOfAnswersChange(
                                parseInt(e.target.value, 10) || 0
                              )
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
                                <Form.Label className="mb-1">
                                  Mã đề {examIndex + 1}
                                </Form.Label>
                                <Form.Control
                                  required
                                  type="text"
                                  placeholder="Nhập mã đề"
                                  value={exam.code}
                                  onChange={(e) =>
                                    handleChangeExamCode(
                                      examIndex,
                                      e.target.value
                                    )
                                  }
                                />
                              </Form.Group>
                            </Card.Header>
                            <Card.Body>
                              {Array.from({ length: questionCount }).map(
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
                                    <Form.Control
                                      required
                                      type="text"
                                      placeholder="..."
                                      value={exam.answers[questionIndex]}
                                      onChange={(e) =>
                                        handleChangeAnswer(
                                          examIndex,
                                          questionIndex,
                                          e.target.value
                                        )
                                      }
                                    />
                                  </Form.Group>
                                )
                              )}
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </Form>
                )}
              </Tab.Pane>
              <Tab.Pane eventKey="students" className="p-4">
                {isLoading ? (
                  <div className="py-4 text-center">
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : (
                  <>
                    <Form className="mb-3" onSubmit={(e) => e.preventDefault()}>
                      <Row className="g-2 align-items-center">
                        <Col md={6}>
                          <Form.Control
                            type="text"
                            placeholder="Tìm kiếm theo mã hoặc họ tên..."
                            value={studentSearchTerm}
                            onChange={(e) =>
                              setStudentSearchTerm(e.target.value)
                            }
                          />
                        </Col>
                        <Col md="auto">
                          <Button
                            variant="primary"
                            type="button"
                            onClick={() => setShowStudentModal(true)}
                            disabled={isUpdatingStudents}
                          >
                            {isUpdatingStudents
                              ? "Đang cập nhật..."
                              : "Thêm thí sinh"}
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
                            <td
                              colSpan={4}
                              className="text-center text-muted py-3"
                            >
                              Không có thí sinh nào phù hợp.
                            </td>
                          </tr>
                        ) : (
                          displayedStudents.map((student, index) => (
                            <tr
                              key={
                                student.recordId ||
                                student.examineeId ||
                                student.id ||
                                index
                              }
                            >
                              <td>{index + 1}</td>
                              <td>
                                {student.studentCode ||
                                  student.student_ID ||
                                  student.examineeId ||
                                  student.id}
                              </td>
                              <td>{student.fullName}</td>
                              <td>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() =>
                                    handleRemoveStudent(student.recordId)
                                  }
                                >
                                  Xóa
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </Table>
                  </>
                )}
              </Tab.Pane>
            </Tab.Content>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-secondary"
              onClick={fetchExamDetail}
              disabled={!examId || isLoading}
            >
              Tải lại dữ liệu
            </Button>
            <div className="ms-auto d-flex gap-2">
              <Button variant="secondary" onClick={onClose}>
                Hủy
              </Button>
              <Button
                variant="primary"
                type="submit"
                form="edit-exam-form"
                disabled={isSaving || !examId}
              >
                {isSaving ? "Đang lưu..." : "Lưu"}
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
