const Router = require('@koa/router');
const router = new Router();
const { isValidPhonenumber } = require('../helper/data_type');
const axios = require('axios');
const redisHelper = require('../helper/redis');
const path = require('path');

router.post('/', async (ctx) => {
    const { customer_name, customer_phone, customer_rank, customer_note, customer_filename_1, customer_filename_2, customer_filename_3 } = ctx.request.body;
    if (!customer_name || !customer_phone || !customer_rank || !customer_note || !customer_filename_1 || !customer_filename_2 || !customer_filename_3) {
        return ctx.body = {
            status: false,
            message: 'Dữ liệu đăng ký bị thiếu'
        }
    }

    const pathFile1 = path.join(__dirname, '../uploads/' + customer_filename_1);
    const pathFile2 = path.join(__dirname, '../uploads/' + customer_filename_2);
    const pathFile3 = path.join(__dirname, '../uploads/' + customer_filename_3);

    if (!fs.existsSync(pathFile1) || !fs.existsSync(pathFile2) || !fs.existsSync(pathFile3)) {
        return ctx.body = {
            status: false,
            message: 'Dữ liệu xác thực đăng ký không hợp lê'
        }
    }

    try {
        const payload = {
            name: customer_name,
            phoneNumber: customer_phone,
            rankCustomer: customer_rank,
            note: customer_note,
            audio1: fs.readFileSync(pathFile1).toString('base64'),
            audio2: fs.readFileSync(pathFile2).toString('base64'),
            audio3: fs.readFileSync(pathFile3).toString('base64'),
        }
        // const res = axios.post('{baseURL}/api/v1/member/register', payload);
        const res = {
            "code": 200,
            "status": true
        }
        if (!res || !res.code || typeof res.status == 'undefined') throw new Error('Lỗi không xác định');
        const { code, status } = res;
        if (status) {
            return ctx.body = {
                status: true,
                message: "Đăng ký thông tin thành công"
            }
        } else {
            return ctx.body = {
                status: true,
                message: "Có lỗi xảy ra trong quá trình đăng ký"
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

router.post('/check-phone', async (ctx) => {
    const { phone } = ctx.request.body;
    if (!phone || !isValidPhonenumber(phone)) {
        return ctx.body = {
            status: false,
            message: 'Số điện thoại không hợp lệ'
        }
    }

    try {
        // const checkPhoneRes = axios.post('{baseURL}/api/v1/register/check', { phone });
        const checkPhoneRes = {
            "listText": ["Mã xác thực của bạn là 012345", "289138 là mã xác thực của tôi", "Mã của tôi là 389142"],
            "code": 200,
            "result": {
                "isExist": false
            }
        }
        if (!checkPhoneRes) throw new Error('Lỗi không xác định');
        const { listText, code, result } = checkPhoneRes;
        if (!listText || listText.length < 1 || !code || !result || typeof result.isExist == 'undefined') throw new Error('Lỗi không xác định');

        // Lưu listText cho các phiên sau trong redis
        const nextListText = listText.filter((element, index) => index !== 0);
        redisHelper.setSingleRedisForever(phone + '_register_text_check', JSON.stringify(nextListText));


        // Trả kết quả
        if (result.isExist) {
            // KH chưa tồn tại trên hệ thống
            return ctx.body = {
                status: false,
                message: 'Số điện thoại đã tồn tại trên hệ thống',
                checkText: listText[0]
            }
        } else {
            // KH đã tồn tại
            return ctx.body = {
                status: true,
                message: 'Số điện thoại chưa tồn tại trên hệ thống',
                checkText: listText[0]
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

const fs = require('fs');
const upload = require('../middleware/upload');
router.post('/verify-voiceotp', upload.single('audio'), async (ctx) => {
    const file = ctx.file;
    const { phone, index, checkText } = ctx.request.body;

    // Kiểm tra dữ liệu
    if (!isValidPhonenumber(phone) || typeof index == 'undefined' || !checkText || !file || !file.path || !file.filename) {
        return ctx.body = {
            status: false,
            message: 'Thông tin xác thực bị thiếu, vui lòng kiểm tra lại'
        }
    }

    try {
        const request = {
            phone,
            text: checkText,
            audio: fs.readFileSync(file.path).toString('base64'),
            option: false,
            threshold: true,
        };

        // const res = axios.post('{baseURL}/api/v1/voiceotp/verify', request);
        const res = {
            "code": 200,
            "status": true,
            "result": {
                "score": 90.89343,
                "threshold": 90,
                "matching": true
            }
        }
        if (!res || !res.status || !res.result) throw new Error('Lỗi không xác định');
        const { score, threshold, matching } = res.result;
        if (typeof matching == 'undefined') throw new Error('Lỗi không xác định');

        if (matching) {
            // Voiceotp khớp, next
            let listText = await redisHelper.getSingleRedis(phone + '_register_text_check');
            listText = JSON.parse(listText);

            // Lưu listText cho các phiên sau trong redis
            const nextListText = listText.filter((element, index) => index !== 0);
            redisHelper.setSingleRedisForever(phone + '_register_text_check', JSON.stringify(nextListText));

            return ctx.body = {
                status: true,
                message: 'Xác thực giọng nói thành công, tiếp tục xác thực lệnh tiếp theo',
                nextIndex: Number(index) + 1,
                nextText: listText[0],
                fileName: file.filename
            }
        } else {
            // Thử lại
            return ctx.body = {
                status: false,
                message: 'Xác thực giọng nói không chính xác, vui lòng thử lại'
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