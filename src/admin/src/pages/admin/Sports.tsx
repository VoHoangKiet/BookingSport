// @ts-nocheck
import React, { useEffect, useState, useCallback } from "react";
import api from "../../services/api";
import AdminLayout from "../../layouts/AdminLayout";
import { 
  Table, 
  Button, 
  Form, 
  Input, 
  Space, 
  Typography, 
  Card, 
  Popconfirm, 
  Row,
  Col,
  message 
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  UndoOutlined,
  TrophyOutlined 
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function SportsAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/sports");
      const sorted = (res.data.data || []).sort((a, b) => a.ma_bo_mon - b.ma_bo_mon);
      setItems(sorted);
    } catch (e) {
      console.error(e);
      message.error("Không thể tải danh sách bộ môn");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const onFinish = async (values) => {
    try {
      if (editingId) {
        await api.put(`/sports/${editingId}`, { 
          ten_bo_mon: values.name, 
          thong_tin_bo_mon: values.info 
        });
        message.success("Cập nhật thành công");
      } else {
        await api.post("/sports", { 
          ten_bo_mon: values.name, 
          thong_tin_bo_mon: values.info 
        });
        message.success("Thêm mới thành công");
      }
      form.resetFields();
      setEditingId(null);
      await load();
    } catch (e) {
      console.error(e);
      message.error(editingId ? "Lỗi khi cập nhật" : "Lỗi khi tạo mới");
    }
  };

  const startEdit = (record) => {
    setEditingId(record.ma_bo_mon);
    form.setFieldsValue({
      name: record.ten_bo_mon,
      info: record.thong_tin_bo_mon
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    form.resetFields();
  };

  const remove = async (id) => {
    try {
      await api.delete(`/sports/${id}`);
      message.success("Đã xóa bộ môn");
      await load();
    } catch (e) {
      console.error(e);
      message.error("Lỗi khi xóa");
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'ma_bo_mon',
      key: 'ma_bo_mon',
      width: 80,
      render: (id) => <Text type="secondary">{id}</Text>
    },
    {
      title: 'Tên bộ môn',
      dataIndex: 'ten_bo_mon',
      key: 'ten_bo_mon',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Mô tả',
      dataIndex: 'thong_tin_bo_mon',
      key: 'thong_tin_bo_mon',
      render: (text) => <Text type="secondary">{text || '—'}</Text>
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      align: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => startEdit(record)}
            className="flex items-center"
          />
          <Popconfirm
            title="Xóa bộ môn"
            description="Bạn có chắc chắn muốn xóa bộ môn này?"
            onConfirm={() => remove(record.ma_bo_mon)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              className="flex items-center"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Space direction="vertical" size={24} style={{ width: '100%' }}>
        {/* Header */}
        <div>
          <Title level={4} style={{ margin: 0 }}>Bộ môn thể thao</Title>
          <Text type="secondary">Quản lý danh mục các bộ môn thể thao trong hệ thống</Text>
        </div>

        {/* Form Card */}
        <Card bordered={false} className="shadow-sm">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item
                  label="Tên bộ môn"
                  name="name"
                  rules={[{ required: true, message: 'Vui lòng nhập tên bộ môn' }]}
                >
                  <Input placeholder="Ví dụ: Cầu lông, Bóng đá..." />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Mô tả bộ môn"
                  name="info"
                >
                  <Input placeholder="Mô tả ngắn gọn về bộ môn" />
                </Form.Item>
              </Col>
              <Col xs={24} md={4} className="flex items-end pb-[24px]">
                <Space>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    icon={editingId ? <EditOutlined /> : <PlusOutlined />}
                  >
                    {editingId ? "Cập nhật" : "Thêm mới"}
                  </Button>
                  {editingId && (
                    <Button 
                      icon={<UndoOutlined />} 
                      onClick={cancelEdit}
                    >
                      Hủy
                    </Button>
                  )}
                </Space>
              </Col>
            </Row>
          </Form>
        </Card>

        {/* Table Card */}
        <Card bordered={false} className="shadow-sm" bodyStyle={{ padding: 0 }}>
          <Table 
            columns={columns} 
            dataSource={items} 
            loading={loading}
            rowKey="ma_bo_mon"
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              hideOnSinglePage: true,
              position: ['bottomCenter']
            }}
          />
        </Card>
      </Space>
    </AdminLayout>
  );
}