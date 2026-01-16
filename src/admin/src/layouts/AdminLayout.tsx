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
  TrophyOutlined,
  ClockCircleOutlined,
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

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      key: "/admin",
      icon: <DashboardOutlined />,
      label: "Thống kê",
    },
    {
      key: "/admin/sports",
      icon: <TrophyOutlined />,
      label: "Thể thao",
    },
    {
      key: "/admin/configs/time-slots",
      icon: <ClockCircleOutlined />,
      label: "Khung giờ",
    },
    {
      key: "/admin/users",
      icon: <UserOutlined />,
      label: "Người dùng",
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
            itemHeight: 44,
            itemMarginInline: 0,
            itemPaddingInline: 16,
            itemMarginBlock: 4,
            padding: 0,
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
          <div className="flex items-center gap-3 px-3 py-3 border-b border-gray-100 mb-2 overflow-hidden">
            <div className="min-w-[40px] h-10 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
              <TrophyOutlined style={{ fontSize: 20, color: '#fff' }} />
            </div>
            {!collapsed && (
              <span className="text-lg font-bold text-gray-900 tracking-tight truncate whitespace-nowrap">
                Quản trị viên
              </span>
            )}
          </div>
          
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            style={{ padding: 5, border: 'none' }}
          />
        </Sider>
        
        <Layout style={{ marginLeft: collapsed ? 80 : 240, transition: "margin-left 0.2s" }}>
          <Header className="flex items-center justify-between shadow-sm sticky top-0 z-50" style={{ padding: '0 16px' }}>
            <div className="flex items-center gap-2">
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{ fontSize: "16px", width: 40, height: 40 }}
              />
              
              <Divider type="vertical" style={{ margin: '0 8px' }} />
              
              <div className="hidden lg:flex items-center gap-1">
                <Link to={ROUTES.HOME} className="nav-link-antd flex items-center gap-1.5 px-3 py-1.5 text-gray-600 hover:text-emerald-600 hover:bg-gray-50 rounded-md font-medium text-sm transition-colors">
                  <HomeOutlined /> Trang chủ
                </Link>
                <Link to={ROUTES.COURTS} className="nav-link-antd flex items-center gap-1.5 px-3 py-1.5 text-gray-600 hover:text-emerald-600 hover:bg-gray-50 rounded-md font-medium text-sm transition-colors">
                  <SearchOutlined /> Tìm sân
                </Link>
                <Link to={ROUTES.ABOUT} className="nav-link-antd flex items-center gap-1.5 px-3 py-1.5 text-gray-600 hover:text-emerald-600 hover:bg-gray-50 rounded-md font-medium text-sm transition-colors">
                  <InfoCircleOutlined /> Về chúng tôi
                </Link>
                <Link to={ROUTES.BOOKINGS} className="nav-link-antd flex items-center gap-1.5 px-3 py-1.5 text-gray-600 hover:text-emerald-600 hover:bg-gray-50 rounded-md font-medium text-sm transition-colors">
                  <HistoryOutlined /> Lịch đặt
                </Link>
              </div>
            </div>

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow trigger={['click']}>
              <div className="flex items-center gap-3 cursor-pointer px-3 py-2 hover:bg-gray-100 rounded-xl transition-all border border-transparent hover:border-gray-200">
                <Avatar 
                  size={36}
                  style={{ backgroundColor: '#059669', flexShrink: 0 }} 
                  icon={<UserOutlined />} 
                />
                <div className="hidden sm:block">
                  <div className="text-sm font-semibold text-gray-800 leading-tight">Administrator</div>
                  <div className="text-xs text-gray-500">admin@sport.com</div>
                </div>
              </div>
            </Dropdown>
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
