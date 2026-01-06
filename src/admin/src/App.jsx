import React, { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import "./App.css";

import AuthLayout from "./layouts/AuthLayout";
import PrivateRoute from "./routes/PrivateRoute";

const Login = lazy(() => import("./pages/auth/Login"));
const AuthSuccess = lazy(() => import("./pages/AuthSuccess"));

const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminSports = lazy(() => import("./pages/admin/Sports"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));
const AdminTimeSlots = lazy(() => import("./pages/admin/TimeSlots"));

const OwnerDashboard = lazy(() => import("./pages/owner/Dashboard"));
const OwnerBookings = lazy(() => import("./pages/owner/Bookings"));
const OwerMyCourts = lazy(() => import("./pages/owner/MyCourts"));
const CourtForm = lazy(() => import("./pages/owner/CourtForm"));
const CourtDetail = lazy(() => import("./pages/owner/CourtDetail"));
const BookingDetail = lazy(() => import("./pages/owner/BookingDetail"));
const PaymentResult = lazy(() => import("./pages/owner/PaymentResult"));

const Loading = () => <div className="loading-screen">Loading...</div>;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "auth/success", element: <AuthSuccess /> },
    ],
  },
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
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;