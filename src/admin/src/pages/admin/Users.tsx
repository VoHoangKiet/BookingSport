// @ts-nocheck
import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminLayout from "../../layouts/AdminLayout";
import { 
  Table, 
  Input, 
  Select, 
  Button, 
  Tag, 
  Avatar, 
  Space, 
  Typography, 
  Card, 
  Popconfirm, 
  message,
  Col,
  Row
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  UserOutlined, 
  SafetyOutlined, 
  TeamOutlined, 
  SwapOutlined 
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Search } = Input;

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [filterRole, setFilterRole] = useState("all");

  async function load() {
    setLoading(true);
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data.users || []);
      setFilteredUsers(res.data.users || []);
    } catch (e) { 
      console.error(e); 
      message.error("Không thể tải danh sách người dùng");
    } finally { 
      setLoading(false); 
    }
  }

  useEffect(() => { load(); }, []);

  useEffect(() => {
    let result = [...users];
    if (filterRole !== "all") result = result.filter(u => u.loai_tai_khoan === filterRole);
    if (searchTerm) {
      result = result.filter(u =>
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.ten?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (sortBy === "id") result.sort((a, b) => a.ma_nguoi_dung - b.ma_nguoi_dung);
    else if (sortBy === "name") result.sort((a, b) => (a.ten || "").localeCompare(b.ten || ""));
    setFilteredUsers(result);
  }, [users, searchTerm, sortBy, filterRole]);

  async function toggleRole(id) {
    try {
      await api.put(`/admin/users/${id}/toggle-role`);
      message.success("Chuyển role thành công");
      await load();
    } catch (e) { 
      console.error(e); 
      message.error("Lỗi khi chuyển role");
    }
  }

  const getRoleTag = (role) => {
    switch (role) {
      case 'admin': return <Tag color="gold" icon={<SafetyOutlined />}>Admin</Tag>;
      case 'chu_san': return <Tag color="blue" icon={<TeamOutlined />}>Chủ sân</Tag>;
      default: return <Tag color="default" icon={<UserOutlined />}>Khách</Tag>;
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'ma_nguoi_dung',
      key: 'ma_nguoi_dung',
      width: 80,
      render: (id) => <Text type="secondary">{id}</Text>
    },
    {
      title: 'Thông tin',
      key: 'info',
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} src={record.avatar_url} />
          <Space direction="vertical" size={0}>
            <Text strong block>{record.ten || 'N/A'}</Text>
            <Text type="secondary" size="small">{record.email}</Text>
          </Space>
        </Space>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      responsive: ['md'],
    },
    {
      title: 'Vai trò',
      dataIndex: 'loai_tai_khoan',
      key: 'loai_tai_khoan',
      render: (role) => getRoleTag(role)
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      align: 'right',
      render: (_, record) => (
        <Popconfirm
          title="Chuyển đổi vai trò"
          description="Bạn có hắc chắn muốn chuyển đổi role cho người dùng này?"
          onConfirm={() => toggleRole(record.ma_nguoi_dung)}
          okText="Đồng ý"
          cancelText="Hủy"
        >
          <Button 
            type="text" 
            icon={<SwapOutlined />} 
            size="small"
          >
            Đổi vai trò
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const resetFilters = () => {
    setSearchTerm("");
    setSortBy("id");
    setFilterRole("all");
  };

  return (
    <AdminLayout>
      <Space direction="vertical" size={24} style={{ width: '100%' }}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Title level={4} style={{ margin: 0 }}>Người dùng</Title>
            <Text type="secondary">Quản lý và cập nhật quyền hạn tài khoản</Text>
          </div>
          <Text type="secondary" size="small">{filteredUsers.length} người dùng</Text>
        </div>

        {/* Filters Card */}
        <Card bordered={false} className="shadow-sm">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={8}>
              <Search
                placeholder="Tìm theo tên, email..."
                allowClear
                onSearch={setSearchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
                style={{ width: '100%' }}
              />
            </Col>
            <Col xs={24} sm={16}>
              <Space wrap>
                <Select
                  value={sortBy}
                  onChange={setSortBy}
                  style={{ width: 140 }}
                  options={[
                    { value: 'id', label: 'Sắp xếp: ID' },
                    { value: 'name', label: 'Sắp xếp: Tên' },
                  ]}
                />
                <Select
                  value={filterRole}
                  onChange={setFilterRole}
                  style={{ width: 140 }}
                  options={[
                    { value: 'all', label: 'Tất cả role' },
                    { value: 'chu_san', label: 'Chủ sân' },
                    { value: 'khach_hang', label: 'Khách hàng' },
                    { value: 'admin', label: 'Admin' },
                  ]}
                />
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={resetFilters}
                >
                  Làm mới
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Table Card */}
        <Card bordered={false} className="shadow-sm" bodyStyle={{ padding: 0 }}>
          <Table 
            columns={columns} 
            dataSource={filteredUsers} 
            loading={loading}
            rowKey="ma_nguoi_dung"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50'],
              showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} người dùng`,
              position: ['bottomCenter']
            }}
          />
        </Card>
      </Space>
    </AdminLayout>
  );
}