// @ts-nocheck
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import OwnerLayout from "../../layouts/OwnerLayout";
import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Tag,
  Table,
  Button,
  Spin,
  Descriptions,
  message,
  Modal,
  Result
} from 'antd';
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const COLORS = {
  success: '#059669',
  warning: '#D97706',
  danger: '#EF4444',
};

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await api.get(`/bookings/${id}`);
      if (res.data.success) {
        setBooking(res.data);
      } else {
        message.error(res.data.message || "Không thể tải đơn");
        navigate("/owner/orders/count");
      }
    } catch (e) {
      console.error(e);
      message.error("Lỗi khi tải chi tiết đơn");
      navigate("/owner/orders/count");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel() {
    Modal.confirm({
      title: 'Xác nhận hủy đơn',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn hủy đơn đặt sân này?',
      okText: 'Hủy đơn',
      okType: 'danger',
      cancelText: 'Không',
      onOk: async () => {
        try {
          const res = await api.put(`/bookings/${id}/cancel`);
          if (res.data.success) {
            message.success("Hủy đơn thành công");
            load();
          } else {
            message.error(res.data.message || "Không thể hủy đơn");
          }
        } catch (e) {
          console.error(e);
          message.error("Lỗi khi hủy đơn");
        }
      }
    });
  }

  async function handleUpdateStatus(newStatus) {
    const statusText = {
      'dang_su_dung': 'Đang sử dụng',
      'hoan_thanh': 'Hoàn thành'
    };

    Modal.confirm({
      title: 'Xác nhận cập nhật trạng thái',
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn chuyển đơn sang trạng thái "${statusText[newStatus]}"?`,
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const res = await api.put(`/bookings/${id}/status`, {
            trang_thai: newStatus
          });
          if (res.data.success) {
            message.success("Cập nhật trạng thái thành công");
            load();
          } else {
            message.error(res.data.message || "Không thể cập nhật trạng thái");
          }
        } catch (e) {
          console.error(e);
          message.error(e.response?.data?.message || "Lỗi khi cập nhật trạng thái");
        }
      }
    });
  }

  useEffect(() => { load(); }, [id]);

  const getStatusConfig = (status) => {
    const configs = {
      'tam_giu': { color: 'warning', icon: <ClockCircleOutlined />, text: 'Tạm giữ' },
      'da_coc': { color: 'processing', icon: <DollarOutlined />, text: 'Đã đặt cọc' },
      'da_xac_nhan': { color: 'blue', icon: <CheckCircleOutlined />, text: 'Đã xác nhận' },
      'dang_su_dung': { color: 'cyan', icon: <ClockCircleOutlined />, text: 'Đang sử dụng' },
      'hoan_thanh': { color: 'success', icon: <CheckCircleOutlined />, text: 'Hoàn thành' },
      'da_huy': { color: 'error', icon: <CloseCircleOutlined />, text: 'Đã hủy' },
    };
    return configs[status] || { color: 'default', icon: null, text: status };
  };

  const getPaymentMethodText = (method) => {
    const methods = {
      'chuyen_khoan': 'Chuyển khoản',
      'tien_mat': 'Tiền mặt',
      'vnpay': 'VNPay',
    };
    return methods[method] || method || 'Chưa xác định';
  };

  if (loading) {
    return (
      <OwnerLayout>
        <div className="flex items-center justify-center" style={{ minHeight: 400 }}>
          <Spin size="large" />
        </div>
      </OwnerLayout>
    );
  }

  if (!booking || !booking.don) {
    return (
      <OwnerLayout>
        <Result status="404" title="Không tìm thấy đơn" subTitle="Đơn đặt sân không tồn tại hoặc đã bị xóa" extra={<Button type="primary" onClick={() => navigate("/owner/orders/count")}>Quay lại</Button>} />
      </OwnerLayout>
    );
  }

  const { don, chi_tiet, customer } = booking;
  const statusConfig = getStatusConfig(don.trang_thai_don);

  const columns = [
    { 
      title: 'Mã chi tiết', 
      dataIndex: 'ma_chi_tiet', 
      key: 'ma_chi_tiet', 
      render: (val) => <Text strong>#{val}</Text> 
    },
    { 
      title: 'Sân con', 
      dataIndex: 'san_con', 
      key: 'san_con', 
      render: (sanCon, record) => sanCon?.ten_san_con || `Sân #${record.ma_san_con}` 
    },
    { 
      title: 'Khung giờ', 
      dataIndex: 'khung_gio', 
      key: 'khung_gio', 
      render: (khungGio, record) => {
        if (khungGio?.gio_bat_dau && khungGio?.gio_ket_thuc) {
          return `${khungGio.gio_bat_dau.slice(0, 5)} - ${khungGio.gio_ket_thuc.slice(0, 5)}`;
        }
        return `Khung #${record.ma_khung_gio}`;
      }
    },
    { 
      title: 'Ngày đặt', 
      dataIndex: 'ngay_dat_san', 
      key: 'ngay_dat_san', 
      render: (val) => dayjs(val).format('DD/MM/YYYY') 
    },
    { 
      title: 'Đơn giá', 
      dataIndex: 'don_gia', 
      key: 'don_gia', 
      align: 'right', 
      render: (val) => <Text strong style={{ color: COLORS.success }}>{Number(val || 0).toLocaleString('vi-VN')} đ</Text> 
    },
  ];

  return (
    <OwnerLayout>
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <div className="flex items-center justify-between">
          <div>
            <Title level={4} style={{ margin: 0 }}>Chi tiết đơn #{don.ma_don}</Title>
            <Text type="secondary">Xem thông tin chi tiết đơn đặt sân</Text>
          </div>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/owner/orders/count")}>Quay lại</Button>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={18}>
            <Card title="Thông tin đơn hàng" bordered={false} size="small">
              <Descriptions column={{ xs: 1, sm: 2 }} size="small" bordered>
                <Descriptions.Item label="Mã đơn">#{don.ma_don}</Descriptions.Item>
                <Descriptions.Item label="Trạng thái"><Tag color={statusConfig.color} icon={statusConfig.icon}>{statusConfig.text}</Tag></Descriptions.Item>
                <Descriptions.Item label="Mã khách hàng">#{don.ma_nguoi_dung}</Descriptions.Item>
                <Descriptions.Item label="Tên khách hàng">{customer?.ten || 'Chưa cập nhật'}</Descriptions.Item>
                <Descriptions.Item label="Email">{customer?.email || 'Chưa cập nhật'}</Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">{customer?.so_dien_thoai || 'Chưa cập nhật'}</Descriptions.Item>
                <Descriptions.Item label="Địa chỉ" span={2}>{customer?.dia_chi || 'Chưa cập nhật'}</Descriptions.Item>
                <Descriptions.Item label="Thời điểm tạo">{dayjs(don.thoi_diem_tao).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
                <Descriptions.Item label="Hình thức TT">{getPaymentMethodText(don.hinh_thuc_thanh_toan)}</Descriptions.Item>
                <Descriptions.Item label="Tổng tiền"><Text strong>{Number(don.tong_tien || 0).toLocaleString('vi-VN')} đ</Text></Descriptions.Item>
                <Descriptions.Item label="Đã thanh toán">{Number(don.da_thanh_toan || 0).toLocaleString('vi-VN')} đ</Descriptions.Item>
                <Descriptions.Item label="Còn lại" span={2}><Text type="danger">{(Number(don.tong_tien || 0) - Number(don.da_thanh_toan || 0)).toLocaleString('vi-VN')} đ</Text></Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="Chi tiết đặt sân" bordered={false} size="small" style={{ marginTop: 16 }}>
              <Table 
                columns={columns} 
                dataSource={chi_tiet || []} 
                pagination={false} 
                rowKey="ma_chi_tiet" 
                size="small" 
                bordered
                locale={{ emptyText: 'Không có chi tiết' }}
              />
            </Card>
          </Col>

          <Col xs={24} lg={6}>
            <Space direction="vertical" style={{ width: '100%' }} size={8}>
              {/* Cập nhật trạng thái */}
              {don.trang_thai_don === "da_xac_nhan" && (
                <Card bordered={false} size="small" title="Cập nhật trạng thái">
                  <Button type="primary" block onClick={() => handleUpdateStatus('dang_su_dung')}>
                    Chuyển sang Đang sử dụng
                  </Button>
                </Card>
              )}
              
              {don.trang_thai_don === "dang_su_dung" && (
                <Card bordered={false} size="small" title="Cập nhật trạng thái">
                  <Button type="primary" block onClick={() => handleUpdateStatus('hoan_thanh')}>
                    Chuyển sang Hoàn thành
                  </Button>
                </Card>
              )}

              {/* Hủy đơn */}
              {don.trang_thai_don !== "da_huy" && don.trang_thai_don !== "hoan_thanh" && (
                <Card bordered={false} size="small">
                  <Button danger block onClick={handleCancel}>Hủy đơn</Button>
                </Card>
              )}
            </Space>
          </Col>
        </Row>
      </Space>
    </OwnerLayout>
  );
}
