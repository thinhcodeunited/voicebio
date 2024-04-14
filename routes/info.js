const Router = require('@koa/router');
const router = new Router();

const fs = require('fs');
const upload = require('../middleware/upload');
router.post('/get-data', upload.single('audio'), async (ctx) => {
    const file = ctx.file;

    // Kiểm tra dữ liệu
    if (!file || !file.path || !file.filename) {
        return ctx.body = {
            status: false,
            message: 'Thông tin bị thiếu, vui lòng kiểm tra lại'
        }
    }

    try {
        const request = {
            audio: fs.readFileSync(file.path).toString('base64')
        };

        // const res = axios.post('{baseURL}/api/v1/asr/phonenumber/check', request);
        const res = {
            "code": 200,
            "status": true,
            "text": "Chào Quý khách NGUYEN VAN A, Số điện thoại : 09123456789, Hạng A. Hôm nay cửa hàng có những khuyến mại dành riêng cho Quý khách như sau: Khuyến mãi ABC"
        }
        if (!res || typeof res.status == 'undefined' || !res.text) throw new Error('Lỗi không xác định');
        const { code, status, text } = res;

        return ctx.body = {
            status: true,
            message: 'Lấy thông tin khách hàng thành công',
            text
        }
    } catch (e) {
        console.log(e);
        return ctx.body = {
            status: false,
            message: 'Lỗi không xác định'
        }
    }
});

module.exports = router.routes();