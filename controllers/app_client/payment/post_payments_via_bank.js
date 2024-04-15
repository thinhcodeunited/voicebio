const create_payment_link = require('../../../helper/api/create_payment_link');

module.exports = async (ctx) => {
    const access_token = ctx.state.access_token;
    const { customer_id, customer_name, price } = ctx.request.body;
    if (!price || !customer_id || !customer_name) {
        return ctx.body = {
            status: false,
            message: ctx.i18n.__('MSG_CREATE_PAYMENT_LINK_FAIL')
        }
    }

    const result = await create_payment_link({ access_token, price, customer_id, customer_name, type: 'ATM', payment_code: 'BIDV' });

    if (!result || !result.status) {
        return ctx.body = {
            status: false,
            message: ctx.i18n.__('MSG_CREATE_PAYMENT_LINK_FAIL')
        }
    }

    return ctx.body = result;
}