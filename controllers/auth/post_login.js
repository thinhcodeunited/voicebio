const axios = require('axios');
const querystring = require('querystring');
const redisHelper = require('../../helper/redis');
const moment = require('moment');

module.exports = async (ctx) => {
    const { username, password } = ctx.request.body;

    if (!username) {
        ctx.flash('state.notifier', { status: false, message: "Vui lòng nhập username" });
        return ctx.redirect(process.env.APP_URL + "/login");
    }

    if (!password) {
        ctx.flash('state.notifier', { status: false, message: "Vui lòng nhập mật khẩu" });
        return ctx.redirect(process.env.APP_URL + "/login");
    }

    try {
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        const res = await axios.post(process.env.API_URL + '/api/voicebio/auth', querystring.stringify({ username, password }), { headers });
        if (!res || !res.data) {
            ctx.flash('state.notifier', { status: false, message: "Đăng nhập thất bại" });
            return ctx.redirect(process.env.APP_URL + "/login");
        }
        const { status, msg, token, expire_time } = res.data;
        if (status != "0") {
            ctx.flash('state.notifier', { status: false, message: "Đăng nhập thất bại" });
            return ctx.redirect(process.env.APP_URL + "/login");
        }

        const redisTime = Math.round((expire_time - moment().valueOf()) / 1000);

        redisHelper.setSingleRedis(token, 1, redisTime);
        ctx.session.accessToken = token;

        // That's ok , let go to profile
        ctx.flash('state.notifier', { status: true, message: "Đăng nhập thành công" });
        return ctx.redirect(process.env.APP_URL);
    } catch (err) {
        console.log(err)
        ctx.flash('state.notifier', { status: false, message: "Lỗi không xác định" });
        return ctx.redirect("/login");
    }
}