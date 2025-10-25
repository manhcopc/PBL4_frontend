import React, { useState } from "react";
import { Button, Row, Col, Card } from "react-bootstrap";

const ESP32_IP = "http://10.205.197.10";

const Grading = () => {
  const [snapshot, setSnapshot] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const captureImage = async () => {
    setIsCapturing(true);
    try {
      const res = await fetch(`${ESP32_IP}/capture`);
      const blob = await res.blob();
      const imageUrl = URL.createObjectURL(blob);
      setSnapshot(imageUrl);
    } catch (error) {
      console.error("Lỗi khi chụp ảnh:", error);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <>
      <h2 style={{ color: "#007BFF" }}>ESP32-CAM Live</h2>
      <Row>
        <Col md={7}>
          <img
            src={`${ESP32_IP}:81/stream`}
            alt="ESP32 Stream"
            style={{
              width: "100%",
              border: "2px solid #007BFF",
              borderRadius: "10px",
            }}
          />

          <Button
            variant="primary"
            className="mt-3"
            onClick={captureImage}
            disabled={isCapturing}
          >
            {isCapturing ? "Đang chụp..." : "Chụp ảnh"}
          </Button>

          {snapshot && (
            <div className="mt-3">
              <h6>Ảnh đã chụp:</h6>
              <img
                src={snapshot}
                alt="Snapshot"
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
          )}
        </Col>

        <Col md={5}>
          <Card className="p-3" style={{ border: "1px solid #E3F2FD" }}>
            <h5>Kết quả xử lý (tạm thời trống)</h5>
            <p>Chưa kết nối backend</p>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Grading;
