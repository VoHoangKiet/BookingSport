import { useSearchParams, Link } from 'react-router-dom';
import { Button, Card, CardBody } from '@/components/ui';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  
  const responseCode = searchParams.get('vnp_ResponseCode');
  const transactionNo = searchParams.get('vnp_TransactionNo');
  const amount = searchParams.get('vnp_Amount');
  const orderInfo = searchParams.get('vnp_OrderInfo');

  const isSuccess = responseCode === '00';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <Card className="max-w-md w-full">
        <CardBody className="text-center py-12">
          {isSuccess ? (
            <>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán thành công!</h1>
              <p className="text-gray-600 mb-6">
                Cảm ơn bạn đã sử dụng dịch vụ. Đơn đặt sân của bạn đã được xác nhận.
              </p>
              {transactionNo && (
                <p className="text-sm text-gray-500 mb-2">
                  Mã giao dịch: <span className="font-medium">{transactionNo}</span>
                </p>
              )}
              {amount && (
                <p className="text-sm text-gray-500 mb-6">
                  Số tiền: <span className="font-medium text-emerald-600">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(amount) / 100)}
                  </span>
                </p>
              )}
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán thất bại</h1>
              <p className="text-gray-600 mb-6">
                Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại hoặc liên hệ hỗ trợ.
              </p>
              {orderInfo && (
                <p className="text-sm text-gray-500 mb-6">
                  Thông tin: {decodeURIComponent(orderInfo)}
                </p>
              )}
            </>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/bookings">
              <Button variant={isSuccess ? 'primary' : 'outline'}>
                Xem lịch sử đặt
              </Button>
            </Link>
            <Link to="/courts">
              <Button variant={isSuccess ? 'outline' : 'primary'}>
                Tiếp tục đặt sân
              </Button>
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
