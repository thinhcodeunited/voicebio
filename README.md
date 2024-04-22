## Yêu cầu

Yêu cầu cài đặt môi trường: Node, Redis

## Cách sử dụng

Sử dụng YARN quản lý module (package)
```
npm install --global yarn
```

Sử dụng PM2 để quản lý process của nodejs
```
npm install pm2 -g
```

Clone project
```
git clone https://github.com/thinhcodeunited/voicebio.git
```

Cài đặt node module
```
yarn install
```

Đổi tên file môi trường và chỉnh sửa các biến trong file .env.production
```
cp .env.example .env.production
```

Khởi chạy project
```
pm2 start ecosystem.config.js --env production
```

## Project sử dụng các template

- [ ] [KoaJS - phiên bản khác của ExpressJS](https://koajs.com)
- [ ] [EJS Template](https://ejs.co)
- [ ] [Jquery Lib](https://jquery.com)


## Cấu trúc project

- File đầu vào : index.js
- Thư mục bin/ : Kết nối với redis
- Thư mục config/ : Chứa mẫu ghi âm
- Thư mục controllers/ : Tương tự routes, để điều hướng các thành phần trong ứng dụng
- Thư mục helper/ : Nhiệm vụ xử lý các function hay dùng của ứng dụng
- Thư mục middleware/ : Nhiệm vụ để kiểm tra authenticate và bắt lỗi ngoại lệ
- Thư mục public/ : Chứa các file ảnh, css, js để dùng cho template
- Thư mục routes/ : Nhiệm vụ điều hướng các URL của người dùng
- Thư mục templates/ : Chứa các file ejs bao gồm giao diện của ứng dụng