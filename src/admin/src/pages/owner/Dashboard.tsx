//@ts-nocheck
import React, { useEffect, useState } from "react";
import api from "../../services/api";
import OwnerLayout from "../../layouts/OwnerLayout";
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Select, 
  DatePicker, 
  Typography, 
  Space, 
  Spin, 
  Alert,
  Table,
  Tag,
  Progress
} from 'antd';
import {
  EnvironmentOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  ShoppingOutlined
} from "@ant-design/icons";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import dayjs from "dayjs";

const { Title, Text } = Typography;

// Chart colors
const COLORS = {
  primary: '#059669',
  secondary: '#6B7280',
  success: '#059669',
  warning: '#D97706',
  danger: '#EF4444',
  info: '#3B82F6',
  muted: '#9CA3AF',
  grid: '#F3F4F6'
};

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Card size="small" style={{ border: '1px solid #f0f0f0', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Text type="secondary" style={{ fontSize: 12 }}>{label}</Text>
        {payload.map((entry, index) => (
          <div key={index} style={{ fontWeight: 500, color: '#111827', marginTop: 4 }}>
            {entry.name}: {entry.value?.toLocaleString('de-DE')}
          </div>
        ))}
      </Card>
    );
  }
  return null;
};

export default function OwnerDashboard() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState(null);

  const [period, setPeriod] = useState("day");
  const [dateValue, setDateValue] = useState(dayjs());

  // Sample chart data
  const revenueData = [
    { name: 'T2', revenue: 2200000, bookings: 8 },
    { name: 'T3', revenue: 1800000, bookings: 6 },
    { name: 'T4', revenue: 2500000, bookings: 9 },
    { name: 'T5', revenue: 2100000, bookings: 7 },
    { name: 'T6', revenue: 3200000, bookings: 12 },
    { name: 'T7', revenue: 4500000, bookings: 16 },
    { name: 'CN', revenue: 4000000, bookings: 14 },
  ];

  const bookingStatusData = [
    { name: 'Hoàn thành', value: 65, color: COLORS.success },
    { name: 'Đang chờ', value: 20, color: COLORS.warning },
    { name: 'Đã hủy', value: 15, color: COLORS.danger },
  ];

  const timeSlotData = [
    { slot: '06:00-08:00', count: 12 },
    { slot: '08:00-10:00', count: 18 },
    { slot: '10:00-12:00', count: 8 },
    { slot: '14:00-16:00', count: 15 },
    { slot: '16:00-18:00', count: 25 },
    { slot: '18:00-20:00', count: 30 },
    { slot: '20:00-22:00', count: 22 },
  ];

  useEffect(() => {
    let mounted = true;

    async function load() {
      let params = { period };
      if (period === "day") params.date = dateValue.format("YYYY-MM-DD");
      else if (period === "month") params.month = dateValue.format("YYYY-MM");
      else if (period === "year") params.year = dateValue.format("YYYY");

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
  }, [period, dateValue]);

  const stats = [
    { title: 'Tổng sân', value: overview?.totals?.sands ?? 0, icon: <EnvironmentOutlined />, trend: '+2', up: true, color: COLORS.info },
    { title: 'Tổng đơn đặt', value: overview?.totals?.orders ?? 0, icon: <ShoppingOutlined />, trend: '+24%', up: true, color: COLORS.warning },
    { title: 'Doanh thu', value: overview?.totals?.revenue ?? 0, icon: <DollarOutlined />, trend: '+15%', up: true, color: COLORS.success, isPrice: true },
    { title: 'Tỷ lệ hoàn thành', value: 85, icon: <CheckCircleOutlined />, trend: '+5%', up: true, color: COLORS.primary, suffix: '%' },
  ];

  const recentBookings = [
    { key: 1, id: 'ĐH001', court: 'Sân A1', customer: 'Nguyễn Văn A', time: '18:00-20:00', date: '16/01/2026', status: 'completed', amount: 200000 },
    { key: 2, id: 'ĐH002', court: 'Sân B2', customer: 'Trần Văn B', time: '08:00-10:00', date: '16/01/2026', status: 'pending', amount: 150000 },
    { key: 3, id: 'ĐH003', court: 'Sân A1', customer: 'Lê Thị C', time: '16:00-18:00', date: '15/01/2026', status: 'completed', amount: 200000 },
    { key: 4, id: 'ĐH004', court: 'Sân C1', customer: 'Phạm Văn D', time: '20:00-22:00', date: '15/01/2026', status: 'cancelled', amount: 180000 },
  ];

  const bookingColumns = [
    { title: 'Mã đơn', dataIndex: 'id', key: 'id', render: (text) => <Text strong>{text}</Text> },
    { title: 'Sân', dataIndex: 'court', key: 'court' },
    { title: 'Khách hàng', dataIndex: 'customer', key: 'customer' },
    { title: 'Khung giờ', dataIndex: 'time', key: 'time' },
    { title: 'Ngày', dataIndex: 'date', key: 'date' },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => {
        const config = {
          completed: { color: 'success', icon: <CheckCircleOutlined />, text: 'Hoàn thành' },
          pending: { color: 'warning', icon: <SyncOutlined spin />, text: 'Đang chờ' },
          cancelled: { color: 'error', icon: <CloseCircleOutlined />, text: 'Đã hủy' },
        };
        const { color, icon, text } = config[status] || config.pending;
        return <Tag color={color} icon={icon}>{text}</Tag>;
      }
    },
    { title: 'Số tiền', dataIndex: 'amount', key: 'amount', align: 'right', render: (val) => <Text strong style={{ color: COLORS.success }}>{val.toLocaleString('de-DE')} đ</Text> },
  ];

  return (
    <OwnerLayout>
      <Space direction="vertical" size={24} style={{ width: '100%' }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <Title level={4} style={{ margin: 0 }}>Dashboard</Title>
            <Text type="secondary">Tổng quan hoạt động sân của bạn</Text>
          </div>
          <Space>
            <Select value={period} onChange={setPeriod} style={{ width: 100 }} options={[{ value: 'day', label: 'Ngày' }, { value: 'month', label: 'Tháng' }, { value: 'year', label: 'Năm' }]} />
            <DatePicker value={dateValue} onChange={setDateValue} picker={period === 'day' ? 'date' : period} allowClear={false} />
          </Space>
        </div>

        {error && <Alert message="Lỗi" description={JSON.stringify(error)} type="error" showIcon closable />}

        <Spin spinning={loading}>
          <Space direction="vertical" size={24} style={{ width: '100%' }}>
            <Row gutter={[16, 16]}>
              {stats.map((stat, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
                    <Statistic
                      title={<Text type="secondary" strong>{stat.title}</Text>}
                      value={stat.value}
                      formatter={(val) => stat.isPrice ? `${(val/1000000).toFixed(1)}M` : val.toLocaleString('de-DE')}
                      prefix={React.cloneElement(stat.icon, { style: { color: stat.color, marginRight: 8 } })}
                      suffix={!stat.isPrice && stat.suffix}
                      valueStyle={{ fontWeight: 700 }}
                    />
                    <div className="flex items-center gap-1 mt-2 text-xs">
                      {stat.up ? <ArrowUpOutlined style={{ color: COLORS.success }} /> : <ArrowDownOutlined style={{ color: COLORS.danger }} />}
                      <Text strong style={{ color: stat.up ? COLORS.success : COLORS.danger }}>{stat.trend}</Text>
                      <Text type="secondary" style={{ marginLeft: 4 }}>vs kỳ trước</Text>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24} lg={16}>
                <Card title="Doanh thu theo ngày" bordered={false} className="shadow-sm">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.15}/>
                          <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
                      <XAxis dataKey="name" stroke={COLORS.muted} fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke={COLORS.muted} fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v/1000000}M`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="revenue" stroke={COLORS.primary} strokeWidth={2} fill="url(#colorRevenue)" name="Doanh thu (đ)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
              <Col xs={24} lg={8}>
                <Card title="Trạng thái đơn đặt" bordered={false} className="shadow-sm">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={bookingStatusData} cx="50%" cy="45%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                        {bookingStatusData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24} lg={10}>
                <Card title="Lượt đặt theo khung giờ" bordered={false} className="shadow-sm">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={timeSlotData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} horizontal={false} />
                      <XAxis type="number" stroke={COLORS.muted} fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis type="category" dataKey="slot" stroke={COLORS.muted} fontSize={11} tickLine={false} axisLine={false} width={80} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="count" fill={COLORS.info} radius={[0, 4, 4, 0]} name="Lượt đặt" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
              <Col xs={24} lg={14}>
                <Card title="Đơn đặt gần đây" bordered={false} className="shadow-sm">
                  <Table columns={bookingColumns} dataSource={recentBookings} pagination={false} size="small" scroll={{ x: 600 }} />
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Card bordered={false} className="shadow-sm">
                  <Text type="secondary">Tỷ lệ lấp đầy sân</Text>
                  <Progress percent={72} strokeColor={COLORS.primary} style={{ marginTop: 8 }} />
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card bordered={false} className="shadow-sm">
                  <Text type="secondary">Tỷ lệ đặt thành công</Text>
                  <Progress percent={85} strokeColor={COLORS.success} style={{ marginTop: 8 }} />
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card bordered={false} className="shadow-sm">
                  <Text type="secondary">Đánh giá trung bình</Text>
                  <Progress percent={90} strokeColor={COLORS.warning} format={() => '4.5/5 ⭐'} style={{ marginTop: 8 }} />
                </Card>
              </Col>
            </Row>
          </Space>
        </Spin>
      </Space>
    </OwnerLayout>
  );
}