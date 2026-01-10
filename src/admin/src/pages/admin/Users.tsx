//@ts-nocheck
import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminLayout from "../../layouts/AdminLayout";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("id"); // id | name
  const [filterRole, setFilterRole] = useState("all"); // all | admin | chu_san | khach_hang

  async function load() {
    setLoading(true);
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data.users || []);
      setFilteredUsers(res.data.users || []);
    } catch (e) {
      console.error(e);
      alert("Lỗi khi tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  useEffect(() => {
    let result = [...users];

    // Filter by role
    if (filterRole !== "all") {
      result = result.filter(u => u.loai_tai_khoan === filterRole);
    }

    // Search
    if (searchTerm) {
      result = result.filter(u => 
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.ten?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.dia_chi?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    if (sortBy === "id") {
      result.sort((a, b) => a.ma_nguoi_dung - b.ma_nguoi_dung);
    } else if (sortBy === "name") {
      result.sort((a, b) => (a.ten || "").localeCompare(b.ten || ""));
    }

    setFilteredUsers(result);
  }, [users, searchTerm, sortBy, filterRole]);

  async function toggleRole(id) {
    if (!confirm("Chắc chắn muốn chuyển role?")) return;
    try {
      await api.put(`/admin/users/${id}/toggle-role`);
      await load();
    } catch (e ) {
      console.error(e);
      alert("Lỗi khi chuyển role");
    }
  }

  // NOTE: backend chưa có /admin/users/:id/deactivate => implement backend hoặc thay đổi
//   async function deactivateUser(id) {
//     if (!confirm("Khoá tài khoản này?")) return;
//     try {
//       // placeholder: backend cần endpoint này
//       await api.put(`/admin/users/${id}/deactivate`);
//       await load();
//     } catch (e) {
//         console.error(e);
//       alert("Lỗi khi khoá user (backend cần endpoint /admin/users/:id/deactivate)");
//     }
//   }

  return (
    <AdminLayout>
      <div className="container-fluid py-4">
        <h5>Danh sách người dùng</h5>
        
        {/* Search, Sort, Filter */}
        <div className="card mb-3">
          <div className="card-body">
            <div className="row g-2">
              <div className="col-md-4">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Tìm kiếm theo email, tên, địa chỉ..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="id">Sắp xếp theo ID</option>
                  <option value="name">Sắp xếp theo Tên</option>
                </select>
              </div>
              <div className="col-md-3">
                <select className="form-select" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                  <option value="all">Tất cả loại tài khoản</option>
                  
                  <option value="chu_san">Chủ sân</option>
                  <option value="khach_hang">Khách hàng</option>
                </select>
              </div>
              <div className="col-md-2">
                <button className="btn btn-secondary w-100" onClick={() => { setSearchTerm(""); setSortBy("id"); setFilterRole("all"); }}>
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading ? <div>Loading...</div> : (
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Email</th>
                      <th>Tên</th>
                      <th>Địa chỉ</th>
                      <th>Loại tài khoản</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.ma_nguoi_dung}>
                        <td>{u.ma_nguoi_dung}</td>
                        <td>{u.email}</td>
                        <td>{u.ten}</td>
                        <td>{u.dia_chi || "-"}</td>
                        <td>
                          <span className={`badge ${
                            u.loai_tai_khoan === 'admin' ? 'bg-danger' : 
                            u.loai_tai_khoan === 'chu_san' ? 'bg-primary' : 
                            'bg-secondary'
                          }`}>
                            {u.loai_tai_khoan}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-2" onClick={() => toggleRole(u.ma_nguoi_dung)}>Chuyển role</button>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && <tr><td colSpan="6" className="text-center">Không tìm thấy người dùng</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}