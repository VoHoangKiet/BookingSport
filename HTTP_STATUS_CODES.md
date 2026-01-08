# HTTP Status Codes - Complete API Documentation

## 📋 Tổng quan HTTP Status Codes

### Success (2xx)
- **200 OK**: Request thành công
- **201 Created**: Tạo resource mới thành công

### Client Errors (4xx)
- **400 Bad Request**: Thiếu params, validation fail
- **401 Unauthorized**: Chưa đăng nhập, token không hợp lệ
- **403 Forbidden**: Không có quyền truy cập
- **404 Not Found**: Resource không tồn tại
- **409 Conflict**: Conflict dữ liệu

### Server Errors (5xx)
- **500 Internal Server Error**: Lỗi server

---

## 🔐 Authentication (/api/auth)

| Endpoint | Method | Success | Errors |
|----------|--------|---------|--------|
| `/register` | POST | 200 | 400: Thiếu params/email tồn tại |
| `/login` | POST | 200 | 400: Thiếu params<br>401: Sai login |
| `/google` | GET | 302 | - |
| `/google/callback` | GET | 302 | 400: Auth failed |
| `/forgot` | POST | 200 | - |
| `/reset` | POST | 200 | 400: Token invalid/expired |
| `/refresh` | POST | 200 | 401: Token không hợp lệ |

---

## 👤 Users (/api/users)

| Endpoint | Method | Success | Errors |
|----------|--------|---------|--------|
| `/profile` | GET | 200 | 401: Chưa đăng nhập |
| `/profile` | PUT | 200 | 401: Chưa đăng nhập |
| `/change-password` | PUT | 200 | 400: Mật khẩu cũ sai<br>401: Chưa đăng nhập<br>404: User không tồn tại |

---

## 🏟️ Courts (/api/courts)

| Endpoint | Method | Success | Errors |
|----------|--------|---------|--------|
| `/` | GET | 200 | - |
| `/by-sport/:id` | GET | 200 | - |
| `/sub/:ma_san` | GET | 200 | - |
<!-- | `/my` | GET | 200 | 401: Token invalid<br>403: Không phải chủ sân | -->
| `/search` | GET | 200 | - |
| `/:id` | GET | 200 | 404: Sân không tồn tại |
| `/:id/images` | GET | 200 | 404: Sân không tồn tại |
<!-- | `/` | POST | 200 | 401: Token invalid<br>403: Không phải chủ sân |
| `/:id` | PUT | 200 | 401: Token invalid<br>403: Không có quyền<br>404: Sân không tồn tại |
| `/:id` | DELETE | 200 | 401: Token invalid<br>403: Không có quyền<br>404: Sân không tồn tại |
| `/sub` | POST | 200 | 401: Token invalid<br>403: Không có quyền<br>404: Sân cha không tồn tại |
| `/sub/:id` | PUT | 200 | 401: Token invalid<br>403: Không có quyền<br>404: Sân con không tồn tại |
| `/sub/:id` | DELETE | 200 | 401: Token invalid<br>403: Không có quyền<br>404: Sân con không tồn tại | -->

---

## 📅 Bookings (/api/bookings)

| Endpoint | Method | Success | Errors |
|----------|--------|---------|--------|
| `/available` | GET | 200 | 400: Thiếu ngày/sân<br>404: Sân con không tồn tại |
| `/` | POST | 200 | 400: Thiếu info/slot đã đặt/ngày qua<br>401: Chưa đăng nhập<br>404: Khung giờ không tồn tại<br>500: DataSource error |
| `/my-history` | GET | 200 | 401: Chưa đăng nhập |
| `/:id` | GET | 200 | 401: Chưa đăng nhập<br>403: Không có quyền<br>404: Đơn không tồn tại |
| `/:id/cancel` | PUT | 200 | 400: Đơn đã hủy<br>401: Chưa đăng nhập<br>403: Không có quyền<br>404: Đơn không tồn tại |
<!-- | `/owner/list` | GET | 200 | 401: Chưa đăng nhập<br>403: Chỉ chủ sân | -->

---

## 💳 Payments (/api/payment)

| Endpoint | Method | Success | Errors |
|----------|--------|---------|--------|
| `/vnpay/create` | POST | 200 | 400: Missing params<br>401: Chưa đăng nhập<br>403: Không phải chủ đơn<br>404: Đơn không tồn tại<br>500: Server error |
| `/vnpay/ipn` | GET | 200 | - |
| `/vnpay/return` | GET | 200 | 500: Server error (HTML) |
| `/cash` | POST | 200 | 403: Chỉ chủ sân<br>500: Server error |

---

## 🏅 Sports (/api/sports)

| Endpoint | Method | Success | Errors |
|----------|--------|---------|--------|
| `/` | GET | 200 | - |
<!-- | `/` | POST | 200 | TODO: Check admin |
| `/:id` | PUT | 200 | TODO: Check admin |
| `/:id` | DELETE | 200 | TODO: Check admin | -->

---

## 📍 Address (/api/address)

| Endpoint | Method | Success | Errors |
|----------|--------|---------|--------|
| `/provinces` | GET | 200 | - |
| `/districts/:id` | GET | 200 | - |

---
<!-- 
## ⚙️ Configuration (/api/configs, /api/admin)

| Endpoint | Method | Success | Errors |
|----------|--------|---------|--------|
| `/configs/time-slots` | GET | 200 | - |
| `/admin/time-slots` | PUT | 200 | TODO: Check admin |
| `/configs/holidays` | GET | 200 | - |
| `/admin/holidays` | POST | 200 | 403: Chỉ admin |
| `/configs/week-surcharges` | GET | 200 | - |
| `/admin/week-surcharges` | PUT | 200 | 403: Chỉ admin | -->

---
<!-- 
## 👨‍💼 Admin (/api/admin)

| Endpoint | Method | Success | Errors |
|----------|--------|---------|--------|
| `/users` | GET | 200 | 403: Chỉ admin |
| `/users/:id/toggle-role` | PUT | 200 | 400: Không đổi admin<br>403: Chỉ admin<br>404: User không tồn tại | -->

---
<!-- 
## 📊 Admin Stats (/api/admin/stats)

| Endpoint | Method | Success | Errors |
|----------|--------|---------|--------|
| `/users/count` | GET | 200 | TODO: 403 throw |
| `/sands/count` | GET | 200 | TODO: 403 throw |
| `/orders/count` | GET | 200 | TODO: 403 throw |
| `/revenue` | GET | 200 | TODO: 403 throw |
| `/top/slots` | GET | 200 | TODO: 403 throw |
| `/top/courts` | GET | 200 | TODO: 403 throw |
| `/overview` | GET | 200 | TODO: 403 throw | -->

---

<!-- ## 📊 Owner Stats (/api/owner/stats)

| Endpoint | Method | Success | Errors |
|----------|--------|---------|--------|
| `/totals` | GET | 200 | TODO: 403 throw |
| `/orders/count` | GET | 200 | TODO: 403 throw |
| `/revenue` | GET | 200 | TODO: 403 throw |
| `/top/slots` | GET | 200 | TODO: 403 throw |
| `/top/courts` | GET | 200 | TODO: 403 throw |
| `/overview` | GET | 200 | TODO: 403 throw | -->

---

## 📤 Upload (/api/upload)

| Endpoint | Method | Success | Errors |
|----------|--------|---------|--------|
| `/avatar` | POST | 200 | TODO: 400/401 throw |
<!-- | `/court-image` | POST | 200 | TODO: 400/403 throw | -->

---

