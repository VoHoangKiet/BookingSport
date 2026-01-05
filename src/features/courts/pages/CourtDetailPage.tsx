import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { courtsApi } from '@/api';
import { Button, Badge, Skeleton } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth.store';
import { MapPin, Clock, Dribbble, Frown, ChevronRight } from 'lucide-react';

export default function CourtDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const { data: court, isLoading } = useQuery({
    queryKey: ['court', id],
    queryFn: () => courtsApi.getById(Number(id)),
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
        <nav className="mb-6 text-sm flex items-center gap-2">
          <Link to="/courts" className="text-emerald-600 hover:text-emerald-700">Tìm sân</Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">{court.ten_san}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Images */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
              <div className="relative h-80 md:h-96 bg-gray-200">
                {court.hinh_anh || (images && images.length > 0) ? (
                  <img
                    src={images?.[0] || court.hinh_anh}
                    alt={court.ten_san}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-100 to-teal-100">
                    <Dribbble className="w-24 h-24 text-emerald-300" />
                  </div>
                )}
              </div>

              {images && images.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto">
                  {images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${court.ten_san} ${idx + 1}`}
                      className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Mô tả</h2>
              <p className="text-gray-600">{court.mo_ta || 'Chưa có mô tả'}</p>
            </div>

            {/* Sub courts */}
            {court.san_cons && court.san_cons.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold mb-4">Danh sách sân con</h2>
                <div className="space-y-3">
                  {court.san_cons.map((sub) => (
                    <div
                      key={sub.ma_san_con}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium text-gray-900">{sub.ten_san_con}</h3>
                        {sub.mo_ta && <p className="text-sm text-gray-500">{sub.mo_ta}</p>}
                      </div>
                      <span className="font-semibold text-emerald-600">
                        {formatCurrency(sub.gia_co_ban)}/giờ
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{court.ten_san}</h1>
              
              {court.bo_mon && (
                <Badge variant="success" className="mb-4">{court.bo_mon.ten_bo_mon}</Badge>
              )}

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-2 text-gray-600">
                  <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-500" />
                  <span>{court.dia_chi}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5 text-emerald-500" />
                  <span>{court.gio_mo_cua?.slice(0, 5)} - {court.gio_dong_cua?.slice(0, 5)}</span>
                </div>
                {court.san_cons && court.san_cons.length > 0 && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Dribbble className="w-5 h-5 text-emerald-500" />
                    <span>{court.san_cons.length} sân con</span>
                  </div>
                )}
              </div>

              <div className="border-t pt-4 mb-6">
                <span className="text-sm text-gray-500">Giá từ</span>
                <p className="text-3xl font-bold text-emerald-600">
                  {formatCurrency(
                    court.san_cons?.reduce((min, sub) => Math.min(min, sub.gia_co_ban), Infinity) || 0
                  )}
                  <span className="text-base font-normal text-gray-500">/giờ</span>
                </p>
              </div>

              <Button className="w-full" size="lg" onClick={handleBooking}>
                Đặt sân ngay
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
