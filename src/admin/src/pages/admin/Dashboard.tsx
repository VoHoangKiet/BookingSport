//@ts-nocheck
import React, { useEffect, useState } from "react";
import api from "../../services/api";
import AdminLayout from "../../layouts/AdminLayout";
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
  List,
  Avatar
} from 'antd';
import {
  UserOutlined,
  BuildOutlined,
  CalendarOutlined,
  LineChartOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined
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

// Chart colors - Muted, professional
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
            {entry.name}: {entry.value?.toLocaleString('vi-VN')}
          </div>
        ))}
      </Card>
    );
  }
  return null;
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState(null);

  const [period, setPeriod] = useState("month");
  const [dateValue, setDateValue] = useState(dayjs());

  // Define color mapping for user types - only show users and owners
  const USER_TYPE_COLORS = {
    // English keys
    'user': '#059669',
    'owner': '#6B7280',
    // Vietnamese keys
    'khach_hang': '#059669',
    'chu_san': '#6B7280',
    // Short keys
    'kh': '#059669',
    'cs': '#6B7280',
  };

  // Helper function to get color
  const getColorForUserType = (ma_loai, ten_loai) => {
    if (!ma_loai && !ten_loai) return '#9CA3AF';
    
    // Direct match by ma_loai
    if (USER_TYPE_COLORS[ma_loai]) {
      return USER_TYPE_COLORS[ma_loai];
    }
    
    // Lowercase match
    const lowerKey = ma_loai ? ma_loai.toLowerCase() : '';
    if (USER_TYPE_COLORS[lowerKey]) {
      return USER_TYPE_COLORS[lowerKey];
    }
    
    // Match by ten_loai (display name)
    const lowerName = ten_loai ? ten_loai.toLowerCase() : '';
    if (lowerName.includes('người dùng') || lowerName.includes('khách')) return '#059669';
    if (lowerName.includes('chủ sân') || lowerName.includes('owner')) return '#6B7280';
    
    // Partial match by ma_loai
    if (lowerKey.includes('user') || lowerKey.includes('khach')) return '#059669';
    if (lowerKey.includes('owner') || lowerKey.includes('chu')) return '#6B7280';
    
    // Default gray
    return '#9CA3AF';
  };

  // Filter function to exclude admin
  const filterUserDistribution = (distribution) => {
    if (!distribution) return [];
    return distribution.filter(u => {
      const ma_loai = (u.ma_loai || '').toLowerCase();
      const ten_loai = (u.ten_loai || '').toLowerCase();
      // Exclude admin/quan_tri
      return !ma_loai.includes('admin') && 
             !ma_loai.includes('quan_tri') && 
             !ma_loai.includes('qt') &&
             !ten_loai.includes('admin') &&
             !ten_loai.includes('quản trị');
    });
  };

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
        const res = await api.get("/admin/stats/overview", { params });
        if (mounted) {
          console.log('Overview data:', res.data);
          console.log('User distribution:', res.data.user_distribution);
          setOverview(res.data);
        }
      } catch (e) {
        console.error(e);
        setError(e?.response?.data || e.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => (mounted = false);
  }, [period, dateValue]);

  const stats = [
    { title: 'Người dùng', value: overview?.totals?.users ?? 0, icon: <UserOutlined />,color: COLORS.success},
    { title: 'Sân', value: overview?.totals?.sands ?? 0, icon: <BuildOutlined />,color: COLORS.info },
    { title: 'Đặt sân', value: overview?.totals?.orders ?? 0, icon: <CalendarOutlined />, color: COLORS.warning},
    { title: 'Doanh thu', value: overview?.totals?.revenue ?? 0, icon: <LineChartOutlined />, color: COLORS.danger, isPrice: true},
  ];

  return (
    <AdminLayout>
      <Space direction="vertical" size={24} style={{ width: '100%' }}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Title level={4} style={{ margin: 0 }}>Thống kê</Title>
            <Text type="secondary">Tổng quan hoạt động hệ thống</Text>
          </div>
          
          <Space>
            <Select 
              value={period} 
              onChange={setPeriod} 
              style={{ width: 100 }}
              options={[
                { value: 'day', label: 'Ngày' },
                { value: 'month', label: 'Tháng' },
                { value: 'year', label: 'Năm' },
              ]}
            />
            <DatePicker 
              value={dateValue} 
              onChange={setDateValue} 
              picker={period === 'day' ? 'date' : period}
              allowClear={false}
            />
          </Space>
        </div>

        {error && <Alert message="Lỗi" description={JSON.stringify(error)} type="error" showIcon closable />}

        <Spin spinning={loading}>
          {overview && (
            <Space direction="vertical" size={24} style={{ width: '100%' }}>
              {/* Stats Grid */}
              <Row gutter={[16, 16]}>
                {stats.map((stat, index) => (
                  <Col xs={24} sm={12} lg={6} key={index}>
                    <Card bordered={false} className="shadow-sm">
                      <Statistic
                        title={<Text type="secondary" strong>{stat.title}</Text>}
                        value={stat.value}
                        formatter={(val) => stat.isPrice ? `${val.toLocaleString('vi-VN')}đ` : val.toLocaleString('vi-VN')}
                        prefix={React.cloneElement(stat.icon, { style: { color: stat.color, marginRight: 8 } })}
                        valueStyle={{ fontWeight: 700 }}
                      />
                      {/* <div className="flex items-center gap-1 mt-2 text-xs">
                        {stat.up ? <ArrowUpOutlined style={{ color: '#059669' }} /> : <ArrowDownOutlined style={{ color: '#ef4444' }} />}
                        <Text strong style={{ color: stat.up ? '#059669' : '#ef4444' }}>{stat.trend}</Text>
                        <Text type="secondary" style={{ marginLeft: 4 }}>vs kỳ trước</Text>
                      </div> */}
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* Charts Grid */}
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                  <Card title="Doanh thu theo ngày" bordered={false} className="shadow-sm">
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={overview.daily_revenue || []}>
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
                        <Area type="monotone" dataKey="revenue" stroke={COLORS.primary} strokeWidth={2} fill="url(#colorRevenue)" name="Doanh thu" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
                <Col xs={24} lg={8}>
                  <Card title="Phân bố người dùng" bordered={false} className="shadow-sm">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie 
                          data={filterUserDistribution(overview.user_distribution).map(u => ({
                            name: u.ten_loai,
                            value: u.count,
                            ma_loai: u.ma_loai,
                            fill: getColorForUserType(u.ma_loai, u.ten_loai)
                          }))} 
                          cx="50%" 
                          cy="45%" 
                          innerRadius={60} 
                          outerRadius={85} 
                          paddingAngle={2} 
                          dataKey="value"
                          // label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {filterUserDistribution(overview.user_distribution).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getColorForUserType(entry.ma_loai, entry.ten_loai)} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend 
                          verticalAlign="bottom" 
                          height={36}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
              </Row>

              {/* Top Lists Grid */}
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Card 
                    title={<Space><ClockCircleOutlined /> Top Khung Giờ</Space>} 
                    bordered={false} 
                    className="shadow-sm"
                  >
                    <List
                      dataSource={overview.top_slots || []}
                      renderItem={(t, index) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={<Avatar size="small" style={{ backgroundColor: '#f0f0f0', color: '#8c8c8c' }}>{index + 1}</Avatar>}
                            title={`${t.khung?.gio_bat_dau} - ${t.khung?.gio_ket_thuc}`}
                            description={`${t.count} lượt đặt`}
                          />
                        </List.Item>
                      )}
                      locale={{ emptyText: <Text type="secondary">Không có dữ liệu</Text> }}
                    />
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card 
                    title={<Space><EnvironmentOutlined /> Top Sân</Space>} 
                    bordered={false} 
                    className="shadow-sm"
                  >
                    <List
                      dataSource={overview.top_courts || []}
                      renderItem={(t, index) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={<Avatar size="small" style={{ backgroundColor: '#f0f0f0', color: '#8c8c8c' }}>{index + 1}</Avatar>}
                            title={t.san?.ten_san || "Sân"}
                            description={t.san?.dia_chi}
                          />
                          <div style={{ textAlign: 'right' }}>
                            <Text strong>{t.count}</Text>
                            <br />
                            <Text type="secondary" size="small">lượt</Text>
                          </div>
                        </List.Item>
                      )}
                      locale={{ emptyText: <Text type="secondary">Không có dữ liệu</Text> }}
                    />
                  </Card>
                </Col>
              </Row>
            </Space>
          )}
        </Spin>
      </Space>
    </AdminLayout>
  );
}