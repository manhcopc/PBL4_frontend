import { Form, Button, Container } from "react-bootstrap";

function ChangePassword() {
  return (
    <>
      <Container className="py-4">
        <h3>Tạo mật khẩu mới</h3>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="inputPassword5">Nhập mật khẩu cũ</Form.Label>
            <Form.Control
              type="password"
              id="inputPassword5"
              aria-describedby="passwordHelpBlock"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="inputPassword5">Nhập mật khẩu mới</Form.Label>
            <Form.Control type="text" name="subject" required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="inputPassword5">
              Xác thực mật khẩu mới
            </Form.Label>
            <Form.Control type="text" name="subject" required />
          </Form.Group>

          <Button variant="success" type="submit">
            Lưu mật khẩu
          </Button>
        </Form>
      </Container>
    </>
  );
}

export default ChangePassword;
