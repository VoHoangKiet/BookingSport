import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { saveToken } from "../services/auth";
import { decodeToken } from "../utils/jwt";
import { useAuthStore } from "@/stores/auth.store";

export default function AuthSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setToken } = useAuthStore()

  useEffect(() => {
    const token = params.get("token");

    if (!token) {
      console.error("Token không tìm thấy trên URL");
      navigate("/login");
      return;
    }
    try {
      saveToken(token);
      setToken(token)

      const payload = decodeToken(token);

      if (payload?.loai_tai_khoan === "admin") {
        navigate("/admin");
      } else if (payload?.loai_tai_khoan === "chu_san") {
        navigate("/owner");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Lỗi xác thực:", error);
      navigate("/login");
    }
  }, [params, navigate]);

  return <div>Đang đăng nhập...</div>;
}
