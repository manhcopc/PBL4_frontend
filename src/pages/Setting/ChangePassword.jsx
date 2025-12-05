import { useState } from "react";
import { Form, Button, Container, Alert, Spinner } from "react-bootstrap";
import authService from "../../service/auth";

function ChangePassword() {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage({ type: "", text: "" });
    if (form.newPassword !== form.confirmPassword) {
      setMessage({ type: "danger", text: "Mật khẩu mới không trùng khớp." });
      return;
    }
    setIsSubmitting(true);
    try {
      await authService.changePassword(form.oldPassword, form.newPassword);
      setMessage({
        type: "success",
        text: "Đổi mật khẩu thành công.",
      });
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Không thể đổi mật khẩu", error);
      setMessage({
        type: "danger",
        text:
          error.response?.data?.detail ||
          "Không thể đổi mật khẩu. Vui lòng kiểm tra lại thông tin.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="py-4">
      <h3>Đổi mật khẩu</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nhập mật khẩu cũ</Form.Label>
          <Form.Control
            type="password"
            name="oldPassword"
            value={form.oldPassword}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Nhập mật khẩu mới</Form.Label>
          <Form.Control
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Xác nhận mật khẩu mới</Form.Label>
          <Form.Control
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {message.text && (
          <Alert variant={message.type} className="py-2">
            {message.text}
          </Alert>
        )}

        <Button variant="success" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Spinner
                animation="border"
                size="sm"
                role="status"
                className="me-2"
              />
              Đang lưu...
            </>
          ) : (
            "Lưu mật khẩu"
          )}
        </Button>
      </Form>
    </Container>
  );
}

export default ChangePassword;
