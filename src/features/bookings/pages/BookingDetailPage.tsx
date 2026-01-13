import { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsApi, paymentApi, courtsApi } from '@/api';
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
      const da_thanh_toan = parseFloat((don as unknown as Record<string, unknown>).da_thanh_toan as string) || 0;
      // Get ma_san_con from first chi_tiet to fetch sub-court info
      const ma_san_con = (chi_tiet[0] as unknown as Record<string, unknown>)?.ma_san_con as number;
      return {
        ...don,
        trang_thai: ((don as unknown as Record<string, unknown>).trang_thai_don || don.trang_thai) as import('@/types').BookingStatus,
        tong_tien: parseFloat(don.tong_tien as unknown as string) || 0,
        da_thanh_toan,
        ngay_dat_san: ngay_dat_san,
        ngay_tao: ngay_tao,
        chi_tiets: chi_tiet,
        ma_san_con,
      };
    },
    enabled: !!id,
  });

  // Fetch sub-court and parent court info
  const { data: courtInfo, isLoading: isCourtLoading } = useQuery({
    queryKey: ['sub-court', booking?.ma_san_con],
    queryFn: () => courtsApi.findSubCourtById(booking!.ma_san_con!),
    enabled: !!booking?.ma_san_con,
  });

  // Fetch time slots to map ma_khung_gio to actual times
  const { data: timeSlots, isLoading: isTimeSlotsLoading } = useQuery({
    queryKey: ['time-slots'],
    queryFn: bookingsApi.getTimeSlots,
  });

  // Create a map for quick time slot lookup
  const timeSlotsMap = useMemo(() => {
    if (!timeSlots) return new Map<number, { gio_bat_dau: string; gio_ket_thuc: string }>();
    return new Map(timeSlots.map(slot => [slot.ma_khung_gio, { gio_bat_dau: slot.gio_bat_dau, gio_ket_thuc: slot.gio_ket_thuc }]));
  }, [timeSlots]);

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

  // Wait for all data to load before showing content
  const isAllLoading = isLoading || isTimeSlotsLoading || (!!booking?.ma_san_con && isCourtLoading);

  if (isAllLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Skeleton className="h-8 w-1/3 mb-8" />
          <Skeleton className="h-64 w-full rounded-xl mb-4" />
          <Skeleton className="h-32 w-full rounded-xl" />
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
                {/* Court name & parent court */}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Sân chơi:</span>
                  <span className="font-semibold text-gray-900">
                    {courtInfo?.subCourt?.ten_san_con || `Sân #${booking.ma_san_con || 'N/A'}`}
                  </span>
                </div>
                {/* Parent court / facility name */}
                {courtInfo?.court && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Cơ sở:</span>
                    <Link 
                      to={`/courts/${courtInfo.court.ma_san}`} 
                      className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                    >
                      {courtInfo.court.ten_san}
                    </Link>
                  </div>
                )}
                {/* Address */}
                {courtInfo?.court?.dia_chi && (
                  <div className="flex justify-between items-start text-sm">
                    <span className="text-gray-500 font-medium">Địa chỉ:</span>
                    <span className="font-medium text-gray-700 text-right max-w-[200px]">{courtInfo.court.dia_chi}</span>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-4"></div>
                {/* Booking date */}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Ngày đặt sân:</span>
                  <span className="font-semibold text-gray-900 capitalize">{formatDate(booking.ngay_dat_san)}</span>
                </div>
                {/* Time slots */}
                <div className="flex justify-between items-start text-sm">
                  <span className="text-gray-500 font-medium mt-1">Khung giờ:</span>
                  <div className="flex flex-wrap gap-1.5 justify-end max-w-[200px]">
                    {booking.chi_tiets?.map((detail: BookingDetail) => {
                      const slotId = (detail as unknown as Record<string, unknown>).ma_khung_gio as number;
                      const timeSlot = timeSlotsMap.get(slotId);
                      return (
                        <span key={detail.ma_chi_tiet} className="bg-gray-50 border border-gray-100 px-2 py-1 text-[10px] font-semibold text-gray-600 rounded-sm">
                          {detail.khung_gio 
                            ? `${formatTime(detail.khung_gio.gio_bat_dau)} — ${formatTime(detail.khung_gio.gio_ket_thuc)}`
                            : timeSlot
                              ? `${formatTime(timeSlot.gio_bat_dau)} — ${formatTime(timeSlot.gio_ket_thuc)}`
                              : `#${slotId || 'N/A'}`
                          }
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-4"></div>
                {/* Payment method */}
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
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center gap-2">
              <div className="w-1 h-3.5 bg-emerald-600 rounded-full"></div>
              <h2 className="text-sm font-bold text-gray-800">Thông tin thanh toán</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Tổng cộng:</span>
                <span className="font-bold text-gray-900">{formatCurrency(booking.tong_tien)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Đã thanh toán:</span>
                <span className="font-bold text-emerald-600">{formatCurrency(booking.da_thanh_toan || 0)}</span>
              </div>
              {(booking.tong_tien - (booking.da_thanh_toan || 0)) > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Còn lại:</span>
                  <span className="font-bold text-amber-600">{formatCurrency(booking.tong_tien - (booking.da_thanh_toan || 0))}</span>
                </div>
              )}
              <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                <span className="text-[10px] text-gray-400">Mã đơn hàng</span>
                <span className="font-mono font-bold text-sm">#{booking.ma_don}</span>
              </div>
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
