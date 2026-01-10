//@ts-nocheck
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../services/api";
import OwnerLayout from "../../layouts/OwnerLayout";

export default function CourtDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [court, setCourt] = useState(null);
  const [subCourts, setSubCourts] = useState([]);
  const [images, setImages] = useState([]); // Array of image URLs
  const [selectedImage, setSelectedImage] = useState(0); // Index of selected image
  
  // Form sân con
  const [showSubForm, setShowSubForm] = useState(false);
  const [editingSubId, setEditingSubId] = useState(null);
  const [subFormData, setSubFormData] = useState({
    ten_san_con: "",
    thong_tin_san: "",
    trang_thai: "hoat_dong",
    gia_co_ban: ""
  });

  useEffect(() => {
    load();
  }, [id]);

  async function load() {
    setLoading(true);
    try {
      const res = await api.get(`/courts/${id}`);
      if (res.data.success) {
        const courtData = res.data.data.san;
        setCourt(courtData);
        setSubCourts(res.data.data.subCourts || []);
        
        // Gọi API riêng để lấy ảnh
        loadImages();
      }
    } catch (e) {
      console.error(e);
      alert("Lỗi khi tải thông tin sân");
    } finally {
      setLoading(false);
    }
  }

  async function loadImages() {
    try {
      // Delay 500ms để tránh gọi API quá nhanh
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const res = await api.get(`/courts/${id}/images`);
      if (res.data.success) {
        setImages(res.data.images || []);
        if (res.data.images && res.data.images.length > 0) {
          setSelectedImage(0);
        }
      }
    } catch (e) {
      console.error('Error loading images:', e);
      if (e.response?.status === 431) {
        console.warn('Images too large, using placeholder');
        setImages(['/assets/img/bg1.jpg']); // Fallback image
      }
      // Không hiển thị alert, chỉ log lỗi
    }
  }

  async function deleteCourt() {
    if (!confirm("Bạn có chắc muốn xóa sân này?")) return;
    try {
      await api.delete(`/courts/${id}`);
      alert("Xóa sân thành công!");
      navigate("/owner/courts/my");
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message || "Lỗi khi xóa sân");
    }
  }

  function openSubForm(sub = null) {
    if (sub) {
      setEditingSubId(sub.ma_san_con);
      setSubFormData({
        ten_san_con: sub.ten_san_con,
        thong_tin_san: sub.thong_tin_san,
        trang_thai: sub.trang_thai,
        gia_co_ban: sub.gia_co_ban
      });
    } else {
      setEditingSubId(null);
      setSubFormData({
        ten_san_con: "",
        thong_tin_san: "",
        trang_thai: "hoat_dong",
        gia_co_ban: ""
      });
    }
    setShowSubForm(true);
  }

  async function submitSubCourt(e) {
    e.preventDefault();
    try {
      if (editingSubId) {
        await api.put(`/courts/sub/${editingSubId}`, subFormData);
        alert("Cập nhật sân con thành công!");
      } else {
        await api.post("/courts/sub", { ...subFormData, ma_san: id });
        alert("Thêm sân con thành công!");
      }
      setShowSubForm(false);
      await load();
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message || "Lỗi khi lưu sân con");
    }
  }

  async function deleteSubCourt(subId) {
    if (!confirm("Bạn có chắc muốn xóa sân con này?")) return;
    try {
      await api.delete(`/courts/sub/${subId}`);
      alert("Xóa sân con thành công!");
      await load();
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message || "Lỗi khi xóa sân con");
    }
  }

  if (loading) return <OwnerLayout><div className="container-fluid py-4">Loading...</div></OwnerLayout>;
  if (!court) return <OwnerLayout><div className="container-fluid py-4">Không tìm thấy sân</div></OwnerLayout>;

  return (
    <OwnerLayout>
      <div className="container-fluid py-4">
        <div className="row">
          {/* Cột trái - Thông tin sân */}
          <div className="col-md-7">
            <div className="card mb-3">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Thông tin sân</h5>
                <div>
                  <Link to={`/owner/courts/edit/${id}`} className="btn btn-sm btn-warning me-2">
                    Sửa
                  </Link>
                  <button className="btn btn-sm btn-danger" onClick={deleteCourt}>
                    Xóa
                  </button>
                </div>
              </div>
              <div className="card-body">
                <h6>{court.ten_san}</h6>
                <p className="text-muted mb-2">
                  <i className="fa fa-map-marker-alt me-2"></i>
                  {court.dia_chi}
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Danh sách sân con</h5>
                <button className="btn btn-sm btn-primary" onClick={() => openSubForm()}>
                  Thêm sân con
                </button>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Tên</th>
                        <th>Thông tin</th>
                        <th>Trạng thái</th>
                        <th>Giá cơ bản</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subCourts.map(sub => (
                        <tr key={sub.ma_san_con}>
                          <td>{sub.ten_san_con}</td>
                          <td>{sub.thong_tin_san}</td>
                          <td>
                            <span className={`badge ${sub.trang_thai === 'hoat_dong' ? 'bg-success' : 'bg-warning'}`}>
                              {sub.trang_thai === 'hoat_dong' ? 'Hoạt động' : 'Bảo trì'}
                            </span>
                          </td>
                          <td>{Number(sub.gia_co_ban).toLocaleString()} VNĐ</td>
                          <td>
                            <button className="btn btn-sm btn-warning me-2" onClick={() => openSubForm(sub)}>
                              Sửa
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={() => deleteSubCourt(sub.ma_san_con)}>
                              Xóa
                            </button>
                          </td>
                        </tr>
                      ))}
                      {subCourts.length === 0 && (
                        <tr>
                          <td colSpan="5" className="text-center">Chưa có sân con nào</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Cột phải - Gallery ảnh */}
          <div className="col-md-5">
            <div className="card sticky-top" style={{ top: '20px' }}>
              <div className="card-header">
                <h5 className="mb-0">Hình ảnh sân</h5>
              </div>
              <div className="card-body">
                {images.length > 0 ? (
                  <>
                    {/* Ảnh chính */}
                    <div className="mb-3">
                      <img 
                        src={images[selectedImage]} 
                        alt={`${court.ten_san} - Ảnh ${selectedImage + 1}`}
                        className="img-fluid rounded"
                        style={{ width: '100%', height: '350px', objectFit: 'cover' }}
                      />
                    </div>

                    {/* Thumbnails */}
                    {images.length > 1 && (
                      <div className="row g-2">
                        {images.map((img, index) => (
                          <div key={index} className="col-3">
                            <img 
                              src={img} 
                              alt={`Thumbnail ${index + 1}`}
                              className={`img-thumbnail w-100 ${selectedImage === index ? 'border-primary border-3' : ''}`}
                              style={{ 
                                height: '80px', 
                                objectFit: 'cover',
                                cursor: 'pointer',
                                opacity: selectedImage === index ? 1 : 0.6
                              }}
                              onClick={() => setSelectedImage(index)}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Indicator */}
                    <div className="text-center mt-3">
                      <small className="text-muted">
                        Ảnh {selectedImage + 1} / {images.length}
                      </small>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-5">
                    <i className="fas fa-image fa-3x text-muted mb-3"></i>
                    <p className="text-muted">Chưa có hình ảnh</p>
                    <Link to={`/owner/courts/edit/${id}`} className="btn btn-sm btn-primary">
                      Thêm ảnh
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal form sân con */}
        {showSubForm && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{editingSubId ? "Sửa sân con" : "Thêm sân con"}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowSubForm(false)}></button>
                </div>
                <form onSubmit={submitSubCourt}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Tên sân con *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={subFormData.ten_san_con}
                        onChange={(e) => setSubFormData({...subFormData, ten_san_con: e.target.value})}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Thông tin</label>
                      <textarea
                        className="form-control"
                        value={subFormData.thong_tin_san}
                        onChange={(e) => setSubFormData({...subFormData, thong_tin_san: e.target.value})}
                        rows="3"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Trạng thái</label>
                      <select
                        className="form-select"
                        value={subFormData.trang_thai}
                        onChange={(e) => setSubFormData({...subFormData, trang_thai: e.target.value})}
                      >
                        <option value="hoat_dong">Hoạt động</option>
                        <option value="bao_tri">Bảo trì</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Giá cơ bản (VNĐ) *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={subFormData.gia_co_ban}
                        onChange={(e) => setSubFormData({...subFormData, gia_co_ban: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowSubForm(false)}>
                      Hủy
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {editingSubId ? "Cập nhật" : "Thêm"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </OwnerLayout>
  );
}
