import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { courtsApi, bookingsApi, paymentApi } from '@/api';
import { Button, Card, CardBody, Skeleton, Badge } from '@/components/ui';
import { formatCurrency, formatTime } from '@/lib/utils';
import type { TimeSlot, PaymentMethod, SubCourt } from '@/types';
import { Frown, ChevronLeft } from 'lucide-react';

export default function BookingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedSubCourt, setSelectedSubCourt] = useState<number | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<number[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('chuyen_khoan');

  const { data: court, isLoading: courtLoading } = useQuery({
    queryKey: ['court', id],
    queryFn: () => courtsApi.getById(Number(id)),
    enabled: !!id,
  });

  const { data: availableSubCourts, isLoading: slotsLoading } = useQuery({
    queryKey: ['available-slots', id, selectedDate],
    queryFn: () => bookingsApi.getAvailableSlots(Number(id), selectedDate),
    enabled: !!id && !!selectedDate,
  });

  // Get the selected sub-court with its available slots
  const currentSubCourt = availableSubCourts?.find((s) => s.ma_san_con === selectedSubCourt);
  const currentSlots = currentSubCourt?.available_slots || [];

  const createBookingMutation = useMutation({
    mutationFn: bookingsApi.create,
    onSuccess: async (booking) => {
      if (paymentMethod === 'chuyen_khoan') {
        // Create VNPay payment
        const { paymentUrl } = await paymentApi.createVnpayPayment({
          ma_don: booking.ma_don,
          loai_giao_dich: 'thanh_toan',
        });
        window.location.href = paymentUrl;
      } else {
        navigate(`/bookings/${booking.ma_don}`);
      }
    },
  });

  const handleSlotToggle = (slotId: number) => {
    setSelectedSlots((prev) =>
      prev.includes(slotId)
        ? prev.filter((id) => id !== slotId)
        : [...prev, slotId].sort((a, b) => a - b)
    );
  };

  const calculateTotal = () => {
    if (!currentSubCourt || !currentSlots.length) return 0;

    return selectedSlots.reduce((total, slotId) => {
      const slot = currentSlots.find((s) => s.ma_khung_gio === slotId);
      return total + currentSubCourt.gia_co_ban + (slot?.phu_phi || 0);
    }, 0);
  };

  const handleSubmit = () => {
    if (!selectedSubCourt || selectedSlots.length === 0) return;
    
    createBookingMutation.mutate({
      ma_san_con: selectedSubCourt,
      ngay_dat_san: selectedDate,
      khung_gios: selectedSlots,
      hinh_thuc_thanh_toan: paymentMethod,
    });
  };

  if (courtLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Skeleton className="h-8 w-1/3 mb-8" />
          <Skeleton className="h-96 w-full rounded-xl" />
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to={`/courts/${id}`} className="text-emerald-600 hover:text-emerald-700 text-sm mb-2 flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
            Quay lại {court.ten_san}
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Đặt sân</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Date picker */}
            <Card>
              <CardBody>
                <h2 className="font-semibold text-lg mb-4">Chọn ngày</h2>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedSlots([]);
                  }}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </CardBody>
            </Card>

            {/* Sub-court selector */}
            <Card>
              <CardBody>
                <h2 className="font-semibold text-lg mb-4">Chọn sân con</h2>
                {slotsLoading ? (
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2].map((i) => (
                      <Skeleton key={i} className="h-20 rounded-lg" />
                    ))}
                  </div>
                ) : availableSubCourts && availableSubCourts.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {availableSubCourts.map((sub: SubCourt) => (
                      <button
                        key={sub.ma_san_con}
                        onClick={() => {
                          setSelectedSubCourt(sub.ma_san_con);
                          setSelectedSlots([]);
                        }}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          selectedSubCourt === sub.ma_san_con
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="font-medium block">{sub.ten_san_con}</span>
                        <span className="text-sm text-emerald-600">{formatCurrency(sub.gia_co_ban)}/giờ</span>
                        <span className="text-xs text-gray-500 block mt-1">
                          {sub.available_slots?.length || 0} khung giờ trống
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Không có sân con nào</p>
                )}
              </CardBody>
            </Card>

            {/* Time slots */}
            <Card>
              <CardBody>
                <h2 className="font-semibold text-lg mb-4">Chọn khung giờ</h2>
                {!selectedSubCourt ? (
                  <p className="text-gray-500 text-center py-4">Vui lòng chọn sân con trước</p>
                ) : currentSlots.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {currentSlots.map((slot: TimeSlot) => (
                      <button
                        key={slot.ma_khung_gio}
                        onClick={() => handleSlotToggle(slot.ma_khung_gio)}
                        disabled={slot.da_dat}
                        className={`p-3 rounded-lg border-2 text-sm transition-all min-h-[70px] flex flex-col justify-center items-center ${
                          slot.da_dat
                            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                            : selectedSlots.includes(slot.ma_khung_gio)
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : 'border-gray-200 hover:border-emerald-300'
                        }`}
                      >
                        <span className="font-medium whitespace-nowrap">
                          {formatTime(slot.gio_bat_dau)} - {formatTime(slot.gio_ket_thuc)}
                        </span>
                        <span className={`text-xs mt-0.5 ${slot.phu_phi > 0 && !slot.da_dat ? 'opacity-75' : 'invisible'}`}>
                          +{formatCurrency(slot.phu_phi || 0)}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Không có khung giờ trống</p>
                )}
              </CardBody>
            </Card>

            {/* Payment method */}
            <Card>
              <CardBody>
                <h2 className="font-semibold text-lg mb-4">Phương thức thanh toán</h2>
                <div className="space-y-3">
                  <label className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    paymentMethod === 'chuyen_khoan' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="chuyen_khoan"
                      checked={paymentMethod === 'chuyen_khoan'}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="text-emerald-600"
                    />
                    <div>
                      <span className="font-medium block">Thanh toán online (VNPay)</span>
                      <span className="text-sm text-gray-500">Thanh toán ngay qua cổng VNPay</span>
                    </div>
                  </label>
                  <label className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    paymentMethod === 'tien_mat' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="tien_mat"
                      checked={paymentMethod === 'tien_mat'}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="text-emerald-600"
                    />
                    <div>
                      <span className="font-medium block">Tiền mặt</span>
                      <span className="text-sm text-gray-500">Thanh toán khi đến sân</span>
                    </div>
                  </label>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Summary sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardBody>
                <h2 className="font-semibold text-lg mb-4">Tóm tắt đơn đặt</h2>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Sân:</span>
                    <span className="font-medium">{court.ten_san}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Ngày:</span>
                    <span className="font-medium">{new Date(selectedDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                  {selectedSubCourt && currentSubCourt && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Sân con:</span>
                      <span className="font-medium">
                        {currentSubCourt.ten_san_con}
                      </span>
                    </div>
                  )}
                  {selectedSlots.length > 0 && (
                    <div>
                      <span className="text-gray-500 block mb-2">Khung giờ:</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedSlots.map((slotId) => {
                          const slot = currentSlots.find((s) => s.ma_khung_gio === slotId);
                          return slot ? (
                            <Badge key={slotId} variant="success">
                              {formatTime(slot.gio_bat_dau)}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t my-4 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Tổng tiền:</span>
                    <span className="text-2xl font-bold text-emerald-600">
                      {formatCurrency(calculateTotal())}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  disabled={!selectedSubCourt || selectedSlots.length === 0}
                  isLoading={createBookingMutation.isPending}
                  onClick={handleSubmit}
                >
                  {paymentMethod === 'chuyen_khoan' ? 'Thanh toán ngay' : 'Đặt sân'}
                </Button>

                {createBookingMutation.isError && (
                  <p className="text-red-500 text-sm mt-2 text-center">
                    Đặt sân thất bại. Vui lòng thử lại.
                  </p>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
