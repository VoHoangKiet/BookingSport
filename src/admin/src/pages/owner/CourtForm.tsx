//@ts-nocheck
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import OwnerLayout from "../../layouts/OwnerLayout";

export default function CourtForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [sports, setSports] = useState([]);
  const [images, setImages] = useState([]); // Array of URL strings only
  const [imageMode, setImageMode] = useState("url"); // "url" hoặc "upload"
  const [formData, setFormData] = useState({
    ten_san: "",
    dia_chi: "",
    anh_san: "",
    ma_bo_mon: ""
  });

  useEffect(() => {
    loadSports();
    if (isEdit) {
      loadCourt();
    }
  }, [id]);

  async function loadSports() {
    try {
      const res = await api.get("/sports");
      setSports(res.data.data || []);
    } catch (e) {
      console.error(e);
    }
  }

  async function loadCourt() {
    try {
      const res = await api.get(`/courts/${id}`);
      if (res.data.success) {
        const courtData = res.data.data.san;
        // Chỉ lấy các field cần thiết
        setFormData({
          ten_san: courtData.ten_san || "",
          dia_chi: courtData.dia_chi || "",
          ma_bo_mon: courtData.ma_bo_mon || "",
          anh_san: ""
        });
        
        // Load ảnh riêng từ endpoint /images
        loadCourtImages();
      }
    } catch (e) {
      console.error(e);
      alert("Lỗi khi tải thông tin sân");
    }
  }

  async function loadCourtImages() {
    try {
      const res = await api.get(`/courts/${id}/images`);
      if (res.data.success && res.data.images) {
        setImages(res.data.images);
      }
    } catch (e) {
      console.error('Error loading images:', e);
      // Không hiển thị alert, chỉ log lỗi
      // Nếu không load được ảnh, để mảng rỗng
    }
  }

  function handleUrlAdd() {
    const urlInput = document.getElementById('imageUrlInput');
    const url = urlInput.value.trim();
    
    if (!url) {
      alert("Vui lòng nhập URL ảnh!");
      return;
    }
    
    // Kiểm tra URL hợp lệ
    try {
      new URL(url);
    } catch (e) {
      alert("URL không hợp lệ!");
      return;
    }
    
    // Kiểm tra số lượng ảnh (tối đa 10 ảnh)
    if (images.length >= 10) {
      alert("Chỉ được thêm tối đa 10 ảnh!");
      return;
    }
    
    setImages([...images, url]);
    urlInput.value = '';
  }

  async function handleFileUpload(e) {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Kiểm tra số lượng ảnh
    if (images.length + files.length > 10) {
      alert("Chỉ được thêm tối đa 10 ảnh!");
      return;
    }
    
    setUploadingImage(true);
    
    try {
      for (const file of files) {
        // Kiểm tra file type
        if (!file.type.startsWith("image/")) {
          alert(`File ${file.name} không phải là ảnh!`);
          continue;
        }
        
        // Kiểm tra file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          alert(`File ${file.name} vượt quá 10MB!`);
          continue;
        }
        
        // Upload lên server (server sẽ upload lên Imgur)
        const formData = new FormData();
        formData.append('file', file);
        
        // const res = await api.post('/upload/image', formData, {
        const res = await api.post('/upload/court-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (res.data.success) {
          setImages(prev => [...prev, res.data.url]);
        } else {
          alert(`Lỗi upload ${file.name}: ${res.data.message}`);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Lỗi khi upload ảnh: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploadingImage(false);
      // Reset input
      e.target.value = '';
    }
  }

  function handleRemoveImage(index) {
    setImages(images.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (images.length === 0) {
      if (!confirm("Bạn chưa thêm ảnh nào. Bạn có muốn tiếp tục không?")) {
        return;
      }
    }
    
    setLoading(true);

    try {
      // Join thành chuỗi phân cách bằng dấu phẩy
      const imageString = images.join(',');

      const dataToSend = {
        ten_san: formData.ten_san,
        dia_chi: formData.dia_chi,
        ma_bo_mon: Number(formData.ma_bo_mon),
        anh_san: imageString
      };

      console.log('Data to send:', dataToSend); // Debug

      if (isEdit) {
        const res = await api.put(`/courts/${id}`, dataToSend);
        console.log('Update response:', res.data); // Debug
        alert("Cập nhật sân thành công!");
      } else {
        const res = await api.post("/courts", dataToSend);
        console.log('Create response:', res.data); // Debug
        alert("Thêm sân thành công!");
      }
      navigate("/owner/courts/my");
    } catch (e) {
      console.error('Submit error:', e);
      console.error('Error response:', e.response?.data);
      alert(e.response?.data?.message || e.message || "Lỗi khi lưu sân");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  return (
    <OwnerLayout>
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-md-8 mx-auto">
            <div className="card">
              <div className="card-header">
                <h5>{isEdit ? "Chỉnh sửa sân" : "Thêm sân mới"}</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Tên sân *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="ten_san"
                      value={formData.ten_san}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Địa chỉ *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="dia_chi"
                      value={formData.dia_chi}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Bộ môn *</label>
                    <select
                      className="form-select"
                      name="ma_bo_mon"
                      value={formData.ma_bo_mon}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Chọn bộ môn --</option>
                      {sports.map(s => (
                        <option key={s.ma_bo_mon} value={s.ma_bo_mon}>
                          {s.ten_bo_mon}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Ảnh sân (Tối đa 10 ảnh)</label>
                    
                    {/* Chọn chế độ */}
                    <div className="btn-group d-flex mb-2" role="group">
                      <button
                        type="button"
                        className={`btn btn-sm ${imageMode === "url" ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => setImageMode("url")}
                      >
                        <i className="fas fa-link me-1"></i>
                        Nhập URL
                      </button>
                      <button
                        type="button"
                        className={`btn btn-sm ${imageMode === "upload" ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => setImageMode("upload")}
                      >
                        <i className="fas fa-upload me-1"></i>
                        Upload từ máy
                      </button>
                    </div>

                    {/* Input theo chế độ */}
                    {imageMode === "url" ? (
                      <div className="input-group mb-2">
                        <input
                          type="text"
                          id="imageUrlInput"
                          className="form-control"
                          placeholder="https://example.com/image.jpg"
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={handleUrlAdd}
                          disabled={images.length >= 10}
                        >
                          Thêm
                        </button>
                      </div>
                    ) : (
                      <div className="mb-2">
                        <input
                          type="file"
                          className="form-control"
                          accept="image/*"
                          multiple
                          onChange={handleFileUpload}
                          disabled={images.length >= 10 || uploadingImage}
                        />
                        {uploadingImage && (
                          <div className="text-primary mt-2">
                            <i className="fas fa-spinner fa-spin me-2"></i>
                            Đang upload...
                          </div>
                        )}
                      </div>
                    )}

                    {/* Gallery preview */}
                    {images.length > 0 && (
                      <div className="row g-2 mt-2">
                        {images.map((url, index) => (
                          <div key={index} className="col-4 col-md-3">
                            <div className="position-relative">
                              <img 
                                src={url} 
                                alt={`Preview ${index + 1}`} 
                                className="img-thumbnail w-100"
                                style={{ height: "120px", objectFit: "cover" }}
                              />
                              <button
                                type="button"
                                className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                                onClick={() => handleRemoveImage(index)}
                                style={{ padding: "2px 6px", fontSize: "12px" }}
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {images.length === 0 && (
                      <div className="alert alert-info mt-2">
                        Chưa có ảnh nào. Vui lòng thêm ít nhất 1 ảnh.
                      </div>
                    )}
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? "Đang lưu..." : (isEdit ? "Cập nhật" : "Thêm sân")}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => navigate("/owner/courts/my")}
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
}
