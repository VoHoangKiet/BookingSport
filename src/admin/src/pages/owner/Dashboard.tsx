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
  Alert
} from 'antd';
import {
  EnvironmentOutlined,
  DollarOutlined, 
  ArrowUpOutlined,
  ArrowDownOutlined,
  CheckCircleOutlined,
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

  const [period, setPeriod] = useState("month");
  const [dateValue, setDateValue] = useState(dayjs());

  // Status name mapping
  const STATUS_NAMES = {
    'tam_giu': 'Tạm giữ',
    'da_coc': 'Đã cọc',
    'da_xac_nhan': 'Đã xác nhận',
    'dang_su_dung': 'Đang sử dụng',
    'hoan_thanh': 'Hoàn thành',
    'da_huy': 'Đã hủy',
  };

  // Status colors
  const STATUS_COLORS = {
    'tam_giu': COLORS.muted,
    'da_coc': COLORS.info,
    'da_xac_nhan': COLORS.warning,
    'dang_su_dung': COLORS.primary,
    'hoan_thanh': COLORS.success,
    'da_huy': COLORS.danger,
  };

  // Calculate completion rate
  const calculateCompletionRate = () => {
    if (!overview?.status_distribution || overview.status_distribution.length === 0) return 0;
    const total = overview.status_distribution.reduce((sum, s) => sum + s.count, 0);
    const completed = overview.status_distribution.find(s => s.status === 'hoan_thanh')?.count || 0;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  useEffect(() => {
    let mounted = true;

    async function load() {
      const params = { period };
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
    { title: 'Tổng sân', value: overview?.totals?.sands ?? 0, icon: <EnvironmentOutlined />, color: COLORS.info },
    { title: 'Tổng đơn đặt', value: overview?.totals?.orders ?? 0, icon: <ShoppingOutlined />, color: COLORS.warning },
    { title: 'Doanh thu', value: overview?.totals?.revenue ?? 0, icon: <DollarOutlined />, color: COLORS.success },
    { title: 'Tỷ lệ hoàn thành', value: calculateCompletionRate(), icon: <CheckCircleOutlined />, color: COLORS.primary, suffix: '%' },
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
                      formatter={(val) => stat.isPrice ? `${val.toLocaleString('vi-VN')}đ` : val.toLocaleString('vi-VN')}
                      prefix={React.cloneElement(stat.icon, { style: { color: stat.color, marginRight: 8 } })}
                      suffix={!stat.isPrice && stat.suffix}
                      valueStyle={{ fontWeight: 700 }}
                    />
                    {/* <div className="flex items-center gap-1 mt-2 text-xs">
                      {stat.up ? <ArrowUpOutlined style={{ color: COLORS.success }} /> : <ArrowDownOutlined style={{ color: COLORS.danger }} />}
                      <Text strong style={{ color: stat.up ? COLORS.success : COLORS.danger }}>{stat.trend}</Text>
                      <Text type="secondary" style={{ marginLeft: 4 }}>vs kỳ trước</Text>
                    </div> */}
                  </Card>
                </Col>
              ))}
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24} lg={16}>
                <Card title="Doanh thu theo ngày" bordered={false} className="shadow-sm">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={overview?.daily_revenue || []}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.15}/>
                          <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        stroke={COLORS.muted} 
                        fontSize={11} 
                        tickLine={false} 
                        axisLine={false}
                        tickFormatter={(date) => {
                          const d = dayjs(date);
                          return period === 'month' ? d.format('DD') : d.format('DD/MM');
                        }}
                      />
                      <YAxis stroke={COLORS.muted} fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v.toLocaleString('vi-VN')}đ`} />
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
                      <Pie 
                        data={(overview?.status_distribution || []).map(s => ({
                          name: STATUS_NAMES[s.status] || s.status,
                          value: s.count,
                          fill: STATUS_COLORS[s.status] || COLORS.muted
                        }))} 
                        cx="50%" 
                        cy="45%" 
                        innerRadius={55} 
                        outerRadius={80} 
                        paddingAngle={3} 
                        dataKey="value"
                      >
                        {(overview?.status_distribution || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || COLORS.muted} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Card title="Lượt đặt theo khung giờ" bordered={false} className="shadow-sm">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart 
                      data={(overview?.top_slots || []).map(s => ({
                        slot: `${s.khung?.gio_bat_dau || ''}-${s.khung?.gio_ket_thuc || ''}`,
                        count: s.count
                      }))} 
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} horizontal={false} />
                      <XAxis type="number" stroke={COLORS.muted} fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis type="category" dataKey="slot" stroke={COLORS.muted} fontSize={11} tickLine={false} axisLine={false} width={80} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="count" fill={COLORS.info} radius={[0, 4, 4, 0]} name="Lượt đặt" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>
          </Space>
        </Spin>
      </Space>
    </OwnerLayout>
  );
}