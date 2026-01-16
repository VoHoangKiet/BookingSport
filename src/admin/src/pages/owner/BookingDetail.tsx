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

  const { don, chi_tiet } = booking;
  const statusConfig = getStatusConfig(don.trang_thai_don);

  const columns = [
    { title: 'Mã chi tiết', dataIndex: 'ma_chi_tiet', key: 'ma_chi_tiet', render: (val) => <Text strong>#{val}</Text> },
    { title: 'Sân con', dataIndex: 'ma_san_con', key: 'ma_san_con', render: (val) => `Sân #${val}` },
    { title: 'Khung giờ', dataIndex: 'ma_khung_gio', key: 'ma_khung_gio', render: (val) => `Khung #${val}` },
    { title: 'Ngày đặt', dataIndex: 'ngay_dat_san', key: 'ngay_dat_san', render: (val) => dayjs(val).format('DD/MM/YYYY') },
    { title: 'Đơn giá', dataIndex: 'don_gia', key: 'don_gia', align: 'right', render: (val) => <Text strong style={{ color: COLORS.success }}>{Number(val || 0).toLocaleString('de-DE')} đ</Text> },
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
                <Descriptions.Item label="Mã người dùng">#{don.ma_nguoi_dung}</Descriptions.Item>
                <Descriptions.Item label="Thời điểm tạo">{dayjs(don.thoi_diem_tao).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
                <Descriptions.Item label="Hình thức TT">{getPaymentMethodText(don.hinh_thuc_thanh_toan)}</Descriptions.Item>
                <Descriptions.Item label="Tổng tiền"><Text strong>{Number(don.tong_tien || 0).toLocaleString('de-DE')} đ</Text></Descriptions.Item>
                <Descriptions.Item label="Đã thanh toán">{Number(don.da_thanh_toan || 0).toLocaleString('de-DE')} đ</Descriptions.Item>
                <Descriptions.Item label="Còn lại"><Text type="danger">{(Number(don.tong_tien || 0) - Number(don.da_thanh_toan || 0)).toLocaleString('de-DE')} đ</Text></Descriptions.Item>
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
            {don.trang_thai_don !== "da_huy" && don.trang_thai_don !== "hoan_thanh" && (
              <Card bordered={false} size="small">
                <Button danger block onClick={handleCancel}>Hủy đơn</Button>
              </Card>
            )}
          </Col>
        </Row>
      </Space>
    </OwnerLayout>
  );
}
