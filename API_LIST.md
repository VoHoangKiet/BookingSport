## 📋 TỔNG QUAN
**Tên dự án:** Hệ thống Đặt lịch Sân thể thao
**Mô tả:** Ứng dụng web cho phép người dùng tìm kiếm, đặt lịch và thanh toán các sân thể thao trực tuyến.

**Công nghệ:**
- Backend: NestJS + PostgreSQL + TypeORM
- Frontend: React 19 + Material-UI + Vite **Hiện tại chứa là frontend của phần quản lý Admin&chu_san**
- Authentication: JWT + Google OAuth 2.0
- Payment: VNPay Gateway
- Swagger API Documentation
---

## 🎯 CÁC TÍNH NĂNG CHÍNH CỦA DỰ ÁN

### 1. Quản lý Người dùng
- ✅ Đăng ký/Đăng nhập bằng email & mật khẩu
- ✅ Đăng nhập bằng Google OAuth 2.0
- ✅ Quên mật khẩu & Reset mật khẩu qua email
- ✅ Xác thực JWT Token
- ✅ Refresh Token
- ✅ Quản lý profile (cập nhật thông tin, đổi mật khẩu)
<!-- - ✅ Phân quyền: Người dùng, Chủ sân, Admin -->

### 2. Quản lý Sân thể thao
- ✅ Xem danh sách tất cả sân (public)
- ✅ Tìm kiếm sân theo bộ môn, tên, địa chỉ
- ✅ Xem chi tiết sân và danh sách sân con
- ✅ Xem ảnh sân
<!-- - ✅ Chủ sân: Thêm/Sửa/Xóa sân
- ✅ Chủ sân: Quản lý sân con (thêm/sửa/xóa)
- ✅ Upload ảnh sân (nhiều ảnh) -->

### 3. Đặt lịch Sân
- ✅ Kiểm tra khung giờ còn trống theo ngày
- ✅ Đặt lịch một hoặc nhiều sân con cùng lúc
- ✅ Đặt lịch nhiều khung giờ
- ✅ Tính giá tự động:
  - Giá cơ bản của sân con
  - Phụ phí khung giờ
  - Phụ phí theo ngày trong tuần
  - Phụ phí ngày lễ
- ✅ Xem lịch sử đặt sân
- ✅ Xem chi tiết đơn đặt
- ✅ Hủy đơn đặt
<!-- - ✅ Chủ sân: Xem danh sách đơn đặt tại sân của mình -->
- ✅ Chặn đặt lịch cho khung giờ đã qua

### 4. Thanh toán
- ✅ Tích hợp VNPay Payment Gateway
- ✅ Đặt cọc 30% tổng tiền
- ✅ Thanh toán đầy đủ
- ✅ Xử lý IPN callback từ VNPay
- ✅ Xử lý return URL từ VNPay
- ✅ Hiển thị trang kết quả thanh toán
- ✅ Thanh toán tiền mặt (chủ sân xác nhận)
- ✅ Trạng thái đơn hàng:
  - `tam_giu`: Đơn tạm giữ (chưa thanh toán)
  - `da_dat_coc`: Đã đặt cọc
  - `da_thanh_toan`: Đã thanh toán đầy đủ
  - `da_huy`: Đã hủy

<!-- 
### 5. Quản lý Admin
- ✅ Xem danh sách người dùng
- ✅ Chuyển đổi quyền người dùng/chủ sân
- ✅ Quản lý bộ môn thể thao (thêm/sửa/xóa)
- ✅ Quản lý khung giờ (cập nhật giá phụ phí)
- ✅ Quản lý ngày lễ (thêm/xóa)
- ✅ Quản lý phụ phí theo ngày trong tuần -->

<!-- ### 6. Thống kê Admin
- ✅ Đếm tổng số người dùng
- ✅ Đếm tổng số sân
- ✅ Đếm số đơn đặt sân theo thời gian (ngày/tháng/năm)
- ✅ Tính tổng doanh thu theo thời gian
- ✅ Top khung giờ được đặt nhiều nhất
- ✅ Top sân được đặt nhiều nhất
- ✅ Tổng quan thống kê toàn hệ thống -->

<!-- ### 7. Thống kê Chủ sân
- ✅ Tổng số sân và sân con của tôi
- ✅ Đếm số đơn đặt tại sân của tôi theo thời gian
- ✅ Tính doanh thu từ sân của tôi theo thời gian
- ✅ Top khung giờ được đặt nhiều nhất tại sân của tôi
- ✅ Top sân con được đặt nhiều nhất của tôi
- ✅ Tổng quan thống kê sân của tôi -->

<!-- ### 8. Cấu hình Hệ thống
- ✅ Quản lý khung giờ hoạt động
- ✅ Quản lý ngày lễ và phụ phí ngày lễ
- ✅ Quản lý phụ phí theo ngày trong tuần
- ✅ Quản lý bộ môn thể thao -->

### 9. Tính năng khác
- ✅ Upload ảnh (avatar, ảnh sân)
- ✅ Gửi email (reset password, thông báo) (không chắc :>)
- ✅ API Documentation (Swagger)
- ✅ Xử lý lỗi và validation
- ✅ Bảo mật: Hash password (bcrypt), JWT authentication
- ✅ Tối ưu performance: Batch queries, transaction


# 📋 DANH SÁCH ĐẦY ĐỦ API - HỆ THỐNG ĐẶT LỊCH SÂN THỂ THAO
## Base URL
```
http://localhost:3000

https://quan-ly-dat-lich-san-the-thao.onrender.com/api#/
```
## 🔐 1. AUTHENTICATION APIs
| STT | Method | Endpoint | Mô tả | Auth | Role |
|-----|--------|----------|-------|------|------|
| 1.1 | POST | `/api/auth/register` | Đăng ký tài khoản | ❌ | - |
| 1.2 | POST | `/api/auth/login` | Đăng nhập | ❌ | - |
| 1.3 | GET | `/api/auth/google` | Đăng nhập Google OAuth | ❌ | - |
| 1.4 | GET | `/api/auth/google/callback` | Google OAuth callback | ❌ | - |
| 1.5 | POST | `/api/auth/forgot` | Quên mật khẩu | ❌ | - |
| 1.6 | POST | `/api/auth/reset` | Reset mật khẩu | ❌ | - |
| 1.7 | POST | `/api/auth/refresh` | Refresh token | ❌ | - |

---1.1
/api/auth/register
+ {"email": "user15@gmail.com","mat_khau": "123456"}
---1.2
/api/auth/login
+ {"email": "user13@gmail.com","mat_khau": "123456"}
---1.3
+ https://quan-ly-dat-lich-san-the-thao.onrender.com/api/auth/google 
---1.5
/api/auth/forgot
+ {"email": "user13@gmail.com"}

+ Nếu User đăng nhập Google lần đầu → Tài khoản tạo không có password, Sau đó dùng /api/auth/forgot
  nhận mail sau đó dùng /api/auth/reset để đặt mk mới
---1.6
/api/auth/reset
+ {    "userId": ma_nguoi_dung,
        "token": "1d20b6e079d7863055c9b389dfcc2eeb0a16393dcce1ce6a036b851be8c9a838",
        "newPassword": "123456"
  }
---1.7 
/api/auth/refresh
+ sau khi đăng nhập lấy token đó bỏ vô body để test 
+{"token": "...."}
## 👤 2. USER APIs
| STT | Method | Endpoint | Mô tả | Auth | Role |
|-----|--------|----------|-------|------|------|
| 2.1 | GET | `/api/users/profile` | Lấy thông tin profile | ✅ | User |
| 2.2 | PUT | `/api/users/profile` | Cập nhật profile | ✅ | User |
| 2.3 | PUT | `/api/users/change-password` | Đổi mật khẩu | ✅ | User |

---
## 🏟️ 3. COURTS APIs (Public)
| STT | Method | Endpoint | Mô tả | Auth | Role |
|-----|--------|----------|-------|------|------|
| 3.1 | GET | `/api/courts` | Lấy danh sách tất cả sân | ❌ | - |
| 3.2 | GET | `/api/courts/by-sport/:ma_bo_mon` | Lấy sân theo bộ môn | ❌ | - |
| 3.3 | GET | `/api/courts/search` | Tìm kiếm và lọc sân | ❌ | - |
| 3.4 | GET | `/api/courts/:id` | Chi tiết sân và sân con | ❌ | - |
| 3.5 | GET | `/api/courts/:id/images` | Lấy danh sách ảnh sân | ❌ | - |
| 3.6 | GET | `/api/courts/sub/:ma_san` | Lấy sân con của sân | ❌ | - |

--- 3.3
+ /api/courts/search : tìm kiếm tất cả các sân
+ /api/courts/search?ma_bo_mon=1 : lọc theo bộ môn
+ /api/courts/search?q=bóng đá : theo tên sân
+ /api/courts/search?dia_chi=Đà Nẵng : theo địa chỉ (cái ni hình như lỗi )
+ api/courts/search?ma_bo_mon=1&q=sân&dia_chi=Đà Nẵng


<!-- ## 🏟️ 4. COURTS APIs (Owner)

| STT | Method | Endpoint | Mô tả | Auth | Role |
|-----|--------|----------|-------|------|------|
| 4.1 | GET | `/api/courts/my` | Lấy sân của tôi | ✅ | Owner |
| 4.2 | POST | `/api/courts` | Thêm sân mới | ✅ | Owner |
| 4.3 | PUT | `/api/courts/:id` | Cập nhật sân | ✅ | Owner |
| 4.4 | DELETE | `/api/courts/:id` | Xóa sân | ✅ | Owner |
| 4.5 | POST | `/api/courts/sub` | Thêm sân con | ✅ | Owner |
| 4.6 | PUT | `/api/courts/sub/:id` | Cập nhật sân con | ✅ | Owner |
| 4.7 | DELETE | `/api/courts/sub/:id` | Xóa sân con | ✅ | Owner |

--- -->

## 📅 5. BOOKINGS APIs

| STT | Method | Endpoint | Mô tả | Auth | Role |
|-----|--------|----------|-------|------|------|
| 5.1 | GET | `/api/bookings/available` | Kiểm tra khung giờ trống | ❌ | - |
| 5.2 | POST | `/api/bookings` | Tạo đơn đặt sân | ✅ | User |
| 5.3 | GET | `/api/bookings/my-history` | Lịch sử đặt sân | ✅ | User |
| 5.4 | GET | `/api/bookings/:id` | Chi tiết đơn | ✅ | User/Owner |
| 5.5 | PUT | `/api/bookings/:id/cancel` | Hủy đơn | ✅ | User/Owner |
| 5.6 | PUT | `/api/bookings/:id/status` | Cập nhật trạng thái đơn | ✅ | Owner |
| 5.7 | POST | `/api/bookings/status/trigger-update` | Kích hoạt cập nhật trạng thái | ✅ | Owner |
| 5.8 | GET | `/api/bookings/status/info` | Thông tin hệ thống cập nhật | ❌ | - |
<!-- | 5.9 | GET | `/api/bookings/owner/list` | Đơn tại sân của tôi | ✅ | Owner | -->

---5.1
+ /api/bookings/available?ma_san=2&ngay=2025-12-31 Kiểm tra khung giờ trống theo sân và ngày được chọn
---5.2
+ Tạo đơn đặt sân: 
/api/bookings
    { 
        "ma_san_con": 6, "ngay_dat_san": "2025-12-31", "khung_gios": [11,12] , "hinh_thuc_thanh_toan":    "chuyen_khoan" 
    }
---5.6
+ Cập nhật trạng thái đơn (Owner):
PUT /api/bookings/:id/status
    {
        "trang_thai": "dang_su_dung"  // hoặc "hoan_thanh"
    }
---5.7
+ Kích hoạt cập nhật trạng thái ngay lập tức (Owner/Admin):
POST /api/bookings/status/trigger-update
---5.8
+ Xem thông tin về hệ thống tự động cập nhật trạng thái:
GET /api/bookings/status/info
## 💳 6. PAYMENT APIs

| STT | Method | Endpoint | Mô tả | Auth | Role |
|-----|--------|----------|-------|------|------|
| 6.1 | POST | `/api/payment/vnpay/create` | Tạo URL thanh toán VNPay | ✅ | User |
| 6.2 | GET | `/api/payment/vnpay/ipn` | VNPay IPN callback | ❌ | - |
| 6.3 | GET | `/api/payment/vnpay/return` | VNPay return URL | ❌ | - |
<!-- | 6.4 | POST | `/api/payment/cash` | Xác nhận thanh toán tiền mặt | ✅ | Owner | -->
---6.1 (nhớ tạo đơn hàng trước)
/api/payment/vnpay/create 
+ {"ma_don": 16,"loai_giao_dich": "thanh_toan"}
+ nó sẽ trả về 1 cái  "paymentUrl" , đường dẫn sẽ dẫn đến phần thanh toán 


<!-- ## 👨‍💼 7. ADMIN APIs

| STT | Method | Endpoint | Mô tả | Auth | Role |
|-----|--------|----------|-------|------|------|
| 7.1 | GET | `/api/admin/users` | Danh sách người dùng | ✅ | Admin |
| 7.2 | PUT | `/api/admin/users/:id/toggle-role` | Chuyển đổi quyền | ✅ | Admin | -->

---

<!-- ## 📊 8. ADMIN STATS APIs

| STT | Method | Endpoint | Mô tả | Auth | Role |
|-----|--------|----------|-------|------|------|
| 8.1 | GET | `/api/admin/stats/users/count` | Đếm người dùng | ✅ | Admin |
| 8.2 | GET | `/api/admin/stats/sands/count` | Đếm sân | ✅ | Admin |
| 8.3 | GET | `/api/admin/stats/orders/count` | Đếm đơn hàng | ✅ | Admin |
| 8.4 | GET | `/api/admin/stats/revenue` | Tổng doanh thu | ✅ | Admin |
| 8.5 | GET | `/api/admin/stats/top/slots` | Top khung giờ | ✅ | Admin |
| 8.6 | GET | `/api/admin/stats/top/courts` | Top sân | ✅ | Admin |
| 8.7 | GET | `/api/admin/stats/overview` | Tổng quan | ✅ | Admin | -->

---
<!-- 
## 📊 9. OWNER STATS APIs

| STT | Method | Endpoint | Mô tả | Auth | Role |
|-----|--------|----------|-------|------|------|
| 9.1 | GET | `/api/owner/stats/totals` | Tổng sân của tôi | ✅ | Owner |
| 9.2 | GET | `/api/owner/stats/orders/count` | Đếm đơn của tôi | ✅ | Owner |
| 9.3 | GET | `/api/owner/stats/revenue` | Doanh thu của tôi | ✅ | Owner |
| 9.4 | GET | `/api/owner/stats/top/slots` | Top khung giờ của tôi | ✅ | Owner |
| 9.5 | GET | `/api/owner/stats/top/courts` | Top sân của tôi | ✅ | Owner |
| 9.6 | GET | `/api/owner/stats/overview` | Tổng quan của tôi | ✅ | Owner | -->

---

## ⚽ 10. SPORTS APIs

| STT | Method | Endpoint | Mô tả | Auth | Role |
|-----|--------|----------|-------|------|------|
| 10.1 | GET | `/api/sports` | Danh sách bộ môn | ❌ | - |
<!-- | 10.2 | POST | `/api/sports` | Thêm bộ môn | ✅ | Admin |
| 10.3 | PUT | `/api/sports/:id` | Cập nhật bộ môn | ✅ | Admin |
| 10.4 | DELETE | `/api/sports/:id` | Xóa bộ môn | ✅ | Admin | -->

---

## ⚙️ 11. CONFIGURATION APIs

<!-- | STT | Method | Endpoint | Mô tả | Auth | Role |
|-----|--------|----------|-------|------|------| -->
<!-- | 11.1 | GET | `/api/configs/time-slots` | Danh sách khung giờ | ❌ | - | -->
<!-- | 11.2 | PUT | `/api/admin/time-slots` | Cập nhật khung giờ | ✅ | Admin | -->
<!-- | 11.3 | GET | `/api/configs/holidays` | Danh sách ngày lễ | ❌ | - | -->
<!-- | 11.4 | POST | `/api/admin/holidays` | Thêm ngày lễ | ✅ | Admin | -->
<!-- | 11.5 | GET | `/api/configs/week-surcharges` | Phụ phí tuần | ❌ | - | -->
<!-- | 11.6 | PUT | `/api/admin/week-surcharges` | Cập nhật phụ phí tuần | ✅ | Admin | -->
<!-- --- -->



## 📍 12. ADDRESS APIs

| STT | Method | Endpoint | Mô tả | Auth | Role |
|-----|--------|----------|-------|------|------|
| 12.1 | GET | `/api/address/provinces` | Danh sách tỉnh/thành | ❌ | - |
| 12.2 | GET | `/api/address/districts/:provinceId` | Danh sách quận/huyện | ❌ | - |

---

## 📤 13. UPLOAD APIs

| STT | Method | Endpoint | Mô tả | Auth | Role |
|-----|--------|----------|-------|------|------|
| 13.1 | POST | `/api/upload/avatar` | Upload ảnh avatar | ✅ | User |
<!-- | 13.2 | POST | `/api/upload/court-image` | Upload ảnh sân | ✅ | Owner | -->
---



## 📊 TỔNG KẾT

**Tổng số API:** 62 endpoints

**Phân loại theo Authentication:**
- Public APIs (không cần đăng nhập): 18 APIs
- User APIs (cần đăng nhập): 43 APIs
  - User role: 11 APIs
  - Owner role: 19 APIs
  - Admin role: 13 APIs

**Phân loại theo Method:**
- GET: 38 APIs
- POST: 12 APIs
- PUT: 9 APIs
- DELETE: 2 APIs

---

<!-- **Swagger Documentation:** `http://localhost:3000/api` -->

'https://quan-ly-dat-lich-san-the-thao.onrender.com/api#/'

**Tài liệu được tạo:** 31/12/2024
