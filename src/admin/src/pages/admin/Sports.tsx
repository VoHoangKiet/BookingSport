// @ts-nocheck
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState , useCallback} from "react";
import api from "../../services/api";
import AdminLayout from "../../layouts/AdminLayout";


export default function SportsAdmin() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [info, setInfo] = useState("");
  const [editingId, setEditingId] = useState(null);

  const load = useCallback(async () => {
    try {
      const res = await api.get("/sports");
      const sorted = (res.data.data || []).sort((a, b) => a.ma_bo_mon - b.ma_bo_mon);
      setItems(sorted);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function create() {
    try {
      await api.post("/sports", { ten_bo_mon: name, thong_tin_bo_mon: info });
      setName(""); setInfo("");
      await load();
    } catch (e) { 
        console.error(e);
        alert("Lỗi khi tạo"); }
  }

  async function update(id) {
    try {
      await api.put(`/sports/${id}`, { ten_bo_mon: name, thong_tin_bo_mon: info });
      setName(""); setInfo(""); setEditingId(null);
      await load();
    } catch (e) { 
        console.error(e);
        alert("Lỗi khi cập nhật"); }
  }

  function startEdit(item) {
    setEditingId(item.ma_bo_mon);
    setName(item.ten_bo_mon);
    setInfo(item.thong_tin_bo_mon);
  }

  function cancelEdit() {
    setEditingId(null);
    setName("");
    setInfo("");
  }

  async function remove(id) {
    if (!confirm("Xoá bộ môn?")) return;
    try {
      await api.delete(`/sports/${id}`);
      await load();
    } catch (e) { 
        console.error(e);
        alert("Lỗi khi xoá"); }
  }

  return (
    <AdminLayout>
      <div className="container-fluid py-4">
        <h5>Bộ môn</h5>
        <div className="card mb-3">
          <div className="card-body">
            <div className="row g-2">
              <div className="col-md-4">
                <input className="form-control" placeholder="Tên bộ môn" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="col-md-5">
                <input className="form-control" placeholder="Thông tin" value={info} onChange={e => setInfo(e.target.value)} />
              </div>
              <div className="col-md-3">
                <button className="btn btn-primary" onClick={editingId ? () => update(editingId) : create}>
                  {editingId ? "Cập nhật" : "Thêm"}
                </button>
                {editingId && (
                  <button className="btn btn-secondary ms-2" onClick={cancelEdit}>Hủy</button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <table className="table table-hover">
              <thead><tr><th>ID</th><th>Tên</th><th>Thông tin</th><th>Hành động</th></tr></thead>
              <tbody>
                {items.map(it => (
                  <tr key={it.ma_bo_mon}>
                    <td>{it.ma_bo_mon}</td>
                    <td>{it.ten_bo_mon}</td>
                    <td>{it.thong_tin_bo_mon}</td>
                    <td>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => startEdit(it)}>Sửa</button>
                      <button className="btn btn-sm btn-danger" onClick={() => remove(it.ma_bo_mon)}>Xoá</button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && <tr><td colSpan="4">Không có bộ môn</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}