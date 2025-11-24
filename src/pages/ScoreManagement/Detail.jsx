import { Modal, Table, Button, Row, Col, Form, Spinner } from "react-bootstrap";
import { useCallback, useEffect, useMemo, useState } from "react";
import scoreManagementService from "../../application/scoreManagement";

export default function Detail({ show, onClose, exam }) {
  const [records, setRecords] = useState([]);
  const [originalRecords, setOriginalRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const examId = exam?.id;
  const totalQuestions = exam?.questionCount || 0;

  const fetchRecords = useCallback(async () => {
    if (!examId) return;
    setIsLoading(true);
    setErrorMessage("");
    try {
      const list = await scoreManagementService.getExamRecords(examId);
      const normalized = list.map((record) => ({
        ...record,
        pendingImageUpload: null,
        gradedImageUpload: null,
      }));
      setRecords(normalized);
      setOriginalRecords(
        normalized.map((record) => ({
          ...record,
        }))
      );
    } catch (error) {
      console.error("Không thể tải danh sách bài thi", error);
      setErrorMessage("Không thể tải danh sách bài làm.");
      setRecords([]);
      setOriginalRecords([]);
    } finally {
      setIsLoading(false);
    }
  }, [examId]);

  useEffect(() => {
    if (show && examId) {
      fetchRecords();
    } else if (!show) {
      setRecords([]);
      setOriginalRecords([]);
      setErrorMessage("");
      setIsLoading(false);
    }
  }, [show, examId, fetchRecords]);

  const handleChange = (recordId, field, value) => {
    setRecords((prev) =>
      prev.map((record) =>
        record.recordId === recordId
          ? {
              ...record,
              [field]: field === "score" ? Number(value) : Number.parseInt(value, 10) || 0,
            }
          : record
      )
    );
  };

  const averageScore = useMemo(() => {
    if (!records.length) return 0;
    const sum = records.reduce((acc, record) => acc + (Number(record.score) || 0), 0);
    return (sum / records.length).toFixed(2);
  }, [records]);

  const totalStudents = records.length;

  const handleImageChange = (recordId, field, file) => {
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      setRecords((prev) =>
        prev.map((record) =>
          record.recordId === recordId
            ? {
                ...record,
                [field]: result,
                [`${field}Upload`]: result,
              }
            : record
        )
      );
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!examId || !records.length) {
      onClose?.();
      return;
    }
    const changedRecords = records.filter((record) => {
      const original = originalRecords.find((item) => item.recordId === record.recordId);
      if (!original) return true;
      return (
        original.correctCount !== record.correctCount ||
        original.score !== record.score ||
        original.pendingImage !== record.pendingImage ||
        original.gradedImage !== record.gradedImage
      );
    });

    if (changedRecords.length === 0) {
      onClose?.();
      return;
    }

    setIsSaving(true);
    try {
      await scoreManagementService.saveExamRecords({
        examId,
        updatedRecords: records,
        originalRecords,
      });
      await fetchRecords();
      onClose?.();
    } catch (error) {
      console.error("Không thể lưu kết quả bài thi", error);
      alert("Không thể lưu kết quả bài thi. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!examId || !exam) {
    return null;
  }

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
        <Modal.Title>Chi tiết kỳ thi</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {errorMessage && (
          <div className="text-danger text-center mb-3">{errorMessage}</div>
        )}
        {isLoading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <>
            <p>
              <strong>Tổng số câu hỏi:</strong> {totalQuestions || "—"}
            </p>
            <p>
              <strong>Tổng số sinh viên:</strong> {totalStudents}
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
                  <th>Mã SV</th>
                  <th>Họ tên</th>
                  <th>Mã đề</th>
                  <th>Số câu đúng</th>
                  <th>Điểm</th>
                  <th>Bài thi chưa chấm</th>
                  <th>Bài thi đã chấm</th>
                </tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center text-muted py-3">
                      Chưa có dữ liệu bài thi.
                    </td>
                  </tr>
                ) : (
                  records.map((record, index) => (
                    <tr key={record.recordId}>
                      <td>{index + 1}</td>
                      <td>{record.studentCode}</td>
                      <td>{record.fullName}</td>
                      <td>{record.paperCode}</td>
                      <td style={{ width: "150px" }}>
                        <Form.Control
                          type="number"
                          min="0"
                          max={totalQuestions || undefined}
                          value={record.correctCount}
                          onChange={(e) =>
                            handleChange(record.recordId, "correctCount", e.target.value)
                          }
                        />
                      </td>
                      <td style={{ width: "150px" }}>
                        <Form.Control
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={record.score}
                          onChange={(e) =>
                            handleChange(record.recordId, "score", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <div className="d-flex flex-column gap-2">
                          {record.pendingImage ? (
                            <img
                              src={record.pendingImage}
                              alt="Bài thi chưa chấm"
                              style={{ maxWidth: "120px" }}
                            />
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                          <Form.Control
                            type="file"
                            accept="image/*"
                            size="sm"
                            onChange={(e) =>
                              handleImageChange(record.recordId, "pendingImage", e.target.files?.[0])
                            }
                          />
                        </div>
                      </td>
                      <td>
                        <div className="d-flex flex-column gap-2">
                          {record.gradedImage ? (
                            <img
                              src={record.gradedImage}
                              alt="Bài thi đã chấm"
                              style={{ maxWidth: "120px" }}
                            />
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                          <Form.Control
                            type="file"
                            accept="image/*"
                            size="sm"
                            onChange={(e) =>
                              handleImageChange(record.recordId, "gradedImage", e.target.files?.[0])
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={isSaving}>
          Đóng
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={isSaving || isLoading || !records.length}
        >
          {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
