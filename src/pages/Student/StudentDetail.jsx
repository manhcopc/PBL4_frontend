import { useParams } from "react-router-dom";
import { Table, Container, Modal, Row, Col, Card } from "react-bootstrap";

function StudentDetail({show, onClose}) {
  // const { id, examId } = useParams();
  return (
    <Modal show={show} onHide={onClose} className="py-5 px-4 ">
      <h3 className="text-center fw-bold">Thông tin sinh viên</h3>
      <Container fluid className="bg-primary text-white p-4">
        <Row className="align-items-center">
          <Col sm={4} className="text-center">
            <img
              className="img-fluid rounded bg-light p-1"
              src="path/to/student/image.jpg"
              alt="Student"
              style={{ maxWidth: "200px" }}
            />
          </Col>

          <Col sm={8}>
            <p>Họ và tên: Nguyễn Văn A</p>
            <p>MSSV: 12345678</p>
            <p>Ngày sinh: CNTT K20</p>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <h3 className="fw-bold text-center">Thông tin bài thi</h3>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col className="col-lg-4 col-md-6 mb-3">
            <Container
              fluid
              className="
        mt-4 border rounded bg-white p-3
        d-flex flex-sm-row flex-lg-column
        justify-content-center align-items-stretch
      "
            >
              <div className="flex-fill text-center m-1">
                <p className="fw-bold text-black mb-1 fs-6">Tên bài thi</p>
                <p className="text-secondary mb-0">Mã số: 001</p>
              </div>
              <div className="text-center flex-fill">
                <p className="fw-bold text-black mb-1">Số câu đúng</p>
                <h4 className="text-success fs-5 mb-0">18 / 20</h4>
              </div>
              <div className=" text-center flex-fill m-1">
                <p className="fw-bold text-black mb-1">Điểm</p>
                <h4 className="text-primary fw-bold mb-0">9.0</h4>
              </div>
            </Container>
          </Col>
        </Row>
      </Container>
    </Modal>
  );
}

export default StudentDetail;
