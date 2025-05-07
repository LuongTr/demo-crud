# 👥 Employee Manager

Employee Manager là một ứng dụng web đơn giản để quản lý nhân viên (CRUD: Create, Read, Update, Delete), sử dụng:

- Backend: Node.js + Express + MSSQL
- Frontend: HTML + CSS + JavaScript

## 🔧 Chức năng

- Xem danh sách nhân viên
- Thêm nhân viên mới
- Chỉnh sửa thông tin nhân viên
- Xóa nhân viên
- Hiển thị lương theo định dạng tiền tệ

## 🧾 Yêu cầu hệ thống

- Node.js >= 16
- SQL Server đã cài và khởi động sẵn
- Live Server 

---

## 📦 Cài đặt

1. **Clone hoặc tải project:**

```bash
git clone https://github.com/your-username/employee-manager.git
cd employee-manager
npm install
```

2. **Thiết lập cơ sở dữ liệu:**

- Mở SQL Server Management Studio
- Chạy script trong file `DBquery.sql` để tạo database và bảng

3. **Cấu hình kết nối:**

- Mở file `index.js`
- Cập nhật thông tin kết nối SQL Server phù hợp với máy bạn

4. **Chạy project:**

```bash
node index.js
```

5. **Truy cập ứng dụng:**

Mở trình duyệt và truy cập http://localhost:5500