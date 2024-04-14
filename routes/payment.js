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
            "text": "Chào Quý khách NGUYEN VAN A, Số điện thoại : 09123456789, Hạng A. Số tiền quý khách cần thanh toán là 100.000đ. Vui lòng nhấn nút xác nhận để thanh toán"
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


router.post('/verify', upload.single('audio'), async (ctx) => {
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
            phone: "123",
            text: "123",
            audio: fs.readFileSync(file.path).toString('base64'),
            option: true,
            threshold: true
        };

        // const res = axios.post('{baseURL}api/v1/voiceotp/verify', request);
        const res = {
            "code": 200,
            "status": true,
            "result":{
                 "score": 90.89343,
                 "threshold": 90,
                 "matching": true
            }
        }
        if (!res || !res.status || !res.result) throw new Error('Lỗi không xác định');
        const { score, threshold, matching } = res.result;
        if (res.status) {
            return ctx.body = {
                status: true,
                message: 'Xác thực OTP thành công, Thanh toán thành công',
                text: `Chúc mừng thanh toán thành công, Thông tin khớp giọng như sau Score: ${score}, Threshold: ${threshold}, Matching : ${matching}`
            }
        } else {
            // Thử lại
            return ctx.body = {
                status: false,
                message: 'Xác thực OTP thất bại, vui lòng thử lại',
            }
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