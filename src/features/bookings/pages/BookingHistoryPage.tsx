import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { bookingsApi } from '@/api';
import { Card, CardBody, Badge, CardSkeleton } from '@/components/ui';
import { formatCurrency, formatDate, getBookingStatusColor, getBookingStatusLabel } from '@/lib/utils';
import { Calendar, Ticket, ClipboardList } from 'lucide-react';

export default function BookingHistoryPage() {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: bookingsApi.getMyHistory,
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Lịch sử đặt sân</h1>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : bookings && bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Link key={booking.ma_don} to={`/bookings/${booking.ma_don}`}>
                <Card hoverable className="overflow-hidden">
                  <CardBody>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg text-gray-900">
                            {booking.san_con?.ten_san_con || 'Sân'}
                          </h3>
                          <Badge className={getBookingStatusColor(booking.trang_thai)}>
                            {getBookingStatusLabel(booking.trang_thai)}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(booking.ngay_dat_san)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Ticket className="w-4 h-4" />
                            Mã đơn: #{booking.ma_don}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-emerald-600">
                          {formatCurrency(booking.tong_tien)}
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardBody className="text-center py-12">
              <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có lịch đặt nào</h3>
              <p className="text-gray-500 mb-6">Bắt đầu tìm và đặt sân yêu thích của bạn ngay!</p>
              <Link to="/courts">
                <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                  Tìm sân ngay
                </button>
              </Link>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
