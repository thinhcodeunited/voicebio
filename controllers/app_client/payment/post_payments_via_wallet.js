const create_payment_link = require('../../../helper/api/create_payment_link');

module.exports = async (ctx) => {
    const access_token = ctx.state.access_token;
    const { price } = ctx.request.body;
    if (!price) {
        return ctx.body = {
            status: false,
            message: ctx.i18n.__('MSG_CREATE_PAYMENT_LINK_FAIL')
        }
    }

    const result = await create_payment_link({ access_token, price, type: 'EWALLET', payment_code: 'VMGPAY' });
 
    if (!result || !result.status) {
        return ctx.body = {
            status: false,
            message: ctx.i18n.__('MSG_CREATE_PAYMENT_LINK_FAIL')
        }
    }

    return ctx.body = result;
}