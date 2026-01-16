import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { courtsApi } from '@/api';
import { Button, Badge, Skeleton } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth.store';
import type { SubCourt } from '@/types';
import { MapPin, Dribbble, Frown, ChevronRight, CreditCard } from 'lucide-react';

// Map by sport ID (ma_bo_mon)
const SPORT_DESCRIPTIONS_BY_ID: Record<number, string> = {
  1: 'Sân cỏ nhân tạo chất lượng cao, kích thước phổ biến 20x40m sân 5 người, thoát nước tốt, đèn LED sáng đầy đủ. Giờ mở thường 6h-22h. Tiện ích: đỗ xe rộng, nước uống, nhà vệ sinh.',
  2: 'Sân chuẩn FIBA 28x15m, mặt sàn bê tông/nhựa hoặc gỗ trong nhà, rổ và vạch rõ nét. Giờ mở thường 6h-22h. Tiện ích: thoáng mát, đông cộng đồng.',
  3: 'Sân trong nhà, sàn thảm/gỗ chuẩn thi đấu, 4-6 sân/club, chiếu sáng tốt, lưới chắc chắn. Giờ mở thường 6h-22h. Tiện ích: cộng đồng đông, giá rẻ, dễ chơi.',
  4: 'Sân cứng hoặc đất nện chuẩn ITF (23.77x8.23m đơn, 23.77x10.97m đôi), đèn LED, mái che một phần. Giờ mở thường 6h-22h. Tiện ích: chất lượng cao, view đẹp, đa năng với pickleball.',
  5: '6-10 bàn/club chuẩn thi đấu ITTF, sàn gỗ/thảm, vợt/bóng sẵn có. Giờ mở chủ yếu sáng-tối 6h-22h. Tiện ích: cộng đồng cao thủ mạnh, giá rẻ, phù hợp luyện tập lâu dài.',
  6: 'Sân cứng chuẩn 13.4x6.1m (mỗi bên lưới), mái che tốt, vợt/bóng cho thuê. Giờ mở thường 6h-22h. Tiện ích: hiện đại, đông người chơi mọi lứa tuổi, kết hợp tennis, cộng đồng thân thiện.',
  7: 'Sân chuẩn 18x9m, trong nhà hoặc ngoài trời đa năng, sàn gỗ/bê tông, lưới chắc chắn. Giờ mở thường 6h-22h. Tiện ích: phù hợp đội nhóm, khán đài nhỏ, kết hợp các môn khác.',
};

// Map by sport name (ten_bo_mon) - fallback
const SPORT_DESCRIPTIONS_BY_NAME: Record<string, string> = {
  'Đá bóng': SPORT_DESCRIPTIONS_BY_ID[1],
  'Bóng rổ': SPORT_DESCRIPTIONS_BY_ID[2],
  'Cầu lông': SPORT_DESCRIPTIONS_BY_ID[3],
  'Tennis': SPORT_DESCRIPTIONS_BY_ID[4],
  'Bóng bàn': SPORT_DESCRIPTIONS_BY_ID[5],
  'Pickleball': SPORT_DESCRIPTIONS_BY_ID[6],
  'Bóng chuyền': SPORT_DESCRIPTIONS_BY_ID[7],
};

export default function CourtDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { data: court, isLoading } = useQuery({
    queryKey: ['court', id],
    queryFn: async () => {
      const data = await courtsApi.getById(Number(id));
      // console.log('🏟️ Court data:', {
      //   ten_san: data.ten_san,
      //   ma_bo_mon: data.ma_bo_mon,
      //   bo_mon: data.bo_mon,
      //   mo_ta: data.mo_ta,
      // });
      return data;
    },
    enabled: !!id,
  });

  const { data: images } = useQuery({
    queryKey: ['court', id, 'images'],
    queryFn: () => courtsApi.getImages(Number(id)),
    enabled: !!id,
  });

  const handleBooking = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/courts/${id}/booking` } } });
    } else {
      navigate(`/courts/${id}/booking`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-96 w-full rounded-xl mb-8" />
          <Skeleton className="h-8 w-1/3 mb-4" />
          <Skeleton className="h-4 w-2/3 mb-8" />
        </div>
      </div>
    );
  }

  if (!court) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Frown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy sân</h2>
          <Link to="/courts">
            <Button>Quay lại danh sách</Button>
          </Link>
        </div>
      </div>
      
    );
    
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-xs font-semibold flex items-center gap-2">
          <Link to="/courts" className="text-emerald-600 hover:text-emerald-700">Tìm sân</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-500 font-medium">{court.ten_san}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Images */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
              <div className="relative h-80 md:h-[450px] bg-gray-50">
                {images && images.length > 0 ? (
                  <img
                    key={activeImageIndex}
                    src={images[activeImageIndex]}
                    alt={court.ten_san}
                    className="w-full h-full object-cover animate-fade-in"
                  />
                ) : court.anh_san ? (
                  <img
                    src={court.anh_san}
                    alt={court.ten_san}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <Dribbble className="w-16 h-16 text-gray-200" />
                  </div>
                )}
              </div>

              {images && images.length > 1 && (
                <div className="p-4 flex gap-3 overflow-x-auto scrollbar-hide bg-gray-50/50">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative flex-shrink-0 w-20 h-20 rounded border-2 transition-all duration-200 group ${
                        activeImageIndex === idx
                          ? 'border-emerald-500 ring-2 ring-emerald-500/20 scale-95'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${court.ten_san} ${idx + 1}`}
                        className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 ${
                          activeImageIndex === idx ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
               <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center gap-2">
                <div className="w-1 h-3.5 bg-emerald-600 rounded-full"></div>
                <h2 className="text-sm font-bold text-gray-800">Mô tả chi tiết</h2>
              </div>
              <div className="p-6">
                <p className="text-base text-gray-600 leading-relaxed font-normal">
                  {court.mo_ta?.trim()
                    ? court.mo_ta.trim()
                    : court.ma_bo_mon 
                      ? SPORT_DESCRIPTIONS_BY_ID[court.ma_bo_mon] || 'Chưa có thông tin mô tả cụ thể cho sân này.'
                      : court.bo_mon?.ten_bo_mon
                        ? SPORT_DESCRIPTIONS_BY_NAME[court.bo_mon.ten_bo_mon.trim()] || 'Chưa có thông tin mô tả cụ thể cho sân này.'
                        : 'Chưa có thông tin mô tả cụ thể cho sân này. Sân đạt tiêu chuẩn chất lượng tốt, phù hợp cho các buổi tập và thi đấu.'}
                </p>
              </div>
            </div>

            {/* Sub courts */}
            {court.san_cons && court.san_cons.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center gap-2">
                  <div className="w-1 h-3.5 bg-emerald-600 rounded-full"></div>
                  <h2 className="text-sm font-bold text-gray-800">Thông tin khu vực sân ({court.san_cons.length})</h2>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {court.san_cons?.map((sub: SubCourt) => (
                    <div
                      key={sub.ma_san_con}
                      className="flex flex-col p-5 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl hover:border-emerald-400 hover:shadow-lg transition-all group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-gray-900 text-base group-hover:text-emerald-600 transition-colors">{sub.ten_san_con}</h3>
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                          <Dribbble className="w-4 h-4 text-emerald-600 group-hover:text-white transition-colors" />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 font-medium mb-4">{sub.mo_ta || 'Sân tiêu chuẩn'}</p>
                      <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <CreditCard className="w-3.5 h-3.5" />
                          <span className="text-xs font-medium">Giá thuê</span>
                        </div>
                        <span className="text-xl font-bold text-emerald-600">
                          {formatCurrency(sub.gia_co_ban)}<span className="text-xs font-normal text-gray-400">/h</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden sticky top-24">
              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{court.ten_san}</h1>
                
                {court.bo_mon && (
                  <Badge className="bg-emerald-600 text-white border-emerald-600 text-xs font-semibold mb-6 rounded">
                    {court.bo_mon.ten_bo_mon}
                  </Badge>
                )}

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-600" />
                    <span className="text-sm text-gray-600 leading-snug">{court.dia_chi}</span>
                  </div>
                  {/* <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm text-gray-800 font-semibold">
                      Mở cửa: {court.gio_mo_cua?.slice(0, 5)} — {court.gio_dong_cua?.slice(0, 5)}
                    </span>
                  </div> */}
                  {court.san_cons && court.san_cons.length > 0 && (
                    <div className="flex items-center gap-3">
                      <Dribbble className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm text-gray-600">{court.san_cons.length} khu vực thi đấu</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-6 mb-6">
                  <span className="text-xs font-semibold text-gray-500 block mb-1">Giá thuê từ</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-emerald-600">
                      {formatCurrency(
                        court.san_cons?.reduce((min: number, sub: SubCourt) => Math.min(min, sub.gia_co_ban), Infinity) || 0
                      )}
                    </span>
                    <span className="text-sm font-medium text-gray-500">/giờ</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <button 
                  className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-sm transition-all shadow-sm"
                  onClick={handleBooking}
                >
                  Đặt sân ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
