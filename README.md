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
git clone https://github.com/LuongTr/demo-crud
cd demo-crud
npm install
```

2. **Thiết lập cơ sở dữ liệu:**

- Mở SQL Server Management Studio
- Chạy script trong file `DBquery.sql` để tạo database và bảng

3. **Cấu hình kết nối:**

- Mở file `index.js`
- Cập nhật thông tin kết nối SQL Server phù hợp với máy bạn
Trong file index.js ở mục config thay đổi cho phù hợp với sql máy bạn
![image](https://github.com/user-attachments/assets/d61a5c2f-7f3a-45f1-b20b-a9b75ba9fd6a)

<img width="449" alt="configSQL" src="https://github.com/user-attachments/assets/b9e065e3-8358-4ff1-b716-ba05295570e4" />

4. **Chạy project:**

```bash
node index.js
```

5. **Truy cập ứng dụng:**

Mở trình duyệt và truy cập http://localhost:5500
