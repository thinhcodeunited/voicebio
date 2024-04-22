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
- [ ] [EJS Template](https://ejs.co/)