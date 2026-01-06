// @ts-nocheck
import { useEffect, useState } from "react";
import api from "../../services/api";
import OwnerLayout from "../../layouts/OwnerLayout";

export default function OwnerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load(date) {
    setLoading(true);
    try {
      // owner list endpoint: /api/bookings/owner/list
      const res = await api.get("/bookings/owner/list", { params: { date } });
      setBookings(res.data.data || []);
    } catch (e) {
      console.error(e); alert("Lỗi khi tải đơn đặt");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <OwnerLayout>
      <div className="container-fluid py-4">
        <h5>Đơn đặt sân của tôi</h5>
        {loading && <div>Loading...</div>}
        {!loading && bookings.length === 0 && <div>Không có đơn</div>}
        {bookings.map(b => (
          <div key={b.don.ma_don} className="card mb-2">
            <div className="card-body d-flex justify-content-between">
              <div>
                <strong>Đơn #{b.don.ma_don}</strong>
                <div>Trạng thái: {b.don.trang_thai_don}</div>
              </div>
              <div>
                <a className="btn btn-sm btn-outline-primary me-2" href={`/owner/dat-san/${b.don.ma_don}`}>Xem</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </OwnerLayout>
  );
}