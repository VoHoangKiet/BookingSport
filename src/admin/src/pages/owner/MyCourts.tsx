//@ts-nocheck
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import OwnerLayout from "../../layouts/OwnerLayout";
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Space, 
  Typography, 
  Input, 
  Spin,
  Empty,
  message,
  Tag,
  Image
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EnvironmentOutlined,
  EditOutlined,
  EyeOutlined
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;

export default function MyCourts() {
  const navigate = useNavigate();
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  async function load() {
    setLoading(true);
    try {
      const res = await api.get("/courts/my");
      setCourts(res.data.data || []);
    } catch (e) {
      console.error(e);
      message.error("Lỗi khi tải sân của tôi");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filteredCourts = courts.filter(c => 
    searchText === '' || 
    c.ten_san?.toLowerCase().includes(searchText.toLowerCase()) ||
    c.dia_chi?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <OwnerLayout>
      <Space direction="vertical" size={24} style={{ width: '100%' }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <Title level={4} style={{ margin: 0 }}>Sân của tôi</Title>
            <Text type="secondary">Quản lý các sân thể thao của bạn</Text>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/owner/courts/new')}>
            Thêm sân mới
          </Button>
        </div>

        <Card bordered={false} className="shadow-sm" bodyStyle={{ padding: 16 }}>
          <Input
            placeholder="Tìm theo tên sân, địa chỉ..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300, marginBottom: 16 }}
            allowClear
          />

          <Spin spinning={loading}>
            {filteredCourts.length === 0 ? (
              <Empty 
                description="Bạn chưa có sân nào"
                style={{ padding: 40 }}
              >
                <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/owner/courts/new')}>
                  Thêm sân mới
                </Button>
              </Empty>
            ) : (
              <Row gutter={[16, 16]}>
                {filteredCourts.map(c => (
                  <Col xs={24} sm={12} lg={8} xl={6} key={c.ma_san}>
                    <Card
                      hoverable
                      className="shadow-sm"
                      cover={
                        <div style={{ height: 180, overflow: 'hidden' }}>
                          <Image
                            src={c.anh_san ? c.anh_san.split(',')[0] : "/assets/img/bg1.jpg"}
                            alt={c.ten_san}
                            style={{ width: '100%', height: 180, objectFit: 'cover' }}
                            fallback="/assets/img/bg1.jpg"
                            preview={false}
                          />
                        </div>
                      }
                      actions={[
                        <Button type="text" icon={<EyeOutlined />} onClick={() => navigate(`/owner/courts/${c.ma_san}`)}>Chi tiết</Button>,
                        <Button type="text" icon={<EditOutlined />} onClick={() => navigate(`/owner/courts/${c.ma_san}/edit`)}>Sửa</Button>,
                      ]}
                    >
                      <Meta
                        title={
                          <div className="flex items-center justify-between">
                            <Text strong ellipsis style={{ maxWidth: '70%' }}>{c.ten_san}</Text>
                            <Tag color={c.trang_thai === 'hoat_dong' ? 'success' : 'default'}>
                              {c.trang_thai === 'hoat_dong' ? 'Hoạt động' : 'Tạm ngưng'}
                            </Tag>
                          </div>
                        }
                        description={
                          <Space direction="vertical" size={4} style={{ width: '100%' }}>
                            <div className="flex items-start gap-1">
                              <EnvironmentOutlined style={{ color: '#9CA3AF', marginTop: 3 }} />
                              <Paragraph ellipsis={{ rows: 2 }} style={{ margin: 0, color: '#6B7280', fontSize: 13 }}>
                                {c.dia_chi}
                              </Paragraph>
                            </div>
                            <Text strong style={{ color: '#059669' }}>
                              {Number(c.gia_thue || 0).toLocaleString('de-DE')} đ/giờ
                            </Text>
                          </Space>
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Spin>
        </Card>
      </Space>
    </OwnerLayout>
  );
}