import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsApi, paymentApi } from '@/api';
import { Button, Card, CardBody, Badge, Skeleton } from '@/components/ui';
import { formatCurrency, formatDate, formatTime, getBookingStatusColor, getBookingStatusLabel } from '@/lib/utils';
import { Frown, ChevronLeft } from 'lucide-react';
import type { Booking, BookingDetail } from '@/types';

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', id],
    queryFn: async () => {
      const data = await bookingsApi.getById(Number(id));
      const response = data as unknown as Record<string, unknown>;
      const don = (response.don || response) as Booking;
      const chi_tiet = (response.chi_tiet || don.chi_tiets || []) as BookingDetail[];
      // Get ngay_dat_san from the first chi_tiet if not directly on don
      const ngay_dat_san = don.ngay_dat_san || (chi_tiet[0] as unknown as Record<string, unknown>)?.ngay_dat_san as string;
      const ngay_tao = don.ngay_tao || (don as unknown as Record<string, unknown>).thoi_diem_tao as string;
      return {
        ...don,
        trang_thai: ((don as unknown as Record<string, unknown>).trang_thai_don || don.trang_thai) as import('@/types').BookingStatus,
        tong_tien: parseFloat(don.tong_tien as unknown as string) || 0,
        ngay_dat_san: ngay_dat_san,
        ngay_tao: ngay_tao,
        chi_tiets: chi_tiet,
      };
    },
    enabled: !!id,
  });

  const cancelMutation = useMutation({
    mutationFn: () => bookingsApi.cancel(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', id] });
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
    },
  });

  const payMutation = useMutation({
    mutationFn: () => paymentApi.createVnpayPayment({
      ma_don: Number(id),
      loai_giao_dich: 'thanh_toan',
    }),
    onSuccess: ({ paymentUrl }) => {
      window.location.href = paymentUrl;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Skeleton className="h-8 w-1/3 mb-8" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Frown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy đơn đặt</h2>
          <Link to="/bookings">
            <Button>Quay lại lịch sử</Button>
          </Link>
        </div>
      </div>
    );
  }

  const canCancel = booking.trang_thai === 'tam_giu' || booking.trang_thai === 'da_dat_coc';
  const canPay = booking.trang_thai === 'tam_giu';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 border-b border-gray-100 pb-5">
          <Link to="/bookings" className="text-emerald-600 hover:text-emerald-700 text-xs font-semibold mb-4 flex items-center gap-1">
            <ChevronLeft className="w-3.5 h-3.5" />
            Quay lại lịch sử
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">Chi tiết đơn hàng #{booking.ma_don}</h1>
            <Badge className={`text-[10px] font-bold px-2 py-0.5 rounded ${getBookingStatusColor(booking.trang_thai)}`}>
              {getBookingStatusLabel(booking.trang_thai)}
            </Badge>
          </div>
        </div>

        <div className="space-y-6">
          {/* Booking info */}
          <Card className="border border-gray-200 rounded-lg overflow-hidden shadow-none">
            <CardBody className="p-0">
              <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center gap-2">
                <div className="w-1 h-3.5 bg-emerald-600 rounded-full"></div>
                <h2 className="text-sm font-bold text-gray-800">Thông tin dịch vụ</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Sân cầu lông:</span>
                  <span className="font-semibold text-gray-900">{booking.san_con?.ten_san_con}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Ngày đặt sân:</span>
                  <span className="font-semibold text-gray-900 capitalize">{formatDate(booking.ngay_dat_san)}</span>
                </div>
                <div className="flex justify-between items-start text-sm">
                  <span className="text-gray-500 font-medium mt-1">Khung giờ:</span>
                  <div className="flex flex-wrap gap-1.5 justify-end max-w-[200px]">
                    {booking.chi_tiets?.map((detail: BookingDetail) => (
                      <span key={detail.ma_chi_tiet} className="bg-gray-50 border border-gray-100 px-2 py-1 text-[10px] font-semibold text-gray-600 rounded-sm">
                        {detail.khung_gio 
                          ? `${formatTime(detail.khung_gio.gio_bat_dau)} — ${formatTime(detail.khung_gio.gio_ket_thuc)}`
                          : `#${(detail as unknown as Record<string, unknown>).ma_khung_gio || 'N/A'}`
                        }
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Hình thức thanh toán:</span>
                  <span className="font-semibold text-gray-900">
                    {booking.hinh_thuc_thanh_toan === 'chuyen_khoan' ? 'VNPay Online' : 'Tiền mặt tại quầy'}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Payment info */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 flex justify-between items-center">
            <div>
              <span className="text-xs font-semibold text-gray-500 block mb-1">Tổng cộng đơn hàng</span>
              <span className="text-3xl font-bold text-emerald-600 tracking-tight">
                {formatCurrency(booking.tong_tien)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-gray-400 block">Mã đơn hàng</span>
              <span className="font-mono font-bold text-xs">#{booking.ma_don}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            {canPay && (
              <Button
                className="flex-1 py-4 rounded-lg font-bold text-sm shadow-sm"
                onClick={() => payMutation.mutate()}
                isLoading={payMutation.isPending}
              >
                Thanh toán ngay
              </Button>
            )}
            {canCancel && (
              <Button
                variant="danger"
                className="flex-1 py-4 rounded-lg font-bold text-sm shadow-sm"
                onClick={() => {
                  if (confirm('Bạn có chắc muốn hủy đơn đặt này?')) {
                    cancelMutation.mutate();
                  }
                }}
                isLoading={cancelMutation.isPending}
              >
                Hủy đơn đặt
              </Button>
            )}
            {!canPay && !canCancel && (
              <button
                className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-sm transition-all shadow-sm"
                onClick={() => navigate('/bookings')}
              >
                Quay lại danh sách
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
