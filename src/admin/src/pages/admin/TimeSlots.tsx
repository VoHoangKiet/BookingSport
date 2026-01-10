// @ts-nocheck
import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminLayout from "../../layouts/AdminLayout";

export default function TimeSlotsAdmin() {
  const [slots, setSlots] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [weekSurcharges, setWeekSurcharges] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state for adding holiday
  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [newHoliday, setNewHoliday] = useState({
    ma_ngay_le: "",
    ten_ngay_le: "",
    phi_ngay_le: ""
  });

  async function loadAll() {
    setLoading(true);
    try {
      const [slotsRes, holRes, weekRes] = await Promise.all([
        api.get("/configs/time-slots"),
        api.get("/configs/holidays"),
        api.get("/configs/week-surcharges"),
      ]);
      
      // Sort slots by ID
      const sortedSlots = (slotsRes.data.data || []).sort((a, b) => a.ma_khung_gio - b.ma_khung_gio);
      setSlots(sortedSlots);
      
      setHolidays(holRes.data.data || []);
      
      // Sort week surcharges: 1-6 (Mon-Sat), then 0 (Sun)
      const sortedWeek = (weekRes.data.data || []).sort((a, b) => {
        const dayA = a.ngay_trong_tuan === 0 ? 7 : a.ngay_trong_tuan;
        const dayB = b.ngay_trong_tuan === 0 ? 7 : b.ngay_trong_tuan;
        return dayA - dayB;
      });
      setWeekSurcharges(sortedWeek);
    } catch (e) {
      console.error(e);
      alert("Lỗi khi tải config");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAll(); }, []);

  async function updateSlots() {
    try {
      await api.put("/admin/time-slots", slots);
      alert("Cập nhật thành công");
      await loadAll();
    } catch (e) {
        console.error(e);
      alert("Lỗi khi cập nhật khung giờ");
    }
  }

  function openHolidayModal() {
    setNewHoliday({ ma_ngay_le: "", ten_ngay_le: "", phi_ngay_le: "" });
    setShowHolidayModal(true);
  }

  async function submitHoliday() {
    if (!newHoliday.ma_ngay_le || !newHoliday.ten_ngay_le) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    try {
      await api.post("/admin/holidays", newHoliday);
      alert("Thêm ngày lễ thành công");
      setShowHolidayModal(false);
      await loadAll();
    } catch (e) {
        console.error(e);
      alert("Lỗi khi thêm ngày nghỉ");
    }
  }

  async function updateWeekSurcharges() {
    try {
      await api.put("/admin/week-surcharges", weekSurcharges);
      alert("Cập nhật phụ phí tuần thành công");
      await loadAll();
    } catch (e) {
        console.error(e);
      alert("Lỗi khi cập nhật phụ phí");
    }
  }
  
  function getDayName(day) {
    const days = {
      1: "Thứ 2",
      2: "Thứ 3",
      3: "Thứ 4",
      4: "Thứ 5",
      5: "Thứ 6",
      6: "Thứ 7",
      0: "Chủ nhật"
    };
    return days[day] || day;
  }

  return (
    <AdminLayout>
      <div className="container-fluid py-4">
        <h5>Quản lý khung giờ / ngày nghỉ / phụ phí tuần</h5>
        {loading && <div>Loading...</div>}

        <div className="card mb-3">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h6 className="mb-0">Danh sách khung giờ</h6>
            <button className="btn btn-sm btn-primary" onClick={updateSlots}>Lưu thay đổi</button>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table">
                <thead><tr><th>ID</th><th>Bắt đầu</th><th>Kết thúc</th><th>Phụ phí</th></tr></thead>
                <tbody>
                  {slots.map((s, idx) => (
                    <tr key={s.ma_khung_gio}>
                      <td>{s.ma_khung_gio}</td>
                      <td>
                        <input className="form-control form-control-sm" value={s.gio_bat_dau} onChange={(e) => {
                          const ns = [...slots]; ns[idx] = { ...s, gio_bat_dau: e.target.value }; setSlots(ns);
                        }} />
                      </td>
                      <td>
                        <input className="form-control form-control-sm" value={s.gio_ket_thuc} onChange={(e) => {
                          const ns = [...slots]; ns[idx] = { ...s, gio_ket_thuc: e.target.value }; setSlots(ns);
                        }} />
                      </td>
                      <td>
                        <input className="form-control form-control-sm" value={s.phu_phi} onChange={(e) => {
                          const ns = [...slots]; ns[idx] = { ...s, phu_phi: e.target.value }; setSlots(ns);
                        }} />
                      </td>
                    </tr>
                  ))}
                  {slots.length === 0 && <tr><td colSpan="4">Không có khung giờ</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="card mb-3">
              <div className="card-header d-flex justify-content-between">
                <h6 className="mb-0">Danh sách ngày nghỉ</h6>
                <button className="btn btn-sm btn-success" onClick={openHolidayModal}>Thêm ngày nghỉ</button>
              </div>
              <div className="card-body">
                <ul className="list-group">
                  {holidays.map(h => (
                    <li key={h.ma_ngay_le} className="list-group-item d-flex justify-content-between">
                      <div>
                        <strong>{h.ma_ngay_le}</strong> - {h.ten_ngay_le}
                      </div>
                      <div>{h.phi_ngay_le}</div>
                    </li>
                  ))}
                  {holidays.length === 0 && <li className="list-group-item">Không có ngày nghỉ</li>}
                </ul>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card mb-3">
              <div className="card-header d-flex justify-content-between">
                <h6 className="mb-0">Phụ phí trong tuần</h6>
                <button className="btn btn-sm btn-primary" onClick={updateWeekSurcharges}>Lưu</button>
              </div>
              <div className="card-body">
                <table className="table">
                  <thead><tr><th>Ngày</th><th>Phí</th></tr></thead>
                  <tbody>
                    {weekSurcharges.map((w, i) => (
                      <tr key={`week-${w.ngay_trong_tuan}-${i}`}>
                        <td>{getDayName(w.ngay_trong_tuan)}</td>
                        <td>
                          <input className="form-control form-control-sm" value={w.phi_thu}
                            onChange={(e) => {
                              const ns = [...weekSurcharges]; ns[i] = { ...w, phi_thu: e.target.value }; setWeekSurcharges(ns);
                            }} />
                        </td>
                      </tr>
                    ))}
                    {weekSurcharges.length === 0 && <tr><td colSpan="2">Không có</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Modal for adding holiday */}
        {showHolidayModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Thêm ngày nghỉ</h5>
                  <button type="button" className="btn-close" onClick={() => setShowHolidayModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Ngày (YYYY-MM-DD)</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      value={newHoliday.ma_ngay_le}
                      onChange={(e) => setNewHoliday({...newHoliday, ma_ngay_le: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Tên ngày lễ</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={newHoliday.ten_ngay_le}
                      onChange={(e) => setNewHoliday({...newHoliday, ten_ngay_le: e.target.value})}
                      placeholder="Ví dụ: Tết Nguyên Đán"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phụ phí (VNĐ)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={newHoliday.phi_ngay_le}
                      onChange={(e) => setNewHoliday({...newHoliday, phi_ngay_le: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowHolidayModal(false)}>Hủy</button>
                  <button type="button" className="btn btn-primary" onClick={submitHoliday}>Thêm</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}