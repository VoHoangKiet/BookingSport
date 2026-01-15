// @ts-nocheck
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import OwnerLayout from "../../layouts/OwnerLayout";

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentType, setPaymentType] = useState("dat_coc");
  const [paymentLoading, setPaymentLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await api.get(`/bookings/${id}`);
      if (res.data.success) {
        setBooking(res.data);
      } else {
        alert(res.data.message || "Không thể tải đơn");
        navigate("/owner/orders/count");
      }
    } catch (e) {
      console.error(e);
      alert("Lỗi khi tải chi tiết đơn");
      navigate("/owner/orders/count");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel() {
    if (!confirm("Bạn có chắc muốn hủy đơn này?")) return;
    try {
      const res = await api.put(`/bookings/${id}/cancel`);
      if (res.data.success) {
        alert("Hủy đơn thành công");
        load(); // Reload
      } else {
        alert(res.data.message || "Không thể hủy đơn");
      }
    } catch (e) {
      console.error(e);
      alert("Lỗi khi hủy đơn");
    }
  }

  async function handleVNPayPayment() {
    setPaymentLoading(true);
    try {
      const res = await api.post("/payment/vnpay/create", {
        ma_don: parseInt(id),
        loai_giao_dich: paymentType,
      });

      if (res.data.success && res.data.paymentUrl) {
        // Redirect to VNPay payment URL
        window.location.href = res.data.paymentUrl;
      } else {
        alert(res.data.message || "Không thể tạo thanh toán VNPay");
      }
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message || "Lỗi khi tạo thanh toán VNPay");
    } finally {
      setPaymentLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  if (loading) {
    return (
      <OwnerLayout>
        <div className="container-fluid py-4">
          <div>Đang tải...</div>
        </div>
      </OwnerLayout>
    );
  }

  if (!booking || !booking.don) {
    return (
      <OwnerLayout>
        <div className="container-fluid py-4">
          <div>Không tìm thấy đơn</div>
        </div>
      </OwnerLayout>
    );
  }

  const { don, chi_tiet } = booking;

  return (
    <OwnerLayout>
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header pb-0">
                <div className="d-flex align-items-center justify-content-between">
                  <h6>Chi tiết đơn đặt sân #{don.ma_don}</h6>
                  <button 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => navigate("/owner/orders/count")}
                  >
                    Quay lại
                  </button>
                </div>
              </div>
              <div className="card-body">
                {/* Thông tin đơn */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h6 className="text-sm">Thông tin đơn hàng</h6>
                    <p className="text-sm mb-1">
                      <strong>Mã đơn:</strong> {don.ma_don}
                    </p>
                    <p className="text-sm mb-1">
                      <strong>Trạng thái:</strong>{" "}
                      <span className={`badge ${
                        don.trang_thai_don === "da_huy" ? "bg-danger" :
                        don.trang_thai_don === "tam_giu" ? "bg-warning" :
                        don.trang_thai_don === "da_xac_nhan" ? "bg-success" :
                        "bg-secondary"
                      }`}>
                        {don.trang_thai_don === "tam_giu" ? "Tạm giữ" :
                         don.trang_thai_don === "da_xac_nhan" ? "Đã xác nhận" :
                         don.trang_thai_don === "da_huy" ? "Đã hủy" :
                         don.trang_thai_don}
                      </span>
                    </p>
                    <p className="text-sm mb-1">
                      <strong>Tổng tiền:</strong> {Number(don.tong_tien || 0).toLocaleString('vi-VN')} VNĐ
                    </p>
                    <p className="text-sm mb-1">
                      <strong>Đã thanh toán:</strong> {Number(don.da_thanh_toan || 0).toLocaleString('vi-VN')} VNĐ
                    </p>
                    <p className="text-sm mb-1">
                      <strong>Hình thức thanh toán:</strong> {don.hinh_thuc_thanh_toan || "Chưa xác định"}
                    </p>
                    <p className="text-sm mb-1">
                      <strong>Thời điểm tạo:</strong> {new Date(don.thoi_diem_tao).toLocaleString("vi-VN")}
                    </p>
                  </div>
                </div>

                {/* Chi tiết đặt sân */}
                <div className="row">
                  <div className="col-12">
                    <h6 className="text-sm mb-3">Chi tiết đặt sân</h6>
                    <div className="table-responsive">
                      <table className="table table-sm align-items-center mb-0">
                        <thead>
                          <tr>
                            <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                              Sân con
                            </th>
                            <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                              Khung giờ
                            </th>
                            <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                              Ngày đặt
                            </th>
                            <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                              Đơn giá
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {chi_tiet && chi_tiet.length > 0 ? (
                            chi_tiet.map((ct, idx) => (
                              <tr key={idx}>
                                <td>
                                  <p className="text-xs font-weight-bold mb-0">
                                    Sân con #{ct.ma_san_con}
                                  </p>
                                </td>
                                <td>
                                  <p className="text-xs font-weight-bold mb-0">
                                    Khung #{ct.ma_khung_gio}
                                  </p>
                                </td>
                                <td>
                                  <p className="text-xs font-weight-bold mb-0">
                                    {ct.ngay_dat_san}
                                  </p>
                                </td>
                                <td>
                                  <p className="text-xs font-weight-bold mb-0">
                                    {Number(ct.don_gia || 0).toLocaleString('vi-VN')} VNĐ
                                  </p>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" className="text-center">
                                Không có chi tiết
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {don.trang_thai_don !== "da_huy" && (
                  <div className="row mt-4">
                    <div className="col-12">
                      {/* VNPay Payment Section */}
                      {(don.trang_thai_don === "tam_giu" || don.trang_thai_don === "da_coc") && (
                        <div className="card mb-3">
                          <div className="card-body">
                            <h6 className="text-sm mb-3">Thanh toán VNPay</h6>
                            
                            {/* Payment Type Selector */}
                            <div className="mb-3">
                              <label className="form-label text-sm">Loại thanh toán</label>
                              <select 
                                className="form-select form-select-sm"
                                value={paymentType}
                                onChange={(e) => setPaymentType(e.target.value)}
                                disabled={paymentLoading}
                              >
                                <option value="dat_coc">Đặt cọc (30%)</option>
                                <option value="thanh_toan">Thanh toán đầy đủ</option>
                              </select>
                              <small className="text-muted">
                                {paymentType === "dat_coc" 
                                  ? `Số tiền đặt cọc: ${(Number(don.tong_tien || 0) * 0.3).toLocaleString('vi-VN')} VNĐ`
                                  : `Số tiền cần thanh toán: ${(Number(don.tong_tien || 0) - Number(don.da_thanh_toan || 0)).toLocaleString('vi-VN')} VNĐ`
                                }
                              </small>
                            </div>

                            {/* Payment Button */}
                            <button 
                              className="btn btn-primary btn-sm"
                              onClick={handleVNPayPayment}
                              disabled={paymentLoading}
                            >
                              {paymentLoading ? "Đang xử lý..." : "Thanh toán VNPay"}
                            </button>
                          </div>
                        </div>
                      )}

                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={handleCancel}
                      >
                        Hủy đơn
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
}
