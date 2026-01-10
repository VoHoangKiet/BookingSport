import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { bookingsApi } from "@/api";
import { Card, CardBody, Badge, CardSkeleton, Button } from "@/components/ui";
import {
  formatCurrency,
  formatDate,
  getBookingStatusColor,
  getBookingStatusLabel,
} from "@/lib/utils";
import {
  Calendar,
  Ticket,
  ClipboardList,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import type { Booking, BookingDetail } from "@/types";

const ITEMS_PER_PAGE = 5;

export default function BookingHistoryPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: async () => {
      const data = await bookingsApi.getMyHistory();
      const response = data as unknown as Record<string, unknown>;
      const list = (
        Array.isArray(data) ? data : response.data || response.bookings || []
      ) as Booking[];
      return list.map((item: Booking) => {
        const itemObj = item as unknown as Record<string, unknown>;
        const don = (itemObj.don || item) as Booking;
        const chi_tiet = (itemObj.chi_tiet ||
          (don as unknown as Record<string, unknown>).chi_tiets ||
          []) as BookingDetail[];
        const ngay_dat_san =
          don.ngay_dat_san ||
          ((chi_tiet[0] as unknown as Record<string, unknown>)
            ?.ngay_dat_san as string) ||
          ((don as unknown as Record<string, unknown>).thoi_diem_tao as string);
        return {
          ...don,
          ma_don: don.ma_don,
          trang_thai: ((don as unknown as Record<string, unknown>)
            .trang_thai_don ||
            don.trang_thai) as import("@/types").BookingStatus,
          tong_tien: parseFloat(don.tong_tien as unknown as string) || 0,
          ngay_dat_san: ngay_dat_san,
          chi_tiets: chi_tiet,
        };
      });
    },
  });

  // Pagination calculations
  const totalItems = bookings?.length || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBookings = bookings?.slice(startIndex, endIndex) || [];

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 border-b border-gray-100 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
              Lịch sử giao dịch
            </h1>
            <p className="text-sm text-gray-500 mt-1 font-medium">
              Xem và quản lý các đơn đặt sân của bạn
            </p>
          </div>
          {totalItems > 0 && (
            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {totalItems} đơn hàng
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : currentBookings.length > 0 ? (
          <>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {currentBookings.map((booking: Booking) => (
                <Link
                  key={booking.ma_don}
                  to={`/bookings/${booking.ma_don}`}
                  className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5">
                      <h3 className="font-bold text-gray-900">
                        {booking.san_con?.ten_san_con || "Đơn đặt sân"}
                      </h3>
                      <Badge
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${getBookingStatusColor(
                          booking.trang_thai
                        )}`}
                      >
                        {getBookingStatusLabel(booking.trang_thai)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(booking.ngay_dat_san)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Ticket className="w-3.5 h-3.5" />
                        Mã đơn: {booking.ma_don}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-[10px] text-gray-500 font-bold mb-0.5">
                        Giá trị đơn
                      </div>
                      <div className="text-xl font-bold text-emerald-600 leading-none">
                        {formatCurrency(booking.tong_tien)}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-600 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        currentPage === page
                          ? "bg-emerald-600 text-white"
                          : "border border-gray-200 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Page info */}
            {totalPages > 1 && (
              <p className="text-center text-sm text-gray-500 mt-3">
                Hiển thị {startIndex + 1}-{Math.min(endIndex, totalItems)} /{" "}
                {totalItems} đơn
              </p>
            )}
          </>
        ) : (
          <Card>
            <CardBody className="text-center py-12">
              <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Chưa có lịch đặt nào
              </h3>
              <p className="text-gray-500 mb-6">
                Bắt đầu tìm và đặt sân yêu thích của bạn ngay!
              </p>
              <Link to="/courts">
                <Button>Tìm sân ngay</Button>
              </Link>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
