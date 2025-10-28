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

const ExamModule = () => {
  const [showCreateExam, setShowCreateClass] = useState(false);
  const [showEditExam, setShowEditExam] = useState(false);
  const handleShowCreate = () => setShowCreateClass(true);
    const handleCloseCreate = () => setShowCreateClass(false);
    const handleShowEdit = () => setShowEditExam(true)
    const handleCloseEdit = () => setShowEditExam(false)

  return (
    <>
      <h2 className="mx-auto" style={{ color: "#007BFF" }}>
        Quản Lý Đề Thi và Đáp Án
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
      <Button variant="primary mt-3" onClick={handleShowCreate}>
        Tạo Đề Thi Mới
          </Button>
          <CreateExam show={showCreateExam} onClose={handleCloseCreate} />

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
                    <Button
                      type="button"
                      variant="btn btn-sm btn-outline-primary"
                      onClick={handleShowEdit}
                    >
                      Chỉnh sửa
                    </Button>
                    <EditExam show={showEditExam} onClose={handleCloseEdit} />
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
};

export default ExamModule;
