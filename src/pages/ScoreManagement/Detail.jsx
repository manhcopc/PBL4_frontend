import { Modal, Table, Button, Row, Col } from "react-bootstrap";
export default function Detail({ show, onClose, exam, examDetails }) {
   if (!exam) return null; // Nếu chưa chọn mã đề, không render gì cả

   const detail = examDetails[exam];

   return (
     <Modal show={show} onHide={onClose} size="lg" centered>
       <Modal.Header closeButton>
         <Modal.Title>
           Chi tiết mã đề <span className="text-primary fw-bold">{exam}</span>
         </Modal.Title>
       </Modal.Header>

       <Modal.Body>
         <p>
           <strong>Tổng số câu hỏi:</strong> {detail.totalQuestions}
         </p>
         <p>
           <strong>Tổng số sinh viên:</strong> {detail.totalStudents}
         </p>
         <p>
           <strong>Điểm trung bình:</strong> {detail.averageScore}
         </p>

         <hr />
         <h6 className="fw-bold text-secondary mb-3">Danh sách kết quả</h6>

         <Table bordered hover responsive>
           <thead className="table-light">
             <tr>
               <th>#</th>
               <th>Tên sinh viên</th>
               <th>Số câu đúng</th>
               <th>Điểm</th>
             </tr>
           </thead>
           <tbody>
             {detail.results.map((item) => (
               <tr key={item.id}>
                 <td>{item.id}</td>
                 <td>{item.name}</td>
                 <td>{item.correct}</td>
                 <td>{item.score}</td>
               </tr>
             ))}
           </tbody>
         </Table>
       </Modal.Body>

       <Modal.Footer>
         <Button variant="secondary" onClick={onClose}>
           Đóng
         </Button>
       </Modal.Footer>
     </Modal>
   );
}
