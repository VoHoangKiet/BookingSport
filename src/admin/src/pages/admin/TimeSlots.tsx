// @ts-nocheck
import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminLayout from "../../layouts/AdminLayout";
import { 
  Tabs, 
  Table, 
  Button, 
  Space, 
  Typography, 
  Card, 
  Modal, 
  Form, 
  Input, 
  InputNumber, 
  Row, 
  Col, 
  message,
  DatePicker
} from 'antd';
import { 
  ClockCircleOutlined, 
  CalendarOutlined, 
  DollarOutlined, 
  SaveOutlined, 
  PlusOutlined 
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;

export default function TimeSlotsAdmin() {
  const [slots, setSlots] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [weekSurcharges, setWeekSurcharges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('1');
  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState(false);
  const [holidayForm] = Form.useForm();

  async function loadAll() {
    setLoading(true);
    try {
      const [slotsRes, holRes, weekRes] = await Promise.all([
        api.get("/configs/time-slots"),
        api.get("/configs/holidays"),
        api.get("/configs/week-surcharges"),
      ]);
      setSlots((slotsRes.data.data || []).sort((a, b) => a.ma_khung_gio - b.ma_khung_gio));
      setHolidays(holRes.data.data || []);
      setWeekSurcharges((weekRes.data.data || []).sort((a, b) => {
        const dayA = a.ngay_trong_tuan === 0 ? 7 : a.ngay_trong_tuan;
        const dayB = b.ngay_trong_tuan === 0 ? 7 : b.ngay_trong_tuan;
        return dayA - dayB;
      }));
    } catch (e) { 
      console.error(e); 
      message.error("Lỗi khi tải cấu hình"); 
    } finally { 
      setLoading(false); 
    }
  }

  useEffect(() => { loadAll(); }, []);

  const updateSlots = async () => {
    try { 
      await api.put("/admin/time-slots", slots); 
      message.success("Đã lưu cấu hình khung giờ"); 
      await loadAll(); 
    } catch (e) { 
      console.error(e); 
      message.error("Lỗi khi lưu khung giờ"); 
    }
  };

  const handleAddHoliday = async (values) => {
    try { 
      const payload = {
        ma_ngay_le: values.date.format("YYYY-MM-DD"),
        ten_ngay_le: values.name,
        phi_ngay_le: values.surcharge
      };
      await api.post("/admin/holidays", payload); 
      message.success("Thêm ngày lễ thành công");
      setIsHolidayModalOpen(false);
      holidayForm.resetFields();
      await loadAll(); 
    } catch (e) { 
      console.error(e); 
      message.error("Lỗi khi thêm ngày lễ"); 
    }
  };

  const updateWeekSurcharges = async () => {
    try { 
      await api.put("/admin/week-surcharges", weekSurcharges); 
      message.success("Đã lưu phụ phí tuần"); 
      await loadAll(); 
    } catch (e) { 
      console.error(e); 
      message.error("Lỗi khi lưu phụ phí"); 
    }
  };

  const dayNames = { 1: "Thứ 2", 2: "Thứ 3", 3: "Thứ 4", 4: "Thứ 5", 5: "Thứ 6", 6: "Thứ 7", 0: "Chủ Nhật" };

  const slotColumns = [
    { title: 'ID', dataIndex: 'ma_khung_gio', key: 'ma_khung_gio', width: 80 },
    { 
      title: 'Bắt đầu', 
      key: 'start',
      render: (_, record, idx) => (
        <Input 
          value={record.gio_bat_dau} 
          onChange={(e) => {
            const newSlots = [...slots];
            newSlots[idx].gio_bat_dau = e.target.value;
            setSlots(newSlots);
          }}
          size="small"
        />
      )
    },
    { 
      title: 'Kết thúc', 
      key: 'end',
      render: (_, record, idx) => (
        <Input 
          value={record.gio_ket_thuc} 
          onChange={(e) => {
            const newSlots = [...slots];
            newSlots[idx].gio_ket_thuc = e.target.value;
            setSlots(newSlots);
          }}
          size="small"
        />
      )
    },
    { 
      title: 'Phụ phí (VNĐ)', 
      key: 'surcharge',
      render: (_, record, idx) => (
        <InputNumber
          style={{ width: '100%' }}
          value={record.phu_phi} 
          onChange={(val) => {
            const newSlots = [...slots];
            newSlots[idx].phu_phi = val;
            setSlots(newSlots);
          }}
          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
          size="small"
        />
      )
    },
  ];

  const holidayColumns = [
    { title: 'Ngày', dataIndex: 'ma_ngay_le', key: 'ma_ngay_le' },
    { title: 'Tên ngày lễ', dataIndex: 'ten_ngay_le', key: 'ten_ngay_le', render: (text) => <Text strong>{text}</Text> },
    { 
      title: 'Phụ phí', 
      dataIndex: 'phi_ngay_le', 
      key: 'phi_ngay_le', 
      align: 'right',
      render: (val) => <Text style={{ color: '#059669' }}>{Number(val || 0).toLocaleString('vi-VN')} đ</Text>
    },
  ];

  const tabItems = [
    {
      key: '1',
      label: <Space><ClockCircleOutlined /> Khung giờ</Space>,
      children: (
        <Card bordered={false} bodyStyle={{ padding: 0 }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text type="secondary" size="small">Cập nhật thời gian và phụ phí cho từng khung giờ</Text>
            <Button type="primary" icon={<SaveOutlined />} onClick={updateSlots}>Lưu cấu hình</Button>
          </div>
          <div style={{ padding: '0 16px' }}>
            <Table 
              columns={slotColumns} 
              dataSource={slots} 
              loading={loading} 
              pagination={false} 
              rowKey="ma_khung_gio"
              size="middle"
            />
          </div>
        </Card>
      ),
    },
    {
      key: '2',
      label: <Space><CalendarOutlined /> Ngày lễ</Space>,
      children: (
        <Card bordered={false} bodyStyle={{ padding: 0 }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text type="secondary" size="small">Danh sách các ngày lễ và mức phí áp dụng</Text>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsHolidayModalOpen(true)}>Thêm ngày lễ</Button>
          </div>
          <div style={{ padding: '0 16px' }}>
            <Table 
              columns={holidayColumns} 
              dataSource={holidays} 
              loading={loading} 
              rowKey="ma_ngay_le"
              size="middle"
              pagination={{ pageSize: 10, position: ['bottomCenter'] }}
            />
          </div>
        </Card>
      ),
    },
    {
      key: '3',
      label: <Space><DollarOutlined /> Phụ phí tuần</Space>,
      children: (
        <Card bordered={false}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <Text type="secondary">Cấu hình phụ phí cố định cho các ngày trong tuần</Text>
            <Button type="primary" icon={<SaveOutlined />} onClick={updateWeekSurcharges}>Lưu cấu hình</Button>
          </div>
          <Row gutter={[16, 16]}>
            {weekSurcharges.map((w, i) => (
              <Col xs={12} sm={8} md={6} lg={4} xl={3} key={i}>
                <Card size="small" title={dayNames[w.ngay_trong_tuan]} headStyle={{ fontSize: 13, background: '#f9f9f9' }}>
                  <InputNumber
                    style={{ width: '100%' }}
                    value={w.phi_thu}
                    onChange={(val) => {
                      const newSurcharges = [...weekSurcharges];
                      newSurcharges[i].phi_thu = val;
                      setWeekSurcharges(newSurcharges);
                    }}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    placeholder="0"
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Space direction="vertical" size={24} style={{ width: '100%' }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>Cấu hình hệ thống</Title>
          <Text type="secondary">Quản lý khung giờ hoạt động và các mức phụ phí</Text>
        </div>

        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab} 
          items={tabItems}
          type="card"
          className="shadow-sm"
        />

        <Modal
          title="Thêm ngày lễ mới"
          open={isHolidayModalOpen}
          onCancel={() => setIsHolidayModalOpen(false)}
          footer={null}
          destroyOnClose
        >
          <Form
            form={holidayForm}
            layout="vertical"
            onFinish={handleAddHoliday}
            initialValues={{ surcharge: 0 }}
          >
            <Form.Item
              label="Ngày diễn ra"
              name="date"
              rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              label="Tên ngày lễ"
              name="name"
              rules={[{ required: true, message: 'Vui lòng nhập tên ngày lễ' }]}
            >
              <Input placeholder="Ví dụ: Tết Nguyên Đán" />
            </Form.Item>
            <Form.Item
              label="Phụ phí cộng thêm (VNĐ)"
              name="surcharge"
              rules={[{ required: true, message: 'Vui lòng nhập mức phí' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                placeholder="0"
              />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Space>
                <Button onClick={() => setIsHolidayModalOpen(false)}>Hủy bỏ</Button>
                <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>Xác nhận</Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </AdminLayout>
  );
}