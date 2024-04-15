const api_send_otp_code = require('../../../helper/api/send_otp_code');

module.exports = async (ctx) => {
    const access_token = ctx.state.access_token;

    const result = await api_send_otp_code({ access_token });

    if (!result || !result.status) {
        return ctx.body = {
            status: false,
            message: ctx.i18n.__('MSG_GET_OTP_CODE_FAIL')
        }
    }

    return ctx.body = {
        status: true,
        message: ctx.i18n.__('MSG_GET_OTP_CODE_SUCCESSFULLY')
    }
}