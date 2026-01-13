import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { ProtectedRoute, PublicOnlyRoute } from './guards';
import { lazy } from 'react';
import { LazyWrapper } from './LazyWrapper';
import PrivateRoute from '@/admin/src/routes/PrivateRoute';

// Lazy load pages
const HomePage = lazy(() => import('@/features/home/pages/HomePage'));
const CourtsPage = lazy(() => import('@/features/courts/pages/CourtsPage'));
const CourtDetailPage = lazy(() => import('@/features/courts/pages/CourtDetailPage'));
const BookingPage = lazy(() => import('@/features/bookings/pages/BookingPage'));
const BookingHistoryPage = lazy(() => import('@/features/bookings/pages/BookingHistoryPage'));
const BookingDetailPage = lazy(() => import('@/features/bookings/pages/BookingDetailPage'));
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/ForgotPasswordPage'));
const ProfilePage = lazy(() => import('@/features/profile/pages/ProfilePage'));
const PaymentResultPage = lazy(() => import('@/features/payment/pages/PaymentResultPage'));

const AdminDashboard = lazy(() => import("@/admin/src/pages/admin/Dashboard"));
const AdminSports = lazy(() => import("@/admin/src/pages/admin/Sports"));
const AdminUsers = lazy(() => import("@/admin/src/pages/admin/Users"));
const AdminTimeSlots = lazy(() => import("@/admin/src/pages/admin/TimeSlots"));
const OwnerDashboard = lazy(() => import("@/admin/src/pages/owner/Dashboard"));
const OwnerBookings = lazy(() => import("@/admin/src/pages/owner/Bookings"));
const OwerMyCourts = lazy(() => import("@/admin/src/pages/owner/MyCourts"));
const CourtForm = lazy(() => import("@/admin/src/pages/owner/CourtForm"));
const CourtDetail = lazy(() => import("@/admin/src/pages/owner/CourtDetail"));
const BookingDetail = lazy(() => import("@/admin/src/pages/owner/BookingDetail"));
const PaymentResult = lazy(() => import("@/admin/src/pages/owner/PaymentResult"));
const AuthSuccess = lazy(() => import("@/admin/src/pages/AuthSuccess"));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // Public routes
      {
        index: true,
        element: <LazyWrapper><HomePage /></LazyWrapper>,
      },
      {
        path: 'courts',
        element: <LazyWrapper><CourtsPage /></LazyWrapper>,
      },
      {
        path: 'courts/:id',
        element: <LazyWrapper><CourtDetailPage /></LazyWrapper>,
      },

      // Auth routes (public only)
      {
        element: <PublicOnlyRoute />,
        children: [
          {
            path: 'login',
            element: <LazyWrapper><LoginPage /></LazyWrapper>,
          },
          {
            path: 'register',
            element: <LazyWrapper><RegisterPage /></LazyWrapper>,
          },
          {
            path: 'forgot-password',
            element: <LazyWrapper><ForgotPasswordPage /></LazyWrapper>,
          },
        ],
      },

      // Protected routes
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'courts/:id/booking',
            element: <LazyWrapper><BookingPage /></LazyWrapper>,
          },
          {
            path: 'bookings',
            element: <LazyWrapper><BookingHistoryPage /></LazyWrapper>,
          },
          {
            path: 'bookings/:id',
            element: <LazyWrapper><BookingDetailPage /></LazyWrapper>,
          },
          {
            path: 'profile',
            element: <LazyWrapper><ProfilePage /></LazyWrapper>,
          },
          {
            path: 'payment/result',
            element: <LazyWrapper><PaymentResultPage /></LazyWrapper>,
          },
          {
            path: 'owner/payment/result',
            element: <LazyWrapper><PaymentResultPage /></LazyWrapper>,
          },
        ],
      },
      // ########
      {
        path: "admin",
        element: <PrivateRoute role="admin" />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "users", element: <AdminUsers /> },
          { path: "configs/time-slots", element: <AdminTimeSlots /> },
          { path: "sports", element: <AdminSports /> },
        ],
      },
      {
        path: "owner",
        element: <PrivateRoute role="chu_san" />,
        children: [
          { index: true, element: <OwnerDashboard /> },
          { path: "courts/my", element: <OwerMyCourts /> },
          { path: "courts/new", element: <CourtForm /> },
          { path: "courts/edit/:id", element: <CourtForm /> },
          { path: "courts/:id", element: <CourtDetail /> },
          { path: "orders/count", element: <OwnerBookings /> },
          { path: "dat-san/:id", element: <BookingDetail /> },
          { path: "payment/result", element: <PaymentResult /> },
        ],
      },
      {
        path: "auth/success",
        element: <AuthSuccess />
      }
    ],
  },
]);
