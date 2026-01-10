import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardBody } from '@/components/ui';
import { CheckCircle2, XCircle, Home, History, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  
  const responseCode = searchParams.get('vnp_ResponseCode');
  const transactionNo = searchParams.get('vnp_TransactionNo');
  const amount = searchParams.get('vnp_Amount');
  const orderInfo = searchParams.get('vnp_OrderInfo');
  const payDate = searchParams.get('vnp_PayDate');

  const isSuccess = responseCode === '00';

  const formatVNPayDate = (dateStr: string) => {
    if (!dateStr || dateStr.length !== 14) return dateStr;
    const year = dateStr.slice(0, 4);
    const month = dateStr.slice(4, 6);
    const day = dateStr.slice(6, 8);
    const hour = dateStr.slice(8, 10);
    const minute = dateStr.slice(10, 12);
    return `${hour}:${minute} - ${day}/${month}/${year}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <Card className="max-w-md w-full border border-gray-200 rounded-lg overflow-hidden shadow-none">
        <div className={`h-1.5 ${isSuccess ? 'bg-emerald-600' : 'bg-red-600'}`} />
        <CardBody className="p-0">
          {/* Status Header */}
          <div className="text-center p-8 border-b border-gray-100">
            {isSuccess ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">Giao dịch thành công</h1>
                <p className="text-sm text-gray-500 mt-1 font-medium">Hệ thống đã xác nhận thanh toán của bạn</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                  <XCircle className="w-10 h-10 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">Giao dịch thất bại</h1>
                <p className="text-sm text-red-500 mt-1 font-medium">Giao dịch bị từ chối hoặc đã bị hủy bỏ</p>
              </div>
            )}
          </div>
          
          {/* Details Body */}
          <div className="p-8">
            <div className={`rounded-lg p-5 mb-8 border ${isSuccess ? 'bg-white border-gray-200 shadow-sm' : 'bg-red-50 border-red-100'}`}>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-50">
                 <div className={`w-1 h-3.5 rounded-full ${isSuccess ? 'bg-emerald-600' : 'bg-red-600'}`}></div>
                  <h3 className={`text-xs font-bold ${isSuccess ? 'text-gray-700' : 'text-red-700'}`}>
                  {isSuccess ? 'Chi tiết biên lai' : 'Thông tin lỗi'}
                </h3>
              </div>

              {isSuccess ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm py-1">
                    <span className="text-gray-500 font-medium">Mã giao dịch</span>
                    <span className="font-semibold text-gray-900 text-sm">{transactionNo || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-1">
                    <span className="text-gray-500 font-medium">Thời gian</span>
                    <span className="font-semibold text-gray-900 text-sm">{payDate ? formatVNPayDate(payDate) : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-4 border-t border-gray-100">
                    <span className="text-xs font-bold text-gray-500">Tổng thanh toán</span>
                    <span className="text-2xl font-bold text-emerald-600 tracking-tight">
                      {amount ? formatCurrency(Number(amount) / 100) : '0đ'}
                    </span>
                  </div>
                  {orderInfo && (
                    <div className="pt-3 mt-3 border-t border-dashed border-gray-100">
                      <span className="text-[10px] text-gray-500 font-bold block mb-2">Nội dung đơn hàng</span>
                      <span className="text-xs text-gray-600 font-medium leading-relaxed italic">
                        {decodeURIComponent(orderInfo).replace(/\+/g, ' ')}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs text-red-700 font-bold leading-relaxed">
                    {orderInfo ? decodeURIComponent(orderInfo).replace(/\+/g, ' ') : 'Lỗi không xác định từ cổng thanh toán.'}
                  </p>
                  <div className="pt-3 mt-3 border-t border-red-100 flex justify-between items-center">
                     <span className="text-xs font-bold text-red-400">Mã phản hồi</span>
                     <span className="text-xs font-mono font-bold text-red-700 bg-white px-2 py-0.5 rounded border border-red-100">{responseCode}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Link to="/bookings" className="flex-1">
                <button className="w-full h-12 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-sm">
                  <History className="w-4 h-4" />
                  Lịch sử đặt
                </button>
              </Link>
              <Link to="/courts" className="flex-1">
                <button className={`w-full h-12 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${isSuccess ? 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50' : 'bg-red-600 text-white hover:bg-red-700'}`}>
                   {isSuccess ? <Home className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                   {isSuccess ? 'Trang chủ' : 'Thử lại ngay'}
                </button>
              </Link>
            </div>
          </div>
        </CardBody>
        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
          <p className="text-xs text-gray-500 font-medium">
            Hotline hỗ trợ kỹ thuật: <span className="text-gray-900 font-bold underline underline-offset-4">1900 xxxx</span>
          </p>
        </div>
      </Card>
    </div>
  );
}
