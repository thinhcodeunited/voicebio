const multer = require('@koa/multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (ctx, file, cb) {
        if (!fs.existsSync(path.join(__dirname, '../uploads'))) {
            fs.mkdirSync(path.join(__dirname, '../uploads'));
        }
        cb(null, path.join(__dirname, '../uploads'))
    },
    filename: function (ctx, file, cb) {
        // Tạo tên tệp mới với định dạng WAV
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'recording_' + uniqueSuffix + '.wav');
    }

});

module.exports = multer({ storage });