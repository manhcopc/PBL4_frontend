import React, { useState, useRef, useEffect } from "react";
import { Button, Row, Col, Card, Form, Table, Spinner, Alert } from "react-bootstrap";
import gradingService from "../service/grading";
import Portal from "../components/shared/item/Portal";

const ANSWER_OPTIONS = ["A", "B", "C", "D", "?"];
const getAnswerLetter = (value) => {
  const numeric = Number(value);
  if (
    !Number.isNaN(numeric) &&
    numeric >= 0 &&
    numeric < ANSWER_OPTIONS.length
  ) {
    return ANSWER_OPTIONS[numeric];
  }
  const upper = (value || "").toString().trim().toUpperCase();
  if (ANSWER_OPTIONS.includes(upper)) {
    return upper;
  }
  return ANSWER_OPTIONS[0];
};

const Grading = () => {
  const [cameraStreamUrl, setCameraStreamUrl] = useState("");
  // const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [gradingExamId, setGradingExamId] = useState("");
  const [records, setRecords] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [recordsError, setRecordsError] = useState("");
  const cameraImgRef = useRef(null);
  const [zoomImage, setZoomImage] = useState(null);

  const openZoom = (src) => setZoomImage(src);
  const closeZoom = () => setZoomImage(null);
  
  // const handleImageClick = (src) => {
  //   openZoom(src);
  // };

  const toggleImageDetails = (imageId) => {
    setCapturedImages((prev) =>
      prev.map((img) =>
        img.id === imageId ? { ...img, isShowDetails: !img.isShowDetails } : img
      )
    );
  };


  const applyResultDetailsToImage = (imageId, resultDetail) => {
    if (!resultDetail) return;
    setCapturedImages((prev) =>
      prev.map((img) =>
        img.id === imageId
          ? {
              ...img,
              result: {
                ...img.result,
                made:
                  resultDetail.examPaperCode ||
                  img.result?.made ||
                  img.result?.exam_paper_code ||
                  resultDetail.exam_paper_code,
                examPaperCode:
                  resultDetail.exam_paper_code ||
                  resultDetail.examPaperCode ||
                  img.result?.examPaperCode,
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

  useEffect(() => {
    const url = gradingService.fetchCameraStreamUrl();
    setCameraStreamUrl(url);
  }, []);
  const handleUploadFromDevice = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    const newImage = { id: Date.now(), src: imageUrl, file, status: 'idle', result: null, error: null, examineeId: '', isShowDetails: true, };
    setCapturedImages(prev => [newImage, ...prev]);
  };

  const captureImage = async () => {
    setIsCapturing(true);
    try {
      const blob = await gradingService.fetchCameraSnapshot();
      const file = new File([blob], `camera-${Date.now()}.jpg`, {
        type: blob.type || "image/jpeg",
      });
      const imageUrl = URL.createObjectURL(blob);
      const newImage = {
        id: Date.now(),
        src: imageUrl,
        file,
        status: "idle",
        result: null,
        error: null,
        examineeId: "",
        isShowDetails: true,
      };
      setCapturedImages((prev) => [newImage, ...prev]);
    } catch (error) {
      console.error("Lỗi khi chụp ảnh:", error);
      alert("Không thể chụp ảnh từ camera. Vui lòng thử lại.");
    } finally {
      setIsCapturing(false);
    }
  };

  const fetchRecords = async (targetExamId = gradingExamId) => {
    if (!targetExamId) return [];

    setRecordsLoading(true);
    setRecordsError("");
    try {
      const list = await gradingService.listRecords(targetExamId);
      setRecords(list);
      return list;
    } catch (error) {
      console.error("Lỗi fetchRecords:", error);
      setRecordsError("Không thể tải danh sách.");
      setRecords([]);
      return []; 
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

  
  const handleSaveResult = async (imageId, gradingExamId) => {
    const targetImage = capturedImages.find((img) => img.id === imageId);
    if (!targetImage?.result) return;
    const currentSBD = targetImage.result.sbd;

    try {
      await gradingService.saveResult({
        exam: gradingExamId,
        result: targetImage.result,
      });
      console.log("Đang tải lại danh sách để tìm SBD:", currentSBD);
      const latestRecords = await fetchRecords(gradingExamId);
      const foundRecord = latestRecords.find(
        (rec) => String(rec.studentCode) === String(currentSBD)
      );

      if (foundRecord) {
        console.log("Tìm thấy record trong danh sách:", foundRecord);
        console.log("Record ID cần lấy kết quả:", foundRecord.recordId);
        const enrichedData = await gradingService.fetchRecordResult(
          foundRecord.recordId
        );

        if (enrichedData?.result) {
          console.log("Dữ liệu chi tiết từ API:", enrichedData.result);
          setCapturedImages((prev) =>
            prev.map((img) => {
              if (img.id === imageId) {
                return {
                  ...img,
                  status: "graded",
                  isShowDetails: true,
                  result: {
                    ...img.result,
                    score: enrichedData.result.score,
                    details: enrichedData.result.details,
                  },
                };
              }
              return img;
            })
          );
        }
      } else {
        console.warn(
          "Lưu thành công nhưng không tìm thấy SBD trong danh sách mới tải."
        );
      }
    } catch (error) {
      console.error("Lỗi quy trình Lưu:", error);
      alert("Lỗi khi lưu kết quả.");
    }
  };

  const handleGradeImage = async (imageId) => {
    if (!gradingExamId) {
      setCapturedImages((prev) =>
        prev.map((img) =>
          img.id === imageId
            ? {
                ...img,
                error: "Vui lòng nhập mã kỳ thi trước khi nhận diện.",
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
      {zoomImage && (
        <Portal>
          <div
            // className="fixed inset-0 bg-black/70 flex items-center justify-center z-[99999999]"
            className="lightbox-overlay"
            onClick={closeZoom}
          >
            <img
              src={zoomImage}
              className="rounded shadow-lg"
              style={{ maxHeight: "90%", maxWidth: "90%" }}
              onClick={(e) => e.stopPropagation()}
            />

            <button
              onClick={closeZoom}
              className="absolute top-5 right-5 bg-white text-black px-4 py-2 rounded-full shadow-lg"
            >
              ✕
            </button>
          </div>
        </Portal>
      )}
      <h1 style={{ color: "#1C59A1" }}>Trực tiếp</h1>
      <Row>
        <Col md={7}>
          <div
            className="relative bg-black overflow-hiddenemini"
            style={{
              border: "4px solid #1C59A1",
              borderRadius: "12px",
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          >
            <img
              ref={cameraImgRef}
              src="/api/CameraStream/TMDB-00001/"
              alt="Camera Stream"
              crossOrigin="anonymous"
              className="w-full h-full object-cover"
              style={{
                maxHeight: "100%",
                maxWidth: "100%",
                imageRendering: "crisp-edges",
              }}
              onError={(e) => {
                e.target.src =
                  "https://placehold.co/1920x1080/222/fff?text=CAMERA+OFFLINE";
              }}
            />

            <div className="absolute top-3 left-3 bg-red-600 text-white px-4 py-1 rounded-full text-sm font-bold animate-pulse shadow-lg z-10">
              LIVE
            </div>
          </div>
          <Button
            style={{ background: "#1C59A1" }}
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
              <h5 className="fw-bold  mb-3" style={{ color: "#1C59A1" }}>
                Ảnh chờ chấm điểm ({capturedImages.length})
              </h5>
              {capturedImages.map((image) => (
                <Card className="mb-4 shadow-lg border-0" key={image.id}>
                  <Card.Body className="p-4">
                    <Row className="align-items-start">
                      <Col md={5}>
                        <div className="border border-2 border-primary rounded-3 overflow-hidden">
                          <img
                            src={image.src}
                            alt="Bài thi đã chụp"
                            className="max-witdh h-auto"
                            style={{
                              maxWidth: "100%",
                              maxHeight: "100%",
                              objectFit: "contain",
                              background: "#f8f9fa",
                            }}
                          />
                        </div>
                      </Col>
                      <Col md={7}>
                        <div className="h-100 d-flex flex-column justify-content-between">
                          <div className="d-flex justify-content-between align-items-center">
                            <p className="mb-2">
                              <strong>Trạng thái:</strong>{" "}
                              <span
                                className={
                                  image.status === "graded"
                                    ? "text-success"
                                    : image.status === "grading"
                                    ? "text-warning"
                                    : image.status === "error"
                                    ? "text-danger"
                                    : "text-muted"
                                }
                              >
                                {image.status === "idle" && "Chưa chấm"}
                                {image.status === "grading" &&
                                  "Đang nhận diện..."}
                                {image.status === "graded" && "Đã nhận diện"}
                                {image.status === "error" && "Lỗi"}
                              </span>
                            </p>
                            {image.error && (
                              <Alert variant="danger" className="small py-2">
                                {image.error}
                              </Alert>
                            )}
                            {image.result && (
                              <Button
                                onClick={() => toggleImageDetails(image.id)}
                                style={{
                                  backgroundColor: "transparent",
                                  border: "1px solid #FFFFFF",
                                  color: "#1C59A1",
                                }}
                                size="lg"
                                className=" mb-3"
                              >
                                {image.isShowDetails ? "Hiện" : "Ẩn"}
                              </Button>
                            )}
                          </div>

                          <div className="mt-3">
                            <Button
                              variant="success"
                              size="lg"
                              className="w-100 mb-3"
                              disabled={
                                image.status === "grading" ||
                                image.status === "graded"
                              }
                              onClick={() => handleGradeImage(image.id)}
                            >
                              {image.status === "grading"
                                ? "Đang nhận diện..."
                                : "Nhận diện & Chấm điểm"}
                            </Button>

                            {image.isShowDetails && image.result && (
                              <div className="card mt-3 border-0 bg-light">
                                <div className="card-body p-2">
                                  <div className="row g-2 mb-3">
                                    <div className="col-6">
                                      <label className="form-label small fw-bold text-muted">
                                        SBD
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control form-control-sm fw-bold text-primary"
                                        value={image.result.sbd || ""}
                                        onChange={(e) =>
                                          handleResultFieldChange(
                                            image.id,
                                            "sbd",
                                            e.target.value
                                          )
                                        }
                                        placeholder="Nhập SBD..."
                                      />
                                    </div>
                                    <div className="col-6">
                                      <label className="form-label small fw-bold text-muted">
                                        Mã đề
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control form-control-sm fw-bold text-primary"
                                        value={image.result.made || ""}
                                        onChange={(e) =>
                                          handleResultFieldChange(
                                            image.id,
                                            "made",
                                            e.target.value
                                          )
                                        }
                                        placeholder="Mã đề..."
                                      />
                                    </div>
                                  </div>

                                  <hr className="my-2" />
                                  <div className="mb-3">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                      <span className="fw-bold small">
                                        Chi tiết bài làm:
                                      </span>
                                      <span className="badge bg-secondary">
                                        {image.result.details?.length || 0} câu
                                      </span>
                                    </div>
                                    <div
                                      className="border rounded bg-white p-2"
                                      style={{
                                        maxHeight: "250px",
                                        overflowY: "auto",
                                      }}
                                    >
                                      {/* {image.result.details?.length > 0 ? ( */}
                                      {console.log(
                                        `Ảnh ${image.id} - Details Length:`,
                                        image.result.details?.length
                                      ) || image.result.details?.length > 0 ? (
                                        <div className="row g-2">
                                          {image.result.details.map(
                                            (detail) => {
                                              const isCorrect =
                                                detail.markResult === true;
                                              const isIncorrect =
                                                detail.markResult === false;
                                              let colorClass = "";
                                              if (isCorrect)
                                                colorClass = "text-success";
                                              if (isIncorrect)
                                                colorClass = "text-danger";

                                              return (
                                                <div
                                                  key={`${image.id}-${detail.questionNumber}`}
                                                  className="col-4 col-sm-3"
                                                >
                                                  <div
                                                    className={`d-flex align-items-center p-1 rounded ${
                                                      isCorrect
                                                        ? "bg-success-soft"
                                                        : ""
                                                    } ${
                                                      isIncorrect
                                                        ? "bg-danger-soft"
                                                        : ""
                                                    }`}
                                                  >
                                                    <span
                                                      className={`fw-bold me-2 px-2 py-1 rounded ${
                                                        isCorrect
                                                          ? "bg-success text-white"
                                                          : isIncorrect
                                                          ? "bg-danger text-white"
                                                          : "bg-light"
                                                      }`}
                                                    >
                                                      {detail.questionNumber}
                                                    </span>
                                                    <span
                                                      className={`fw-bold fs-5 ${colorClass}`}
                                                    >
                                                      {detail.answerLetter ||
                                                        getAnswerLetter(
                                                          detail.answerNumber
                                                        )}
                                                    </span>
                                                  </div>
                                                </div>
                                              );
                                            }
                                          )}
                                        </div>
                                      ) : (
                                        <div className="row g-2">
                                          {Object.entries(
                                            image.result.answers || {}
                                          ).map(([question, answer]) => (
                                            <div
                                              key={`${image.id}-${question}`}
                                              className="col-4 col-sm-3"
                                            >
                                              <div className="input-group input-group-sm">
                                                <span
                                                  className="input-group-text px-1 text-muted"
                                                  style={{
                                                    minWidth: "35px",
                                                    justifyContent: "center",
                                                  }}
                                                >
                                                  {question}
                                                </span>
                                                <select
                                                  className="form-select px-1 fw-bold text-center"
                                                  value={answer || "?"}
                                                  style={{
                                                    appearance: "none",
                                                    WebkitAppearance: "none",
                                                    MozAppearance: "none",
                                                    backgroundImage: "none",
                                                    cursor: "pointer",
                                                    paddingRight: 0,
                                                    paddingLeft: 0,
                                                    textAlign: "center",
                                                    textAlignLast: "center",
                                                  }}
                                                  onChange={(e) =>
                                                    handleAnswerChange(
                                                      image.id,
                                                      question,
                                                      e.target.value
                                                    )
                                                  }
                                                >
                                                  {ANSWER_OPTIONS.map((opt) => (
                                                    <option
                                                      key={opt}
                                                      value={opt}
                                                    >
                                                      {opt}
                                                    </option>
                                                  ))}
                                                </select>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  {image.result.details?.length == 0 && (
                                    <button
                                      className="btn btn-primary w-100 py-2 fw-bold shadow-sm"
                                      style={{
                                        backgroundColor: "#1C59A1",
                                        borderColor: "#1C59A1",
                                      }}
                                      onClick={() =>
                                        handleSaveResult(
                                          image.id,
                                          gradingExamId
                                        )
                                      }
                                    >
                                      <i className="bi bi-floppy2-fill me-2"></i>
                                      Lưu kết quả
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
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
              <div
                className="table-responsive"
                style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
              >
                <Table striped bordered hover responsive size="sm">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Mã SV</th>
                      <th>Họ tên</th>
                      {/* <th>Mã đề</th> */}
                      {/* <th>Số câu đúng</th> */}
                      <th className="text-end">Điểm</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* {records.map((record, index) => (
                      <tr key={record.recordId}>
                        <td>{index + 1}</td>
                        <td>{record.studentCode}</td>
                        <td>{record.fullName}</td>
                        <td>{record.made}</td>
                        <td>{record.correctCount}</td>
                        <td>{record.score}</td>
                      </tr>
                    ))} */}
                    {records.map((record, index) => (
                      <tr
                        key={record.recordId}
                        // onClick={() => handleSelectRecord(record)}
                        style={{ cursor: "pointer" }}
                        title="Bấm để xem lại bài thi"
                        onClick={() => openZoom(record.processedImage)}
                      >
                        <td>{index + 1}</td>
                        <td className="fw-bold">{record.studentCode}</td>
                        <td>{record.fullName}</td>
                        {/* <td>{record.made}</td> */}
                        <td className="text-end fw-bold text-primary">
                          {record.score}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Grading;

