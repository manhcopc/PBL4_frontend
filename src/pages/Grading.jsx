import React, { useState } from "react";
import { Button, Row, Col, Card, Form, Table, Spinner } from "react-bootstrap";
import gradingService from "../application/grading";

const ANSWER_OPTIONS = ["A", "B", "C", "D"];

const getAnswerLetter = (value) => {
  const numeric = Number(value);
  if (!Number.isNaN(numeric) && numeric >= 0 && numeric < ANSWER_OPTIONS.length) {
    return ANSWER_OPTIONS[numeric];
  }
  const upper = (value || "").toString().trim().toUpperCase();
  if (ANSWER_OPTIONS.includes(upper)) {
    return upper;
  }
  return ANSWER_OPTIONS[0];
};

const Grading = () => {
  const [cameraFrame, setCameraFrame] = useState(null);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [gradingExamId, setGradingExamId] = useState("");
  const [records, setRecords] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [recordsError, setRecordsError] = useState("");

  const applyResultDetailsToImage = (imageId, resultDetail) => {
    if (!resultDetail) return;
    setCapturedImages((prev) =>
      prev.map((img) =>
        img.id === imageId
          ? {
              ...img,
              result: {
                ...img.result,
                made: resultDetail.examPaperCode || img.result?.made || "",
                examPaperCode:
                  resultDetail.examPaperCode || img.result?.examPaperCode,
                totalQuestions:
                  resultDetail.totalQuestions ??
                  img.result?.totalQuestions ??
                  0,
                correctAnswers:
                  resultDetail.correctAnswers ??
                  img.result?.correctAnswers ??
                  0,
                score:
                  resultDetail.score ??
                  img.result?.score ??
                  img.result?.resultScore ??
                  0,
                details: resultDetail.details || [],
              },
            }
          : img
      )
    );
  };

  const fetchCameraFrame = async () => {
    setIsCameraLoading(true);
    try {
      const blob = await gradingService.fetchCameraSnapshot();
      const imageUrl = URL.createObjectURL(blob);
      setCameraFrame(imageUrl);
    } catch (error) {
      console.error("Không thể tải camera", error);
    } finally {
      setIsCameraLoading(false);
    }
  };

  const captureImage = async () => {
    setIsCapturing(true);
    try {
      const blob = await gradingService.fetchCameraSnapshot();
      const file = new File([blob], `camera-${Date.now()}.jpg`, {
        type: blob.type || "image/jpeg",
      });
      const imageUrl = URL.createObjectURL(blob);
      setCameraFrame(imageUrl);
      setCapturedImages((prev) => [
        {
          id: Date.now(),
          src: imageUrl,
          file,
          status: "idle",
          result: null,
          error: null,
          examineeId: "",
        },
        ...prev,
      ]);
    } catch (error) {
      console.error("Lỗi khi chụp ảnh:", error);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleUploadFromDevice = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const imageUrl = URL.createObjectURL(file);
    setCapturedImages((prev) => [
      {
        id: Date.now(),
        src: imageUrl,
        file,
        status: "idle",
        result: null,
        error: null,
        examineeId: "",
      },
      ...prev,
    ]);
  };

  const fetchRecords = async (targetExamId = gradingExamId) => {
    if (!targetExamId) {
      return;
    }
    setRecordsLoading(true);
    setRecordsError("");
    try {
      const list = await gradingService.listRecords(targetExamId);
      setRecords(list);
    } catch (error) {
      console.error("Không thể tải danh sách thí sinh đã chấm", error);
      setRecordsError("Không thể tải danh sách thí sinh đã chấm.");
      setRecords([]);
    } finally {
      setRecordsLoading(false);
    }
  };

  const upsertRecord = (newRecord) => {
    setRecords((prev) => {
      const existingIndex = prev.findIndex(
        (record) => record.recordId === newRecord.recordId
      );
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = newRecord;
        return updated;
      }
      return [newRecord, ...prev];
    });
  };

  // const handleImageExamineeChange = (imageId, value) => {
  //   setCapturedImages((prev) =>
  //     prev.map((img) =>
  //       img.id === imageId
  //         ? {
  //             ...img,
  //             examineeId: value,
  //           }
  //         : img
  //     )
  //   );
  // };
  const handleResultFieldChange = (imageId, field, value) => {
    setCapturedImages((prev) =>
      prev.map((img) =>
        img.id === imageId
          ? {
              ...img,
              result: {
                ...img.result,
                [field]: value,
              },
            }
          : img
      )
    );
  };

  const handleAnswerChange = (imageId, question, value) => {
    setCapturedImages((prev) =>
      prev.map((img) =>
        img.id === imageId
          ? {
              ...img,
              result: {
                ...img.result,
                answers: {
                  ...(img.result?.answers || {}),
                  [question]: value,
                },
              },
            }
          : img
      )
    );
  };

  const handleSaveResult = async (imageId) => {
    const targetImage = capturedImages.find((img) => img.id === imageId);
    if (!targetImage?.result) {
      return;
    }
    try {
      await gradingService.saveResult({
        examId: gradingExamId,
        result: targetImage.result,
      });
      if (targetImage.result.recordId) {
        try {
          const recordInfo = await gradingService.fetchRecordResult(
            targetImage.result.recordId
          );
          if (recordInfo?.record) {
            upsertRecord(recordInfo.record);
          }
          if (recordInfo?.result) {
            applyResultDetailsToImage(imageId, recordInfo.result);
          }
        } catch (detailError) {
          console.error("Không thể tải chi tiết bài thi", detailError);
        }
      }
      await fetchRecords(gradingExamId);
    } catch (error) {
      console.error("Không thể lưu kết quả chấm", error);
      alert("Không thể lưu kết quả chấm điểm. Vui lòng thử lại.");
    }
  };

  const handleGradeImage = async (imageId) => {
    if (!gradingExamId) {
      setCapturedImages((prev) =>
        prev.map((img) =>
          img.id === imageId
            ? {
                ...img,
                error: "Vui lòng nhập mã kỳ thi trước khi chấm điểm.",
              }
            : img
        )
      );
      return;
    }

    const targetImage = capturedImages.find((img) => img.id === imageId);
    if (!targetImage) return;

    setCapturedImages((prev) =>
      prev.map((img) =>
        img.id === imageId ? { ...img, status: "grading", error: null } : img
      )
    );

    try {
      let fileToGrade = targetImage.file;
      if (!fileToGrade) {
        const response = await fetch(targetImage.src);
        const blob = await response.blob();
        fileToGrade = new File([blob], "snapshot.jpg", {
          type: blob.type || "image/jpeg",
        });
      }

      const result = await gradingService.processImage({
        file: fileToGrade,
      });

      setCapturedImages((prev) =>
        prev.map((img) =>
          img.id === imageId
            ? {
                ...img,
                status: "graded",
                result,
                error: null,
              }
            : img
        )
      );

      if (result.recordId) {
        try {
          const recordInfo = await gradingService.fetchRecordResult(
            result.recordId
          );
          if (recordInfo?.record) {
            upsertRecord(recordInfo.record);
          }
          if (recordInfo?.result) {
            applyResultDetailsToImage(imageId, recordInfo.result);
          }
          await fetchRecords(gradingExamId);
        } catch (resultError) {
          console.error("Không thể lấy kết quả chấm điểm", resultError);
          await fetchRecords(gradingExamId);
        }
      } else {
        await fetchRecords(gradingExamId);
      }
    } catch (error) {
      console.error("Không thể chấm điểm bài thi", error);
      setCapturedImages((prev) =>
        prev.map((img) =>
          img.id === imageId
            ? {
                ...img,
                status: "error",
                error: "Chấm điểm thất bại. Vui lòng thử lại.",
              }
            : img
        )
      );
    }
  };

  return (
    <>
      <h1 style={{ color: "#1C59A1" }}>ESP32-CAM Live</h1>
      <Row>
        <Col md={7}>
          <img
            src={
              cameraFrame || "https://placehold.co/600x400?text=Camera+Preview"
            }
            alt="Camera Stream"
            style={{
              width: "100%",
              border: "2px solid #1C59A1",
              borderRadius: "10px",
            }}
          />

          <Button
            style={{
              background: "#1C59A1",
            }}
            className="mt-3 me-2"
            onClick={fetchCameraFrame}
            disabled={isCameraLoading}
          >
            {isCameraLoading ? "Đang tải..." : "Làm mới camera"}
          </Button>

          <Button
            style={{
              background: "#1C59A1",
            }}
            className="mt-3 me-2"
            onClick={captureImage}
            disabled={isCapturing}
          >
            {isCapturing ? "Đang chụp..." : "Chụp ảnh"}
          </Button>

          <Form.Group className="mt-3">
            <Form.Label className="fw-semibold">
              Hoặc tải ảnh từ máy (để chấm điểm thủ công):
            </Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleUploadFromDevice}
            />
          </Form.Group>
          {capturedImages.length > 0 && (
            <div className="mt-4">
              <h5>Ảnh chờ chấm điểm</h5>
              {capturedImages.map((image) => (
                <Card className="mb-3" key={image.id}>
                  <Card.Body>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={image.src}
                          alt="Bài thi"
                          style={{
                            width: "100%",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                          }}
                        />
                      </Col>
                      <Col md={6}>
                        <p className="mb-1">
                          Trạng thái:{" "}
                          <strong>
                            {image.status === "idle" && "Chưa chấm"}
                            {image.status === "grading" && "Đang chấm..."}
                            {image.status === "graded" && "Đã chấm"}
                            {image.status === "error" && "Lỗi"}
                          </strong>
                        </p>
                        {image.error && (
                          <p className="text-danger small mb-2">
                            {image.error}
                          </p>
                        )}
                        {/* <Form.Group className="mb-2">
                          <Form.Label>ID thí sinh</Form.Label>
                          <Form.Control
                            type="text"
                            value={image.examineeId || ""}
                            onChange={(e) =>
                              handleImageExamineeChange(
                                image.id,
                                e.target.value
                              )
                            }
                            placeholder="Nhập ID thí sinh"
                          />
                        </Form.Group> */}
                        <Button
                          variant="success"
                          disabled={image.status === "grading"}
                          onClick={() => handleGradeImage(image.id)}
                        >
                          {image.status === "grading"
                            ? "Đang nhận diện..."
                            : "Nhận diện"}
                        </Button>
                        {image.result && (
                          <div className="mt-3 w-100">
                            <Row className="g-2">
                              <Col md={6}>
                                <Form.Group>
                                  <Form.Label>Mã thí sinh (SBD)</Form.Label>
                                  <Form.Control
                                    value={image.result.sbd || ""}
                                    onChange={(e) =>
                                      handleResultFieldChange(
                                        image.id,
                                        "sbd",
                                        e.target.value
                                      )
                                    }
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group>
                                  <Form.Label>Mã đề</Form.Label>
                                  <Form.Control
                                    value={image.result.made || ""}
                                    onChange={(e) =>
                                      handleResultFieldChange(
                                        image.id,
                                        "made",
                                        e.target.value
                                      )
                                    }
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                            {image.result.details?.length ? (
                              <div className="mt-3">
                                <p className="fw-semibold mb-1">
                                  Kết quả chấm:
                                </p>
                                <div className="d-flex flex-wrap gap-2">
                                  {image.result.details.map((detail) => (
                                    <span
                                      key={`${image.id}-${detail.questionNumber}`}
                                      className={`px-3 py-2 rounded-pill fw-semibold ${
                                        detail.markResult
                                          ? "bg-success text-white"
                                          : "bg-danger text-white"
                                      }`}
                                    >
                                      Câu {detail.questionNumber}:{" "}
                                      {detail.answerLetter ||
                                        getAnswerLetter(detail.answerNumber)}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="mt-3">
                                <p className="fw-semibold mb-1">Đáp án:</p>
                                <div className="d-flex flex-wrap gap-3">
                                  {Object.entries(
                                    image.result.answers || {}
                                  ).map(([question, answer]) => (
                                    <Form.Group
                                      key={`${image.id}-${question}`}
                                      className="d-flex align-items-center"
                                    >
                                      <Form.Label className="me-2 mb-0">
                                        {question}
                                      </Form.Label>
                                      <Form.Select
                                        size="sm"
                                        value={answer || "A"}
                                        onChange={(e) =>
                                          handleAnswerChange(
                                            image.id,
                                            question,
                                            e.target.value
                                          )
                                        }
                                      >
                                        {ANSWER_OPTIONS.map((opt) => (
                                          <option key={opt} value={opt}>
                                            {opt}
                                          </option>
                                        ))}
                                      </Form.Select>
                                    </Form.Group>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        {image.result && (
                          <Button
                            variant="primary"
                            className="mt-2"
                            onClick={() => handleSaveResult(image.id)}
                          >
                            Chấm bài thi
                          </Button>
                        )}
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </Col>

        <Col md={5}>
          <Card className="p-3" style={{ border: "1px solid #E3F2FD" }}>
            <h5>Danh sách thí sinh đã chấm</h5>
            <Form
              className="mb-3"
              onSubmit={(e) => {
                e.preventDefault();
                fetchRecords();
              }}
            >
              <Form.Group className="mb-2">
                <Form.Label>Mã kỳ thi</Form.Label>
                <Form.Control
                  value={gradingExamId}
                  onChange={(e) => setGradingExamId(e.target.value)}
                  placeholder="Nhập ID kỳ thi"
                />
              </Form.Group>
              <Button
                style={{ backgroundColor: "#1C59A1", color: "white" }}
                type="submit"
                disabled={!gradingExamId || recordsLoading}
              >
                {recordsLoading ? "Đang tải..." : "Tải danh sách"}
              </Button>
            </Form>

            {recordsError && (
              <div className="text-danger text-center mb-2">{recordsError}</div>
            )}

            {recordsLoading ? (
              <div className="text-center py-4">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : records.length === 0 ? (
              <div className="text-center text-muted">Chưa có dữ liệu.</div>
            ) : (
              <Table striped bordered hover responsive size="sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Mã SV</th>
                    <th>Họ tên</th>
                    <th>Lớp</th>
                    <th>Số câu đúng</th>
                    <th>Điểm</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, index) => (
                    <tr key={record.recordId}>
                      <td>{index + 1}</td>
                      <td>{record.studentCode}</td>
                      <td>{record.fullName}</td>
                      <td>{record.className}</td>
                      <td>{record.correctCount}</td>
                      <td>{record.score}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Grading;
