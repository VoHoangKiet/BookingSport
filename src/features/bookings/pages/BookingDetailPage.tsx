import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsApi, paymentApi } from '@/api';
import { Button, Card, CardBody, Badge, Skeleton } from '@/components/ui';
import { formatCurrency, formatDate, formatTime, getBookingStatusColor, getBookingStatusLabel } from '@/lib/utils';
import { Frown, ChevronLeft } from 'lucide-react';

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingsApi.getById(Number(id)),
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
        <div className="mb-8">
          <Link to="/bookings" className="text-emerald-600 hover:text-emerald-700 text-sm mb-2 flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
            Quay lại lịch sử
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">Đơn đặt #{booking.ma_don}</h1>
            <Badge className={getBookingStatusColor(booking.trang_thai)}>
              {getBookingStatusLabel(booking.trang_thai)}
            </Badge>
          </div>
        </div>

        <div className="space-y-6">
          {/* Booking info */}
          <Card>
            <CardBody>
              <h2 className="font-semibold text-lg mb-4">Thông tin đặt sân</h2>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Sân:</span>
                  <span className="font-medium">{booking.san_con?.ten_san_con}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Ngày đặt:</span>
                  <span className="font-medium">{formatDate(booking.ngay_dat_san)}</span>
                </div>
                {booking.chi_tiets && booking.chi_tiets.length > 0 && (
                  <div className="py-2 border-b">
                    <span className="text-gray-500 block mb-2">Khung giờ:</span>
                    <div className="flex flex-wrap gap-2">
                      {booking.chi_tiets.map((detail) => (
                        <Badge key={detail.ma_chi_tiet} variant="info">
                          {formatTime(detail.khung_gio.gio_bat_dau)} - {formatTime(detail.khung_gio.gio_ket_thuc)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Phương thức thanh toán:</span>
                  <span className="font-medium">
                    {booking.hinh_thuc_thanh_toan === 'chuyen_khoan' ? 'Chuyển khoản (VNPay)' : 'Tiền mặt'}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Ngày tạo đơn:</span>
                  <span className="font-medium">{formatDate(booking.ngay_tao)}</span>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Payment info */}
          <Card>
            <CardBody>
              <h2 className="font-semibold text-lg mb-4">Thanh toán</h2>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 text-lg">Tổng tiền:</span>
                <span className="text-3xl font-bold text-emerald-600">
                  {formatCurrency(booking.tong_tien)}
                </span>
              </div>
            </CardBody>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            {canPay && (
              <Button
                className="flex-1"
                onClick={() => payMutation.mutate()}
                isLoading={payMutation.isPending}
              >
                Thanh toán ngay
              </Button>
            )}
            {canCancel && (
              <Button
                variant="danger"
                className="flex-1"
                onClick={() => {
                  if (confirm('Bạn có chắc muốn hủy đơn đặt này?')) {
                    cancelMutation.mutate();
                  }
                }}
                isLoading={cancelMutation.isPending}
              >
                Hủy đơn
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => navigate('/bookings')}
            >
              Quay lại
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
