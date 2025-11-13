import axios from "axios";

const API_URL = "/api";

export async function fetchTokens() {
  try {
    const res = await axios.post(`${API_URL}/token/`, {
      username: "ducmanh",  
      password: "123456",  
    });

    const { access, refresh } = res.data;

    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);

    console.log("Đăng nhập thành công");
    return { access, refresh };
  } catch (err) {
    console.error("Không thể lấy token tự động", err);
    throw err;
  }
}
