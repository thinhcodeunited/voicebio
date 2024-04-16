const axios = require('axios');
const querystring = require('querystring');

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
        if (!res || !res.data) {
            return ctx.body = {
                status: false,
                message: 'Có lỗi xảy ra trong quá trình đăng ký'
            }
        }
        const { status, msg } = res.data;
        if (status != 0) {
            return ctx.body = {
                status: false,
                message: msg ? msg : "Đăng ký thất bại"
            }
        }

        return ctx.body = {
            status: true,
            message: "Đăng ký thông tin khách hàng thành công!"
        }
    } catch (err) {
        console.log(err)
        return ctx.body = {
            status: false,
            message: 'Có lỗi xảy ra trong quá trình đăng ký'
        }
    }
}