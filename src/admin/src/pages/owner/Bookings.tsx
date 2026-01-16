// @ts-nocheck
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import OwnerLayout from "../../layouts/OwnerLayout";
import { 
  Card, 
  Table, 
  Tag, 
  Button, 
  Space, 
  Typography, 
  Input, 
  DatePicker,
  Select,
  Empty,
  message
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  PlayCircleOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const COLORS = {
  success: '#059669',
  warning: '#D97706',
  danger: '#EF4444',
};

export default function OwnerBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [dateFilter, setDateFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  async function load(date) {
    setLoading(true);
    try {
      const res = await api.get("/bookings/owner/list", { params: { date } });
      setBookings(res.data.data || []);
    } catch (e) {
      console.error(e);
      message.error("Lỗi khi tải đơn đặt");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const getStatusConfig = (status) => {
    const configs = {
      'tam_giu': { color: 'warning', icon: <ClockCircleOutlined />, text: 'Tạm giữ' },
      'da_coc': { color: 'processing', icon: <DollarOutlined />, text: 'Đã cọc' },
      'da_xac_nhan': { color: 'success', icon: <CheckCircleOutlined />, text: 'Đã xác nhận' },
      'dang_su_dung': { color: 'blue', icon: <PlayCircleOutlined />, text: 'Đang sử dụng' },
      'hoan_thanh': { color: 'success', icon: <CheckCircleOutlined />, text: 'Hoàn thành' },
      'da_huy': { color: 'error', icon: <CloseCircleOutlined />, text: 'Đã hủy' },
    };
    return configs[status] || { color: 'default', icon: null, text: status };
  };

  const columns = [
    { 
      title: 'Mã đơn', 
      dataIndex: ['don', 'ma_don'], 
      key: 'ma_don',
      render: (text) => <Text strong>#{text}</Text>,
      width: 100
    },
    { 
      title: 'Thời điểm tạo', 
      dataIndex: ['don', 'thoi_diem_tao'], 
      key: 'thoi_diem_tao',
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY HH:mm') : 'N/A'
    },
    { 
      title: 'Tổng tiền', 
      dataIndex: ['don', 'tong_tien'], 
      key: 'tong_tien',
      align: 'right',
      render: (val) => <Text strong style={{ color: COLORS.success }}>{Number(val || 0).toLocaleString('de-DE')} đ</Text>
    },
    { 
      title: 'Đã thanh toán', 
      dataIndex: ['don', 'da_thanh_toan'], 
      key: 'da_thanh_toan',
      align: 'right',
      render: (val) => <Text>{Number(val || 0).toLocaleString('de-DE')} đ</Text>
    },
    { 
      title: 'Hình thức TT', 
      dataIndex: ['don', 'hinh_thuc_thanh_toan'], 
      key: 'hinh_thuc_thanh_toan',
      render: (val) => {
        const labels = {
          'tien_mat': 'Tiền mặt',
          'chuyen_khoan': 'Chuyển khoản'
        };
        return labels[val] || val;
      }
    },
    { 
      title: 'Trạng thái', 
      dataIndex: ['don', 'trang_thai_don'], 
      key: 'trang_thai',
      render: (status) => {
        const { color, icon, text } = getStatusConfig(status);
        return <Tag color={color} icon={icon}>{text}</Tag>;
      }
    },
    { 
      title: 'Thao tác', 
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button 
          type="primary" 
          ghost 
          size="small" 
          icon={<EyeOutlined />}
          onClick={() => navigate(`/owner/dat-san/${record.don.ma_don}`)}
        >
          Xem
        </Button>
      )
    },
  ];

  const filteredBookings = bookings.filter(b => {
    const matchSearch = searchText === '' || 
      b.don?.ma_don?.toString().includes(searchText);
    
    const matchStatus = statusFilter === 'all' || b.don?.trang_thai_don === statusFilter;
    
    return matchSearch && matchStatus;
  });

  return (
    <OwnerLayout>
      <Space direction="vertical" size={24} style={{ width: '100%' }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>Đơn đặt sân</Title>
          <Text type="secondary">Quản lý các đơn đặt sân của bạn</Text>
        </div>

        <Card bordered={false} className="shadow-sm">
          <div style={{ marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Input
              placeholder="Tìm theo mã đơn..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
              allowClear
            />
            <DatePicker 
              placeholder="Lọc theo ngày"
              onChange={(date) => {
                setDateFilter(date);
                if (date) load(date.format('YYYY-MM-DD'));
                else load();
              }}
              style={{ width: 150 }}
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 160 }}
              options={[
                { value: 'all', label: 'Tất cả trạng thái' },
                { value: 'tam_giu', label: 'Tạm giữ' },
                { value: 'da_coc', label: 'Đã cọc' },
                { value: 'da_xac_nhan', label: 'Đã xác nhận' },
                { value: 'dang_su_dung', label: 'Đang sử dụng' },
                { value: 'hoan_thanh', label: 'Hoàn thành' },
                { value: 'da_huy', label: 'Đã hủy' },
              ]}
            />
          </div>

          <Table
            columns={columns}
            dataSource={filteredBookings}
            loading={loading}
            rowKey={(record) => record.don?.ma_don}
            pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Tổng ${total} đơn` }}
            locale={{ emptyText: <Empty description="Không có đơn đặt nào" /> }}
            scroll={{ x: 900 }}
          />
        </Card>
      </Space>
    </OwnerLayout>
  );
}