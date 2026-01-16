// @ts-nocheck
import React, { useState } from "react";
import { logout } from "../services/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Layout, 
  Menu, 
  Button, 
  ConfigProvider, 
  Avatar,
  Dropdown,
  Space,
  Typography,
  Divider
} from "antd";
import {
  DashboardOutlined,
  ShoppingOutlined,
  EnvironmentOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HomeOutlined,
  SearchOutlined,
  InfoCircleOutlined,
  HistoryOutlined,
  SettingOutlined
} from "@ant-design/icons";
import { ROUTES } from "@/lib/constants";
import "../index.css";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export default function OwnerLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      key: "/owner",
      icon: <DashboardOutlined />,
      label: "Thống kê",
    },
    {
      key: "/owner/orders/count",
      icon: <ShoppingOutlined />,
      label: "Đơn đặt sân",
    },
    {
      key: "/owner/courts/my",
      icon: <EnvironmentOutlined />,
      label: "Quản lý sân",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Hồ sơ cá nhân',
      onClick: () => navigate(ROUTES.PROFILE)
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      danger: true,
      onClick: handleLogout
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#059669",
          borderRadius: 6,
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        },
        components: {
          Layout: {
            headerBg: "#ffffff",
            headerPadding: "0 20px",
            headerHeight: 64,
            siderBg: "#ffffff",
          },
          Menu: {
            itemHeight: 40,
            itemMarginInline: 8,
          }
        }
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <Sider 
          trigger={null} 
          collapsible 
          collapsed={collapsed} 
          theme="light"
          width={240}
          style={{
            borderRight: "1px solid #f0f0f0",
            position: "fixed",
            height: "100vh",
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 100,
          }}
        >
          <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 mb-2 overflow-hidden">
            <div className="min-w-[40px] h-10 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
              <EnvironmentOutlined style={{ fontSize: 20, color: '#fff' }} />
            </div>
            {!collapsed && (
              <span className="text-lg font-bold text-gray-900 tracking-tight truncate whitespace-nowrap">
                Owner Portal
              </span>
            )}
          </div>
          
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
          />
        </Sider>
        
        <Layout style={{ marginLeft: collapsed ? 80 : 240, transition: "margin-left 0.2s" }}>
          <Header className="flex items-center justify-between shadow-sm sticky top-0 z-50">
            <Space size={12}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{ fontSize: "16px", width: 40, height: 40 }}
              />
              
              <Divider type="vertical" />
              
              <Space className="hidden md:flex ml-4" size={24}>
                <Link to={ROUTES.HOME} className="nav-link-antd flex items-center gap-2 text-gray-600 hover:text-emerald-600 font-medium">
                  <HomeOutlined /> Trang chủ
                </Link>
                <Link to={ROUTES.COURTS} className="nav-link-antd flex items-center gap-2 text-gray-600 hover:text-emerald-600 font-medium">
                  <SearchOutlined /> Tìm sân
                </Link>
                <Link to={ROUTES.ABOUT} className="nav-link-antd flex items-center gap-2 text-gray-600 hover:text-emerald-600 font-medium">
                  <InfoCircleOutlined /> Về chúng tôi
                </Link>
                <Link to={ROUTES.BOOKINGS} className="nav-link-antd flex items-center gap-2 text-gray-600 hover:text-emerald-600 font-medium">
                  <HistoryOutlined /> Lịch đặt
                </Link>
              </Space>
            </Space>

            <div className="flex items-center gap-4">
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
                <div className="flex items-center gap-3 cursor-pointer p-1.5 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="text-right hidden sm:block">
                    <Text strong className="block text-sm" style={{ lineHeight: 1 }}>Chủ sân</Text>
                    <Text type="secondary" size="small">owner@sport.com</Text>
                  </div>
                  <Avatar 
                    style={{ backgroundColor: '#059669' }} 
                    icon={<UserOutlined />} 
                  />
                </div>
              </Dropdown>
            </div>
          </Header>
          
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: "#F9FAFB",
            }}
          >
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
