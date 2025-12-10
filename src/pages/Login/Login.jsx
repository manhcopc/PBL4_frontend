import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import authService from "../../service/auth";
import { Form, Button } from "react-bootstrap";
import cover from "../../assets/Bút chì gỗ.jpeg";

export default function Login() {
  const navigate = useNavigate();
  const [registered, setRegistered] = useState(false);
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
        backgroundImage: `url(${cover})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="d-flex form-signin w-100 m-auto"
    >
      {!showResetForm && !registered && (
        <form
          className="w-50 m-auto mx-0"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            padding: "1.5rem",
            maxWidth: "360px",
            // backgroundColor: "white",
            borderRadius: "8px",
          }}
          onSubmit={handleSubmit}
        >
          <h1
            style={{
              textTransform: "uppercase",
              fontWeight: "bold",
              color: "#1C59A1",
            }}
            className="d-flex justify-content-center h3 mb-3 fw-normal"
          >
            Đăng nhập
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
            <label htmlFor="floatingPassword">Mật khẩu</label>
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
            style={{ backgroundColor: "#1C59A1", borderColor: "#1C59A1" }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
          <hr />
          <div className="text-center">
            <span className="text-muted small">Chưa có tài khoản? </span>
            <button
              type="button"
              className="btn btn-link p-0 text-decoration-none"
              style={{ fontWeight: "600", color: "#1C59A1" }}
              onClick={() => {
                setRegistered(true);
              }}
            >
              Đăng ký ngay
            </button>
          </div>
        </form>
      )}
      {registered && (
        <form
          className="w-100 m-auto" // Đổi w-50 thành w-100 để responsive tốt hơn trong container nhỏ, max-width sẽ lo phần giới hạn
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)", // Hiệu ứng nền mờ
            padding: "2rem",
            maxWidth: "400px", // Tăng nhẹ độ rộng cho form đăng ký thoáng hơn
            borderRadius: "15px", // Bo tròn nhiều hơn chút cho mềm mại
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)", // Thêm đổ bóng nhẹ
            backdropFilter: "blur(5px)", // Kích hoạt hiệu ứng kính (nếu trình duyệt hỗ trợ)
          }}
          onSubmit={handleSubmit}
        >
          <h1
            style={{
              textTransform: "uppercase",
              fontWeight: "bold",
              color: "#1C59A1", // ĐÃ SỬA: textColor -> color và thêm dấu #
            }}
            className="d-flex justify-content-center h3 mb-4 fw-normal"
          >
            Đăng ký
          </h1>

          {/* 1. Tên đăng nhập */}
          <div className="form-floating mb-2">
            <input
              type="text"
              className="form-control"
              id="regUsername"
              name="username"
              placeholder="Tên đăng nhập"
              value={form.username}
              onChange={handleChange}
              required
            />
            <label htmlFor="regUsername">Tên đăng nhập</label>
          </div>

          {/* 2. Email (Mới thêm) */}
          <div className="form-floating mb-2">
            <input
              type="email"
              className="form-control"
              id="regEmail"
              name="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="regEmail">Địa chỉ Email</label>
          </div>

          {/* 3. Mật khẩu */}
          <div className="form-floating mb-2">
            <input
              type="password"
              className="form-control"
              id="regPassword"
              name="password"
              placeholder="Mật khẩu"
              value={form.password}
              onChange={handleChange}
              required
            />
            <label htmlFor="regPassword">Mật khẩu</label>
          </div>

          {/* 4. Nhập lại mật khẩu (Mới thêm) */}
          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
              id="regConfirmPassword"
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            <label htmlFor="regConfirmPassword">Nhập lại mật khẩu</label>
          </div>
          {/* <br /> */}

          {/* Hiển thị lỗi nếu có */}
          {error && (
            <div className="alert alert-danger py-2 small" role="alert">
              {error}
            </div>
          )}

          {/* Nút Submit */}
          <button
            className="btn btn-primary w-100 py-2 fw-bold"
            type="submit"
            disabled={isSubmitting}
            style={{ backgroundColor: "#1C59A1", borderColor: "#1C59A1" }}
          >
            {isSubmitting ? "Đang xử lý..." : "Đăng ký ngay"}
          </button>

          <hr />
          <div className="text-center mt-3">
            <span className="text-muted small">Bạn đã có tài khoản? </span>
            <Button
              type="button"
              className="btn btn-link p-0 text-decoration-none"
              style={{ fontWeight: "600", color: "#1C59A1" }}
              onClick={() => {
                setRegistered(false);
              }}
            >
              Đăng nhập
            </Button>
          </div>
        </form>
      )}
      {showResetForm && (
        <div
          className="mt-4 border rounded p-3 bg-light"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
        >
          <h5 className="mb-3 text-center">Đặt lại mật khẩu</h5>
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
              variant="secondary mx-auto"
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
          <div className="d-flex align-item-center">
            <Button
              onClick={() => {
                setShowResetForm(false);
              }}
              variant="transparent text-center align-item-center"
              style={{ textColor: "red" }}
            >
              Quay lại
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}
