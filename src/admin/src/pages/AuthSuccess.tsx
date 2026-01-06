import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { saveToken } from "../services/auth";
import { decodeToken } from "../utils/jwt";

export default function AuthSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");

    try {
      saveToken(token);
      
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
  }, [ params, navigate ]);

  return <div>Đang đăng nhập...</div>;
}
