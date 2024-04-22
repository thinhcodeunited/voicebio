const axios = require('axios');
const querystring = require('querystring');
const redisHelper = require('../../helper/redis');

module.exports = async (ctx) => {
    const { customer_name, customer_phone, customer_rank, customer_note } = ctx.request.body;
    const accessToken = ctx.state.accessToken;

    if (!customer_name || !customer_phone || !customer_rank) {
        return ctx.body = {
            status: false,
            message: 'Dữ liệu thông tin khách hàng bị thiếu'
        }
    }

    try {
        // Gửi thông tin lên API để tạo khách hàng
        const payload = querystring.stringify({
            "user_code": customer_phone,
            "name": customer_name,
            "description": customer_rank
        });

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${accessToken}`
        };
        const res = await axios.post(process.env.API_URL + '/api/voicebio/user/create', payload, { headers });
        if (!res || !res.data || ![0, 400].includes(res.data.status)) throw new Error("Lỗi ngoại lệ");

        // Lưu dữ liệu người dùng vào redis
        const customerData = {
            "phone": customer_phone,
            "name": customer_name,
            "rank": customer_rank,
            "node": customer_note
        }
        redisHelper.setSingleRedisForever(`${customer_phone}_data_customer`, JSON.stringify(customerData));

        // Số điện thoại đã được đăng ký trước đó
        if (res.data.status == 400) {
            // Kiểm tra đăng ký giọng chưa
            const checkEnrolledRes = await axios.get(process.env.API_URL + '/api/voicebio/user/check/' + customer_phone, { headers });
            if (!checkEnrolledRes || !checkEnrolledRes.data || ![0, 400].includes(checkEnrolledRes.data.status)) throw new Error("Lỗi ngoại lệ");

            return ctx.body = {
                status: false,
                message: "Đăng ký không thành công vì SĐT đã có trên hệ thống",
                data: {
                    "phone": customer_phone,
                    "isEnrolled": checkEnrolledRes.data.result
                }
            }
        }

        return ctx.body = {
            status: true,
            message: "Đăng ký thông tin khách hàng thành công!",
            data: {
                "phone": customer_phone
            }
        }
    } catch (err) {
        console.log(err)
        return ctx.body = {
            status: false,
            message: 'Có lỗi xảy ra trong quá trình đăng ký'
        }
    }
}