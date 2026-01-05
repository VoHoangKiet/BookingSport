import { Link } from 'react-router-dom';
import { Button, CardSkeleton } from '@/components/ui';
import { ROUTES } from '@/lib/constants';
import { useQuery } from '@tanstack/react-query';
import { courtsApi, sportsApi } from '@/api';
import { CourtCard } from '@/features/courts/components/CourtCard';
import { 
  Search, 
  UserPlus, 
  ArrowRight,
  CreditCard,
  Smartphone,
  Dribbble,
  Trophy,
  Target,
  Volleyball
} from 'lucide-react';

// Sport icon mapping
const sportIcons: Record<string, React.ReactNode> = {
  default: <Dribbble className="w-8 h-8" />,
  'Bóng đá': <Dribbble className="w-8 h-8" />,
  'Bóng rổ': <Trophy className="w-8 h-8" />,
  'Tennis': <Target className="w-8 h-8" />,
  'Cầu lông': <Volleyball className="w-8 h-8" />,
  'Bóng chuyền': <Volleyball className="w-8 h-8" />,
};

export default function HomePage() {
  const { data: courts, isLoading: courtsLoading } = useQuery({
    queryKey: ['courts'],
    queryFn: courtsApi.getAll,
  });

  const { data: sports } = useQuery({
    queryKey: ['sports'],
    queryFn: sportsApi.getAll,
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-400 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Đặt sân thể thao
              <br />
              <span className="text-emerald-200">Nhanh chóng & Dễ dàng</span>
            </h1>
            <p className="text-lg md:text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
              Tìm và đặt sân thể thao yêu thích của bạn chỉ trong vài bước đơn giản. 
              Thanh toán trực tuyến an toàn với VNPay.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={ROUTES.COURTS}>
                <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50">
                  <Search className="w-5 h-5 mr-2" />
                  Tìm sân ngay
                </Button>
              </Link>
              <Link to={ROUTES.REGISTER}>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <UserPlus className="w-5 h-5 mr-2" />
                  Đăng ký miễn phí
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </section>

      {/* Sports Categories */}
      {sports && sports.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              Bộ môn thể thao
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {sports.map((sport) => (
                <Link
                  key={sport.ma_bo_mon}
                  to={`${ROUTES.COURTS}?ma_bo_mon=${sport.ma_bo_mon}`}
                  className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-3 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                    {sportIcons[sport.ten_bo_mon] || sportIcons.default}
                  </div>
                  <span className="font-medium text-gray-700 text-center">{sport.ten_bo_mon}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Courts */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Sân nổi bật
            </h2>
            <Link to={ROUTES.COURTS}>
              <Button variant="ghost">
                Xem tất cả
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {courtsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : courts && courts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courts.slice(0, 6).map((court) => (
                <CourtCard key={court.ma_san} court={court} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-100 rounded-xl">
              <p className="text-gray-500">Chưa có sân nào</p>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-12 text-center">
            Tại sao chọn BookingSport?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Tìm kiếm dễ dàng</h3>
              <p className="text-gray-600">Tìm sân theo bộ môn, địa điểm và khung giờ phù hợp với bạn</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Thanh toán an toàn</h3>
              <p className="text-gray-600">Tích hợp VNPay - Cổng thanh toán trực tuyến uy tín hàng đầu</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quản lý tiện lợi</h3>
              <p className="text-gray-600">Theo dõi lịch đặt, hủy lịch và xem lịch sử đặt sân dễ dàng</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
