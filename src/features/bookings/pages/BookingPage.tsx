import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { courtsApi, bookingsApi, paymentApi } from '@/api';
import { Button, Skeleton } from '@/components/ui';
import { formatCurrency, formatTime } from '@/lib/utils';
import type { TimeSlot, PaymentMethod, SubCourt } from '@/types';
import { Frown, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, CreditCard, Banknote, Sun, CloudSun, Moon } from 'lucide-react';

export default function BookingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });

  const [viewDate, setViewDate] = useState(new Date(selectedDate));
  const [selectedSubCourt, setSelectedSubCourt] = useState<number | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<number[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('chuyen_khoan');
  const [paymentType, setPaymentType] = useState<'dat_coc' | 'thanh_toan'>('thanh_toan');

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

  const currentSubCourt = availableSubCourts?.find((s) => s.ma_san_con === selectedSubCourt);
  const currentSlots = useMemo(() => {
    return [...(currentSubCourt?.available_slots || [])].sort((a, b) => 
      a.gio_bat_dau.localeCompare(b.gio_bat_dau)
    );
  }, [currentSubCourt]);

  const groupedSlots = useMemo(() => {
    if (!currentSlots.length) return { morning: [], afternoon: [], evening: [] };
    
    return {
      morning: currentSlots.filter(s => {
        const h = parseInt(s.gio_bat_dau.split(':')[0]);
        return h >= 6 && h <= 11;
      }),
      afternoon: currentSlots.filter(s => {
        const h = parseInt(s.gio_bat_dau.split(':')[0]);
        return h >= 12 && h <= 17;
      }),
      evening: currentSlots.filter(s => {
        const h = parseInt(s.gio_bat_dau.split(':')[0]);
        return h >= 18 && h <= 22;
      })
    };
  }, [currentSlots]);

  const createBookingMutation = useMutation({
    mutationFn: bookingsApi.create,
    onSuccess: async (data: unknown) => {
      const response = data as Record<string, unknown>;
      const booking = (response.don || response) as Record<string, unknown>;
      const ma_don = (booking.ma_don || response.ma_don) as number;

      if (paymentMethod === 'chuyen_khoan') {
        const { paymentUrl } = await paymentApi.createVnpayPayment({
          ma_don: ma_don,
          loai_giao_dich: paymentType,
        });
        window.location.href = paymentUrl;
      } else {
        navigate(`/bookings/${ma_don}`);
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
    if (!currentSubCourt || !selectedSlots.length) return 0;
    return selectedSlots.reduce((total, slotId) => {
      const slot = currentSlots.find((s) => s.ma_khung_gio === slotId);
      return total + currentSubCourt.gia_co_ban + (slot?.phu_phi || 0);
    }, 0);
  };

  const calculatePayNow = () => {
    const total = calculateTotal();
    if (paymentMethod === 'tien_mat') return 0;
    return paymentType === 'dat_coc' ? total * 0.3 : total;
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

  // Calendar logic
  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startPadding = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const days = [];
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startPadding - 1; i >= 0; i--) {
      days.push({ day: prevMonthLastDay - i, month: month - 1, year, isCurrentMonth: false, disabled: true });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateStr = date.toISOString().split('T')[0];
      const isPast = date < today;
      days.push({ day: i, month, year, isCurrentMonth: true, disabled: isPast, value: dateStr, isToday: date.getTime() === today.getTime() });
    }
    const remainingSlots = 42 - days.length;
    for (let i = 1; i <= remainingSlots; i++) {
      days.push({ day: i, month: month + 1, year, isCurrentMonth: false, disabled: true });
    }
    return days;
  }, [viewDate, today]);

  const changeMonth = (offset: number) => {
    const nextDate = new Date(viewDate);
    nextDate.setMonth(viewDate.getMonth() + offset);
    setViewDate(nextDate);
  };

  if (courtLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium">Đang tải thông tin sân...</p>
        </div>
      </div>
    );
  }

  if (!court) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <Frown className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy sân</h2>
          <p className="text-gray-500 mb-6 text-sm">Sân bạn đang tìm kiếm có thể đã tạm thời đóng cửa hoặc thông tin không còn đúng.</p>
          <Button onClick={() => navigate('/courts')} className="rounded-md">Quay lại danh sách</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-gray-900 font-sans leading-relaxed pb-20">
      {/* Header Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold truncate max-w-[200px] sm:max-w-md">{court.ten_san}</h1>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{court.dia_chi}</span>
              </div>
            </div>
          </div>
          <div className="hidden sm:block text-right">
            <span className="text-xs text-gray-400 block">Giá từ</span>
            <span className="text-emerald-700 font-bold">{formatCurrency(court.san_cons?.[0]?.gia_co_ban || 0)}/giờ</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. CALENDAR SECTION */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-sm font-bold text-gray-800">Chọn ngày chơi</h2>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => changeMonth(-1)} className="p-1.5 hover:bg-white hover:shadow-sm rounded border border-gray-200 transition-all">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-3 text-sm font-semibold text-gray-800 min-w-[120px] text-center">
                    Tháng {viewDate.getMonth() + 1}, {viewDate.getFullYear()}
                  </span>
                  <button onClick={() => changeMonth(1)} className="p-1.5 hover:bg-white hover:shadow-sm rounded border border-gray-200 transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-7 gap-px bg-gray-100 border border-gray-100">
                  {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day) => (
                    <div key={day} className="bg-gray-50 text-center text-[10px] font-bold text-gray-400 py-2">
                      {day}
                    </div>
                  ))}
                  
                  {calendarDays.map((date, idx) => {
                    const isSelected = selectedDate === date.value;
                    return (
                      <button
                        key={`${date.year}-${date.month}-${date.day}-${idx}`}
                        disabled={date.disabled}
                        onClick={() => date.value && (setSelectedDate(date.value), setSelectedSlots([]))}
                        className={`
                          relative h-14 md:h-16 flex flex-col items-center justify-center transition-all group focus:outline-none
                          ${!date.isCurrentMonth ? 'bg-white opacity-20 text-gray-200' : ''}
                          ${date.disabled && date.isCurrentMonth ? 'bg-gray-50 text-gray-300 cursor-not-allowed' : 'cursor-pointer'}
                          ${isSelected 
                            ? 'bg-emerald-600 z-10 font-bold hover:bg-white' 
                            : !date.disabled && date.isCurrentMonth 
                              ? date.isToday 
                                ? 'bg-white ring-1 ring-inset ring-emerald-600 hover:bg-emerald-600' 
                                : 'bg-white hover:bg-gray-50'
                              : ''}
                        `}
                      >
                        <span className={`text-base transition-colors duration-200
                          ${isSelected ? 'text-white group-hover:text-emerald-600' : ''}
                          ${!isSelected && date.isToday ? 'text-emerald-600 group-hover:text-white' : ''}
                          ${!isSelected && !date.isToday ? 'text-gray-900' : ''}
                          ${date.disabled ? 'text-gray-300' : ''}
                        `}>
                          {date.day}
                        </span>
                        {date.isToday && (
                          <span className={`text-[8px] absolute bottom-2 font-bold
                            ${isSelected ? 'text-emerald-100' : 'text-emerald-600'}
                          `}>
                            Hôm nay
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 2. SUB-COURT SECTION */}
            <div className={`bg-white border border-gray-200 rounded-lg overflow-hidden ${!selectedDate ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <h2 className="text-sm font-bold text-gray-800">Chọn khu vực sân</h2>
              </div>
              
              <div className="p-6">
                {slotsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 rounded-md" />)}
                  </div>
                ) : availableSubCourts && availableSubCourts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {availableSubCourts.map((sub: SubCourt) => (
                      <button
                        key={sub.ma_san_con}
                        onClick={() => { setSelectedSubCourt(sub.ma_san_con); setSelectedSlots([]); }}
                        className={`
                          p-4 rounded-md border text-left transition-all
                          ${selectedSubCourt === sub.ma_san_con 
                            ? 'border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600' 
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
                        `}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-bold">{sub.ten_san_con}</span>
                          <span className="text-xs text-gray-400 font-medium">{sub.available_slots?.length || 0} giờ trống</span>
                        </div>
                        <div className="text-emerald-600 font-bold text-sm tracking-tight">{formatCurrency(sub.gia_co_ban)}<span className="text-[10px] text-gray-400 font-normal"> /h</span></div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center border-2 border-dashed border-gray-100 rounded-md">
                    <p className="text-gray-400 text-sm">Không tìm thấy sân khả dụng cho ngày này.</p>
                  </div>
                )}
              </div>
            </div>

            {/* 3. TIME SLOT SECTION */}
            <div className={`bg-white border border-gray-200 rounded-lg overflow-hidden ${!selectedSubCourt ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-sm font-bold text-gray-800">Chọn giờ bắt đầu</h2>
                </div>
                {selectedSlots.length > 0 && (
                  <div className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded">
                    Đã chọn {selectedSlots.length} khung giờ
                  </div>
                )}
              </div>
              
              <div className="p-6">
                {!selectedSubCourt ? (
                  <div className="py-10 text-center opacity-40">
                    <Clock className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">Vui lòng chọn bước 1 & 2 trước</p>
                  </div>
                ) : currentSlots.length > 0 ? (
                  <div className="space-y-8">
                    {[
                      { id: 'morning', label: 'Sáng', range: '06:00 - 11:30', icon: Sun, slots: groupedSlots.morning, color: 'text-amber-600' },
                      { id: 'afternoon', label: 'Chiều', range: '12:00 - 17:30', icon: CloudSun, slots: groupedSlots.afternoon, color: 'text-orange-500' },
                      { id: 'evening', label: 'Tối', range: '18:00 - 22:00', icon: Moon, slots: groupedSlots.evening, color: 'text-blue-600' },
                    ].map((group) => group.slots.length > 0 && (
                      <div key={group.id} className="space-y-3">
                        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-gray-100 border text-gray-700">
                          <group.icon className={`w-3.5 h-3.5 ${group.color}`} />
                          <span className="text-xs font-bold text-gray-700">{group.label}</span>
                          <span className="text-[10px] text-gray-400 font-medium ml-auto">Khung giờ {group.range}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 border-t border-l border-gray-100">
                          {group.slots.map((slot: TimeSlot) => {
                            const isActive = selectedSlots.includes(slot.ma_khung_gio);
                            return (
                              <button
                                key={slot.ma_khung_gio}
                                onClick={() => !slot.da_dat && handleSlotToggle(slot.ma_khung_gio)}
                                disabled={slot.da_dat}
                                className={`
                                  relative h-12 border-r border-b border-gray-100 flex flex-col items-center justify-center transition-all group
                                  ${slot.da_dat
                                    ? 'bg-gray-50/50 text-gray-300 cursor-not-allowed'
                                    : isActive
                                    ? 'bg-emerald-600 text-white font-bold z-10'
                                    : 'bg-white hover:bg-emerald-50 hover:text-emerald-600 cursor-pointer'}
                                `}
                              >
                                <span className={`text-[13px] tracking-tight transition-colors ${slot.da_dat ? 'line-through opacity-40' : ''}`}>
                                  {formatTime(slot.gio_bat_dau)}
                                </span>
                                
                                {slot.phu_phi > 0 && !slot.da_dat && (
                                  <span className={`absolute bottom-1 right-1.5 text-[8px] font-bold transition-colors 
                                    ${isActive ? 'text-emerald-100' : 'text-amber-600'}
                                  `}>
                                    +{(slot.phu_phi/1000)}k
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8 text-sm">Rất tiếc, sân này đã hết khung giờ trong ngày được chọn.</p>
                )}
              </div>
            </div>
          </div>

          {/* Checkout Column */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
                <div className="w-1 h-3.5 bg-emerald-600 rounded-full"></div>
                <h3 className="text-sm font-bold text-gray-800">Chi tiết thanh toán</h3>
              </div>
              
              <div className="p-6 space-y-5">
                {/* Details */}
                <div className="space-y-3 pb-5 border-b border-gray-100">
                  <div className="flex justify-between items-center text-[13px]">
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Cơ sở</span>
                    </div>
                    <span className="text-gray-900 font-bold text-right ml-4">{court.ten_san}</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px]">
                    <div className="flex items-center gap-2 text-gray-400">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      <span>Ngày chơi</span>
                    </div>
                    <span className="text-gray-900 font-bold text-right ml-4 capitalize">
                      {new Date(selectedDate).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[13px]">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Khu vực</span>
                    </div>
                    <span className="text-gray-900 font-bold text-right ml-4">{currentSubCourt?.ten_san_con || 'Chưa chọn'}</span>
                  </div>
                  {selectedSlots.length > 0 && (
                    <div className="pt-3 border-t border-gray-50">
                       <div className="flex items-center gap-2 text-gray-500 text-[11px] font-semibold mb-2.5">
                          <Clock className="w-3 h-3" />
                          <span>Khung giờ đã chọn</span>
                       </div>
                       <div className="grid grid-cols-2 gap-1.5">
                          {selectedSlots.map(id => {
                            const slot = currentSlots.find(s => s.ma_khung_gio === id);
                            return slot ? (
                              <div key={id} className="bg-gray-50 border border-gray-100 px-2 py-1.5 text-[10px] font-bold text-gray-700 flex justify-between items-center">
                                <span>{formatTime(slot.gio_bat_dau)} - {formatTime(slot.gio_ket_thuc)}</span>
                              </div>
                            ) : null;
                          })}
                       </div>
                    </div>
                  )}
                </div>

                {/* Payment Selection */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-gray-700">Hình thức thanh toán</span>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2.5">
                    <button 
                      onClick={() => setPaymentMethod('chuyen_khoan')}
                      className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${paymentMethod === 'chuyen_khoan' ? 'border-emerald-600 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${paymentMethod === 'chuyen_khoan' ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold text-gray-800">VNPay Online</span>
                    </button>
                    
                    {paymentMethod === 'chuyen_khoan' && (
                       <div className="grid grid-cols-2 gap-2 mt-1">
                          <button 
                            onClick={() => setPaymentType('thanh_toan')}
                            className={`py-2 rounded-lg text-[10px] font-bold border transition-all ${paymentType === 'thanh_toan' ? 'bg-gray-800 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                          >
                            DỨT ĐIỂM 100%
                          </button>
                          <button 
                            onClick={() => setPaymentType('dat_coc')}
                            className={`py-2 rounded-lg text-[10px] font-bold border transition-all ${paymentType === 'dat_coc' ? 'bg-gray-800 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                          >
                            ĐẶT CỌC 30%
                          </button>
                       </div>
                    )}

                    <button 
                      onClick={() => setPaymentMethod('tien_mat')}
                      className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${paymentMethod === 'tien_mat' ? 'border-emerald-600 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${paymentMethod === 'tien_mat' ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                        <Banknote className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold text-gray-800">Thanh toán tại quầy</span>
                    </button>
                  </div>
                </div>

                {/* Final Price Block */}
                <div className="pt-6 border-t-2 border-dashed border-gray-100 space-y-4">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs text-gray-500 font-semibold">Tổng cộng</span>
                    <span className="text-2xl font-bold text-gray-900 tracking-tight">{formatCurrency(calculateTotal())}</span>
                  </div>

                  {paymentMethod === 'chuyen_khoan' && (
                    <div className="bg-emerald-600 p-4 border border-emerald-700 rounded-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold text-emerald-50">Thanh toán ngay</span>
                        <div className="bg-emerald-500/50 px-1.5 py-0.5 text-[8px] text-white font-bold rounded">VNPAY</div>
                      </div>
                      <div className="text-2xl font-black text-white tracking-tighter">{formatCurrency(calculatePayNow())}</div>
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={!selectedSubCourt || !selectedSlots.length || createBookingMutation.isPending}
                    className={`
                      w-full py-4 rounded-lg font-bold text-sm transition-all
                      ${!selectedSubCourt || !selectedSlots.length 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.99] border border-emerald-600'}
                    `}
                  >
                    {createBookingMutation.isPending ? 'Đang xử lý...' : 'Xác nhận đặt sân'}
                  </button>
                  
                  {createBookingMutation.isError && (
                    <p className="text-red-600 text-[10px] font-bold text-center italic">Lỗi kết nối API. Vui lòng thử lại sau.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
