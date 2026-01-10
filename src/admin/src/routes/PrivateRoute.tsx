import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { getToken } from "../services/auth";
import { decodeToken } from "../utils/jwt";
import { useAuthStore } from "@/stores/auth.store";
import { ROUTES } from "@/lib/constants";
import './css/soft-ui-dashboard.scss'

export default function PrivateRoute({ children, role }: { children?: React.ReactElement, role: string }) {
  const { isAuthenticated, token } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (!token) return <Navigate to="/login" />;

  const payload = decodeToken(token);
  if (!payload) return <Navigate to="/login" />;

  if (role && payload.loai_tai_khoan !== role) {
    return <Navigate to="/login" />;
  }

  return <>
    <div className="__admin_style">
      <Outlet />
      {children}
    </div>
  </>
}
