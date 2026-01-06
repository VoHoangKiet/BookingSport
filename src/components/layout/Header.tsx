import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { Button } from '@/components/ui';
import { ROUTES } from '@/lib/constants';
import { Home, Search, Calendar, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useMemo } from 'react';
import { decodeToken } from '@/admin/src/utils/jwt';

export function Header() {
  const { isAuthenticated, user, logout, accessToken } = useAuthStore();
  const navigate = useNavigate();

  // const loaiTaiKhoan = user?.loai_tai_khoan;
  const loaiTaiKhoan: string | undefined = useMemo(() => {
    try {
      return decodeToken(typeof accessToken === "string" ? accessToken : "")?.loai_tai_khoan
    } catch (error) {
      console.log(error)
    }
  }, [accessToken])


  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">BookingSport</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to={ROUTES.HOME}
              className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors font-medium"
            >
              <Home className="w-4 h-4" />
              Trang chủ
            </Link>
            <Link
              to={ROUTES.COURTS}
              className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors font-medium"
            >
              <Search className="w-4 h-4" />
              Tìm sân
            </Link>
            {isAuthenticated && (
              <Link
                to={ROUTES.BOOKINGS}
                className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors font-medium"
              >
                <Calendar className="w-4 h-4" />
                Lịch đặt
              </Link>
            )}
            {isAuthenticated && loaiTaiKhoan &&
              (loaiTaiKhoan === "admin" || loaiTaiKhoan === "chu_san") && (
                <Link
                  to={loaiTaiKhoan === "admin" ? "/admin" : "/owner"}
                  className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors font-medium"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Quản lý
                </Link>
              )}

          </nav>

          {/* Auth buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to={ROUTES.PROFILE} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    {user?.anh_dai_dien ? (
                      <img src={user.anh_dai_dien} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {user?.ho_ten || user?.email}
                  </span>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-1" />
                  Đăng xuất
                </Button>
              </>
            ) : (
              <>
                <Link to={ROUTES.LOGIN}>
                  <Button variant="ghost" size="sm">
                    Đăng nhập
                  </Button>
                </Link>
                <Link to={ROUTES.REGISTER}>
                  <Button size="sm">
                    Đăng ký
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
