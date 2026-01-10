import { Link } from 'react-router-dom';
import { CardSkeleton } from '@/components/ui';
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
  Volleyball
} from 'lucide-react';
import heroBg from '@/assets/hero-bg.png';
import badmintonIcon from '@/assets/badminton-icon.png';
import footballIcon from '@/assets/football-icon.png';
import tableTennisIcon from '@/assets/tabletennis-icon.png';
import tennisIcon from '@/assets/tennis-icon.png';

// Sport icon mapping
const sportIcons: Record<string, React.ReactNode> = {
  default: <Dribbble className="w-8 h-8" />,
  'Bóng đá': <img src={footballIcon} alt="Bóng đá" className="w-10 h-10 object-contain" />,
  'Tennis': <img src={tennisIcon} alt="Tennis" className="w-10 h-10 object-contain" />,
  'Cầu lông': <img src={badmintonIcon} alt="Cầu lông" className="w-10 h-10 object-contain" />,
  'Bóng bàn': <img src={tableTennisIcon} alt="Bóng bàn" className="w-10 h-10 object-contain" />,
  'Bóng rổ': <Trophy className="w-8 h-8" />,
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
      <section className="relative h-[600px] lg:h-[700px] flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBg} 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-8 backdrop-blur-md">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-semibold text-emerald-400">Ứng dụng đặt sân thể thao hàng đầu</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-8 leading-[1.1]">
              Trải nghiệm đặt sân <br />
              <span className="text-emerald-500 font-extrabold">Chuyên nghiệp & Nhanh chóng</span>
            </h1>
            <p className="text-base md:text-lg text-gray-300 mb-10 leading-relaxed font-medium">
              Tìm kiếm, so sánh và đặt sân chơi yêu thích chỉ trong 30 giây. <br className="hidden md:block" />
              Đảm bảo giữ chỗ, thanh toán linh hoạt và tiện lợi hàng đầu.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={ROUTES.COURTS}>
                <button className="h-14 px-8 bg-emerald-600 text-white rounded-lg font-bold text-sm transition-all hover:bg-emerald-700 hover:scale-[1.02] shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-3">
                  <Search className="w-4 h-4" />
                  Tìm sân ngay
                </button>
              </Link>
              <Link to={ROUTES.REGISTER}>
                <button className="h-14 px-8 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-lg font-bold text-sm transition-all hover:bg-white/20 flex items-center justify-center gap-3">
                  <UserPlus className="w-4 h-4" />
                  Đăng ký miễn phí
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sports Categories */}
      {sports && sports.length > 0 && (
        <section className="py-20 bg-gray-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
               <h2 className="text-3xl font-bold text-gray-900">Khám phá theo bộ môn</h2>
               <p className="text-sm text-gray-500 mt-1">Tìm sân chơi phù hợp với niềm đam mê của bạn</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {sports.map((sport) => (
                <Link
                  key={sport.ma_bo_mon}
                  to={`${ROUTES.COURTS}?ma_bo_mon=${sport.ma_bo_mon}`}
                  className="flex flex-col items-center p-8 bg-white border border-gray-200 rounded-lg hover:border-emerald-500 hover:shadow-xl transition-all group"
                >
                  <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mb-4 text-emerald-600 transition-all">
                    {sportIcons[sport.ten_bo_mon] || sportIcons.default}
                  </div>
                  <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">{sport.ten_bo_mon}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Courts */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Sân chơi nổi bật</h2>
              <p className="text-sm text-gray-500 mt-1">Những địa điểm được cộng đồng đánh giá cao nhất</p>
            </div>
            <Link to={ROUTES.COURTS}>
              <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-2 border-b-2 border-emerald-100 hover:border-emerald-600 transition-all pb-1">
                Xem tất cả cơ sở sân
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
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
            Giải pháp đặt sân toàn diện
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Tìm kiếm thông minh</h3>
              <p className="text-gray-600">Hệ thống lọc theo khu vực, khung giờ và giá cả giúp bạn tìm sân ưng ý nhất.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Thanh toán linh hoạt</h3>
              <p className="text-gray-600">Hỗ trợ thanh toán qua VNPay, chuyển khoản hoặc tiền mặt trực tiếp tại sân.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Xác nhận tức thì</h3>
              <p className="text-gray-600">Thông tin đặt sân được cập nhật thời gian thực, đảm bảo không bị trùng lịch.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
