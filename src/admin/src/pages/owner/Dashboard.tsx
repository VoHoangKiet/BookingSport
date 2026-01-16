//@ts-nocheck
import { useEffect, useState } from "react";
import api from "../../services/api";
import OwnerLayout from "../../layouts/OwnerLayout";

export default function OwnerDashboard() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
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
      if (!params) return;

      try {
        setLoading(true);
        setError(null);
        const res = await api.get("/owner/stats/overview", { params });
        if (mounted) setOverview(res.data);
      } catch (e) {
        console.error(e);
        if (mounted) setError(e?.response?.data || e.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => (mounted = false);
  }, [period, day, month, year]);

  return (
    <OwnerLayout>
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Bảng Điều Khiển</h5>
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
        {error && (
          <div className="alert alert-danger">
            Error: {JSON.stringify(error)}
          </div>
        )}

        {overview && (
          <>
            <div className="row">
              <div className="col-md-4 mb-3">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="icon bg-success text-white rounded-circle p-2 me-3">
                        <i className="fa fa-futbol" />
                      </div>
                      <div>
                        <p className="mb-0 text-sm">Tổng sân</p>
                        <h4>{overview.totals?.sands ?? 0}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="icon bg-warning text-white rounded-circle p-2 me-3">
                        <i className="fa fa-calendar-check" />
                      </div>
                      <div>
                        <p className="mb-0 text-sm">Tổng đơn đặt</p>
                        <h4>{overview.totals?.orders ?? 0}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="icon bg-danger text-white rounded-circle p-2 me-3">
                        <i className="fa fa-dollar-sign" />
                      </div>
                      <div>
                        <p className="mb-0 text-sm">Doanh thu</p>
                        <h4>{Number(overview.totals?.revenue ?? 0).toLocaleString('vi-VN')} VNĐ</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </OwnerLayout>
  );
}