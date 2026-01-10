//@ts-nocheck
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import OwnerLayout from "../../layouts/OwnerLayout";

export default function MyCourts() {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await api.get("/courts/my");
      setCourts(res.data.data || []);
    } catch (e) {
      console.error(e);
      alert("Lỗi khi tải sân của tôi");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <OwnerLayout>
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Sân của tôi</h5>
          <Link className="btn btn-primary" to="/owner/courts/new">Thêm sân</Link>
        </div>

        {loading ? <div>Loading...</div> : (
          <div className="row">
            {courts.map(c => (
              <div key={c.ma_san} className="col-md-4 mb-3">
                <div className="card">
                  <img 
                    src={c.anh_san ? c.anh_san.split(',')[0] : "/assets/img/bg1.jpg"} 
                    alt={c.ten_san} 
                    className="card-img-top" 
                    style={{ height: '200px', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = "/assets/img/bg1.jpg"; }}
                  />
                  <div className="card-body">
                    <h6 className="card-title">{c.ten_san}</h6>
                    <p className="card-text text-muted small">{c.dia_chi}</p>
                    <Link className="btn btn-sm btn-outline-primary" to={`/owner/courts/${c.ma_san}`}>Chi tiết</Link>
                  </div>
                </div>
              </div>
            ))}
            {courts.length === 0 && (
              <div className="col-12">
                <div className="alert alert-info">
                  Bạn chưa có sân nào. <Link to="/owner/courts/new">Thêm sân mới</Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </OwnerLayout>
  );
}