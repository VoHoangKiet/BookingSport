//@ts-nocheck
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import OwnerLayout from "../../layouts/OwnerLayout";

export default function PaymentResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifyPayment() {
      try {
        // Get all query parameters from URL
        const params = {};
        for (const [key, value] of searchParams.entries()) {
          params[key] = value;
        }

        // Call backend to verify and process payment (IPN simulation)
        const queryString = searchParams.toString();
        // const response = await fetch(`http://localhost:3000/api/payment/vnpay/ipn?${queryString}`);
        const response = await fetch(  (import.meta.env.VITE_API_BASE_URL || "") + `/api/payment/vnpay/ipn?${queryString}`);
        const ipnResult = await response.json();
        
        console.log('IPN verification result:', ipnResult);

        // Parse the result from VNPay
        const responseCode = params.vnp_ResponseCode;
        const txnRef = params.vnp_TxnRef;
        const amount = params.vnp_Amount ? parseInt(params.vnp_Amount) / 100 : 0;
        const orderInfo = params.vnp_OrderInfo;
        const transactionNo = params.vnp_TransactionNo;
        const bankCode = params.vnp_BankCode;

        const success = responseCode === "00";

        setResult({
          success,
          responseCode,
          orderId: txnRef,
          amount,
          orderInfo,
          transactionNo,
          bankCode,
          message: getResponseMessage(responseCode),
        });

        setLoading(false);
      } catch (error) {
        console.error('Error verifying payment:', error);
        // Still show result even if verification fails
        const params = {};
        for (const [key, value] of searchParams.entries()) {
          params[key] = value;
        }

        const responseCode = params.vnp_ResponseCode;
        const txnRef = params.vnp_TxnRef;
        const amount = params.vnp_Amount ? parseInt(params.vnp_Amount) / 100 : 0;
        const orderInfo = params.vnp_OrderInfo;
        const transactionNo = params.vnp_TransactionNo;
        const bankCode = params.vnp_BankCode;

        const success = responseCode === "00";

        setResult({
          success,
          responseCode,
          orderId: txnRef,
          amount,
          orderInfo,
          transactionNo,
          bankCode,
          message: getResponseMessage(responseCode),
        });

        setLoading(false);
      }
    }

    verifyPayment();
  }, [searchParams]);

  function getResponseMessage(code) {
    const messages = {
      "00": "Giao dịch thành công",
      "07": "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường)",
      "09": "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng",
      "10": "Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần",
      "11": "Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch",
      "12": "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa",
      "13": "Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch",
      "24": "Giao dịch không thành công do: Khách hàng hủy giao dịch",
      "51": "Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch",
      "65": "Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày",
      "75": "Ngân hàng thanh toán đang bảo trì",
      "79": "Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch",
      "99": "Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)",
    };

    return messages[code] || "Không xác định được trạng thái giao dịch";
  }

  if (loading) {
    return (
      <OwnerLayout>
        <div className="container-fluid py-4">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        </div>
      </OwnerLayout>
    );
  }

  if (!result) {
    return (
      <OwnerLayout>
        <div className="container-fluid py-4">
          <div className="alert alert-warning">
            Không tìm thấy thông tin giao dịch
          </div>
        </div>
      </OwnerLayout>
    );
  }

  return (
    <OwnerLayout>
      <div className="container-fluid py-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card">
              <div className="card-header pb-0">
                <h5 className="mb-0">Kết quả thanh toán</h5>
              </div>
              <div className="card-body">
                {/* Status Icon */}
                <div className="text-center mb-4">
                  {result.success ? (
                    <div>
                      <i className="fas fa-check-circle text-success" style={{ fontSize: "4rem" }}></i>
                      <h4 className="text-success mt-3">Thanh toán thành công!</h4>
                    </div>
                  ) : (
                    <div>
                      <i className="fas fa-times-circle text-danger" style={{ fontSize: "4rem" }}></i>
                      <h4 className="text-danger mt-3">Thanh toán thất bại</h4>
                    </div>
                  )}
                </div>

                {/* Transaction Details */}
                <div className="row">
                  <div className="col-12">
                    <div className="table-responsive">
                      <table className="table table-borderless">
                        <tbody>
                          <tr>
                            <td className="text-sm font-weight-bold">Trạng thái:</td>
                            <td className="text-sm">
                              <span className={`badge ${result.success ? "bg-success" : "bg-danger"}`}>
                                {result.message}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="text-sm font-weight-bold">Mã đơn hàng:</td>
                            <td className="text-sm">{result.orderId}</td>
                          </tr>
                          <tr>
                            <td className="text-sm font-weight-bold">Số tiền:</td>
                            <td className="text-sm">{result.amount.toLocaleString('vi-VN')} VNĐ</td>
                          </tr>
                          {result.transactionNo && (
                            <tr>
                              <td className="text-sm font-weight-bold">Mã giao dịch VNPay:</td>
                              <td className="text-sm">{result.transactionNo}</td>
                            </tr>
                          )}
                          {result.bankCode && (
                            <tr>
                              <td className="text-sm font-weight-bold">Ngân hàng:</td>
                              <td className="text-sm">{result.bankCode}</td>
                            </tr>
                          )}
                          <tr>
                            <td className="text-sm font-weight-bold">Thông tin đơn hàng:</td>
                            <td className="text-sm">{result.orderInfo}</td>
                          </tr>
                          <tr>
                            <td className="text-sm font-weight-bold">Mã phản hồi:</td>
                            <td className="text-sm">{result.responseCode}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="text-center mt-4">
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => navigate(`/owner/dat-san/${result.orderId}`)}
                  >
                    Xem chi tiết đơn hàng
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/owner/orders/count")}
                  >
                    Về danh sách đơn hàng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
}
