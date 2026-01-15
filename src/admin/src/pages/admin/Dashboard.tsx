//@ts-nocheck

import { useEffect, useState } from "react";
import api from "../../services/api";
// import { Link } from "react-router-dom";
// import AdminLayout from "../../layouts/AuthLayout";
import AdminLayout from "../../layouts/AdminLayout";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState(null);

  const [period, setPeriod] = useState("day"); // day | month | year
  const [day, setDay] = useState(
    new Date().toISOString().slice(0, 10) // yyyy-MM-dd
  );
  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7) // yyyy-MM
  );
  const [year, setYear] = useState(
    new Date().getFullYear().toString() // yyyy
  );



  useEffect(() => {
    let mounted = true;

    function buildParams() {
      if (period === "day") {
        return { period: "day", date: day };
      }

      if (period === "month") {
        if (!/^\d{4}-\d{2}$/.test(month)) return null;
        return { period: "month", month };
      }

      if (period === "year") {
        if (!/^\d{4}$/.test(year)) return null;
        return { period: "year", year };
      }

      return null;
    }

    async function load() {
      const params = buildParams();
      if (!params) return; //  chặn gọi API sai

      try {
        setLoading(true);
        setError(null);

        const res = await api.get("/admin/stats/overview", { params });
        console.log({ data: res.data })
        if (mounted) setOverview(res.data);
      } catch (e) {
        console.log(error)
        setError(e?.response?.data || e.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => (mounted = false);
  }, [period, day, month, year]);

  return (
    <AdminLayout>
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Dashboard</h5>
          <div className="d-flex gap-2">

            <select
              className="form-select w-auto"
              value={period}
              onChange={e => setPeriod(e.target.value)}
            >
              <option value="day">Theo ngày</option>
              <option value="month">Theo tháng</option>
              <option value="year">Theo năm</option>
            </select>

            {period === "day" && (
              <input
                type="date"
                className="form-control w-auto"
                value={day}
                onChange={(e) => setDay(e.target.value)}
              />
            )}

            {period === "month" && (
              <input
                type="month"
                className="form-control w-auto"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />
            )}

            {period === "year" && (
              <select
                className="form-select w-auto"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                {[2022, 2023, 2024, 2025].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {loading && <div>Loading...</div>}
        {error &&
          <div className="alert alert-danger">
            Error: {JSON.stringify(error)}
          </div>}

        {overview && (
          <>
            <div className="row">

              <div className="col-lg-3 col-sm-6 mb-3">
                <div className="card">
                  <div className="card-body p-3">
                    <div className="d-flex align-items-center">
                      <div className="icon bg-primary text-white rounded-circle p-2 me-3">
                        <i className="fa fa-users" />
                      </div>
                      <div>
                        <p className="mb-0 text-sm">Tổng người dùng</p>
                        <h5 className="mb-0">{overview.totals?.users ?? "-"}</h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-sm-6 mb-3">
                <div className="card">
                  <div className="card-body p-3">
                    <div className="d-flex align-items-center">
                      <div className="icon bg-success text-white rounded-circle p-2 me-3">
                        <i className="fa fa-futbol" />
                      </div>
                      <div>
                        <p className="mb-0 text-sm">Tổng sân</p>
                        <h5 className="mb-0">{overview.totals?.sands ?? "-"}</h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-sm-6 mb-3">
                <div className="card">
                  <div className="card-body p-3">
                    <div className="d-flex align-items-center">
                      <div className="icon bg-warning text-white rounded-circle p-2 me-3">
                        <i className="fa fa-calendar-check" />
                      </div>
                      <div>
                        <p className="mb-0 text-sm">Tổng lịch đặt</p>
                        <h5 className="mb-0">{overview.totals?.orders ?? "-"}</h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-sm-6 mb-3">
                <div className="card">
                  <div className="card-body p-3">
                    <div className="d-flex align-items-center">
                      <div className="icon bg-danger text-white rounded-circle p-2 me-3">
                        <i className="fa fa-dollar-sign" />
                      </div>
                      <div>
                        <p className="mb-0 text-sm">Doanh thu</p>
                        <h5 className="mb-0">{Number(overview.totals?.revenue ?? 0).toLocaleString('vi-VN')} VNĐ</h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top slots */}
            <div className="row mt-3">
              <div className="col-lg-6 mb-3">
                <div className="card">
                  <div className="card-header">
                    <h6 className="mb-0">Top Khung Giờ</h6>
                  </div>
                  <div className="card-body">
                    <ul className="list-group">
                      {(overview.top_slots || []).map((t) => (
                        <li key={t.ma_khung_gio} className="list-group-item d-flex justify-content-between align-items-center">
                          <div>
                            <strong>ID {t.ma_khung_gio}</strong>
                            <div className="text-muted small">{t.khung?.gio_bat_dau} - {t.khung?.gio_ket_thuc}</div>
                          </div>
                          <span className="badge bg-primary rounded-pill">{t.count}</span>
                        </li>
                      ))}
                      {(!overview.top_slots || overview.top_slots.length === 0) && <li className="list-group-item">Không có dữ liệu</li>}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-lg-6 mb-3">
                <div className="card">
                  <div className="card-header">
                    <h6 className="mb-0">Top Sân</h6>
                  </div>
                  <div className="card-body">
                    <ul className="list-group">
                      {(overview.top_courts || []).map((t) => (
                        <li key={t.ma_san_con} className="list-group-item d-flex justify-content-between align-items-center">
                          <div>
                            <strong>{t.san?.ten_san || "Sân"} / {t.san_con?.ten_san_con || "Sân con"}</strong>
                            <div className="text-muted small">{t.san?.dia_chi}</div>
                          </div>
                          <span className="badge bg-success rounded-pill">{t.count}</span>
                        </li>
                      ))}
                      {(!overview.top_courts || overview.top_courts.length === 0) && <li className="list-group-item">Không có dữ liệu</li>}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}