import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import authService from "../../application/auth";
import { Form, Button } from "react-bootstrap";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetForm, setResetForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [resetMessage, setResetMessage] = useState({ type: "", text: "" });
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const handleResetChange = (event) => {
    const { name, value } = event.target;
    setResetForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendOtp = async () => {
    setResetMessage({ type: "", text: "" });
    if (!resetForm.email) {
      setResetMessage({
        type: "danger",
        text: "Vui lòng nhập email đã đăng ký.",
      });
      return;
    }
    setIsSendingOtp(true);
    try {
      await authService.requestPasswordReset(resetForm.email, "password_reset");
      setOtpSent(true);
      setResetMessage({
        type: "success",
        text: "Đã gửi mã OTP tới email của bạn.",
      });
    } catch (err) {
      console.error("Không thể gửi OTP", err);
      setResetMessage({
        type: "danger",
        text:
          err.response?.data?.detail || "Không thể gửi OTP. Vui lòng thử lại.",
      });
      setOtpSent(false);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleResetPassword = async () => {
    setResetMessage({ type: "", text: "" });
    if (!otpSent) {
      setResetMessage({ type: "danger", text: "Vui lòng gửi OTP trước." });
      return;
    }
    if (!resetForm.otp) {
      setResetMessage({ type: "danger", text: "Vui lòng nhập mã OTP." });
      return;
    }
    if (resetForm.newPassword !== resetForm.confirmPassword) {
      setResetMessage({
        type: "danger",
        text: "Mật khẩu mới không trùng khớp.",
      });
      return;
    }
    setIsResetting(true);
    try {
      const verifyRes = await authService.verifyOtp(
        resetForm.email,
        resetForm.otp
      );
      const token =
        verifyRes?.token ||
        verifyRes?.verification_token ||
        verifyRes?.data?.token;
      if (!token) {
        throw new Error("Không nhận được token xác thực");
      }

      await authService.resetPassword(token, resetForm.newPassword);

      setResetMessage({
        type: "success",
        text: "Đặt lại mật khẩu thành công, bạn có thể đăng nhập lại.",
      });
      setResetForm({
        email: "",
        otp: "",
        newPassword: "",
        confirmPassword: "",
      });
      setOtpSent(false);
      setShowResetForm(false);
    } catch (err) {
      console.error("Không thể đặt lại mật khẩu", err);
      setResetMessage({
        type: "danger",
        text:
          err.response?.data?.detail ||
          "Không thể đặt lại mật khẩu. Vui lòng kiểm tra thông tin.",
      });
    } finally {
      setIsResetting(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await authService.login({
        username: form.username,
        password: form.password,
      });
      navigate("/");
    } catch (err) {
      console.error("Đăng nhập thất bại", err);
      setError("Thông tin đăng nhập không chính xác hoặc máy chủ gặp sự cố.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const existingToken = localStorage.getItem("accessToken");
  if (existingToken) {
    return <Navigate to="/" replace />;
  }

  return (
    <main
      style={{
        backgroundColor: "gray",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        margin: "0 auto",
      }}
      className="d-flex form-signin w-100 m-auto"
    >
      <form
        className="w-50 m-auto"
        style={{
          padding: "1.5rem",
          maxWidth: "360px",
          backgroundColor: "white",
          borderRadius: "8px",
        }}
        onSubmit={handleSubmit}
      >
        <h1
          style={{ textTransform: "uppercase", fontWeight: "bold" }}
          className="d-flex justify-content-center h3 mb-3 fw-normal"
        >
          Log in
        </h1>
        <div className="form-floating mb-2">
          <input
            type="text"
            className="form-control"
            id="floatingInput"
            name="username"
            placeholder="Tên đăng nhập"
            value={form.username}
            onChange={handleChange}
            required
          />
          <label htmlFor="floatingInput">Tên đăng nhập</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control"
            id="floatingPassword"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <label htmlFor="floatingPassword">Password</label>
        </div>
        {error && (
          <div className="alert alert-danger py-2" role="alert">
            {error}
          </div>
        )}
        <button
          type="button"
          className="btn btn-link p-0"
          onClick={() => {
            setShowResetForm((prev) => !prev);
            setResetMessage({ type: "", text: "" });
          }}
        >
          Quên mật khẩu?
        </button>
        <button
          className="btn btn-primary w-100 py-2"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang đăng nhập..." : "Sign in"}
        </button>
      </form>
      <div className="text-center mt-3">
        {/* <button
          type="button"
          className="btn btn-link p-0"
          onClick={() => {
            setShowResetForm((prev) => !prev);
            setResetMessage({ type: "", text: "" });
          }}
        >
          Quên mật khẩu?
        </button> */}
      </div>
      {showResetForm && (
        <div className="mt-4 border rounded p-3 bg-light">
          <h5 className="mb-3">Đặt lại mật khẩu</h5>
          <Form.Group className="mb-3">
            <Form.Label>Email đã đăng ký</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="name@example.com"
              value={resetForm.email}
              onChange={handleResetChange}
              required
            />
          </Form.Group>
          <div className="d-flex gap-2 mb-3">
            <Button
              variant="secondary"
              type="button"
              onClick={handleSendOtp}
              disabled={isSendingOtp}
            >
              {isSendingOtp ? "Đang gửi..." : "Gửi OTP"}
            </Button>
          </div>
          {otpSent && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Mã OTP</Form.Label>
                <Form.Control
                  type="text"
                  name="otp"
                  value={resetForm.otp}
                  onChange={handleResetChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Mật khẩu mới</Form.Label>
                <Form.Control
                  type="password"
                  name="newPassword"
                  value={resetForm.newPassword}
                  onChange={handleResetChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={resetForm.confirmPassword}
                  onChange={handleResetChange}
                  required
                />
              </Form.Group>
              <Button
                variant="primary"
                type="button"
                onClick={handleResetPassword}
                disabled={isResetting}
              >
                {isResetting ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
              </Button>
            </>
          )}
          {resetMessage.text && (
            <div
              className={`alert mt-3 py-2 alert-${resetMessage.type}`}
              role="alert"
            >
              {resetMessage.text}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
