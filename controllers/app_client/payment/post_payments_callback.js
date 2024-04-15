const get_payment = require('../../../helper/api/get_payment');
const { HmacSHA256 } = require('crypto-js');

module.exports = async (ctx) => {
    const { order_id, error_code, error_message, price, transaction_id, signature } = ctx.request.query;
    if (!order_id || !error_code || !error_message || !price || !transaction_id || !signature) {
        ctx.flash('state.notifier', { status: false, message: ctx.i18n.__('MSG_PAYMENT_RECHARGE_FAIL') });
        return ctx.redirect(process.env.APP_CLIENT_URL + '/payment');
    }

    const result = await get_payment({ order_id });
    if (!result) {
        ctx.flash('state.notifier', { status: false, message: ctx.i18n.__('MSG_PAYMENT_RECHARGE_FAIL') });
        return ctx.redirect(process.env.APP_CLIENT_URL + '/payment');
    }

    if (!result.status) {
        ctx.flash('state.notifier', { status: false, message: result.message });
        return ctx.redirect(process.env.APP_CLIENT_URL + '/payment');
    }

    const { clientId, clientSecret } = result.data;
    if (!clientId || !clientSecret) {
        ctx.flash('state.notifier', { status: false, message: ctx.i18n.__('MSG_PAYMENT_RECHARGE_FAIL') });
        return ctx.redirect(process.env.APP_CLIENT_URL + '/payment');
    }

    const confirm_signature = await HmacSHA256(
        `${error_code}||${error_message}||${order_id}||${price}||${transaction_id}`,
        clientSecret,
    ).toString();

    if (confirm_signature !== signature) {
        ctx.flash('state.notifier', { status: false, message: ctx.i18n.__('MSG_PAYMENT_RECHARGE_FAIL') });
        return ctx.redirect(process.env.APP_CLIENT_URL + '/payment');
    }

    if (error_code == "0") {
        // Success
        ctx.flash('state.notifier', { status: true, message: ctx.i18n.__('MSG_PAYMENT_RECHARGE_SUCCESSFULLY') });
        return ctx.redirect(process.env.APP_CLIENT_URL + '/payment');
    } else {
        // Fail
        ctx.flash('state.notifier', { status: false, message: error_message || ctx.i18n.__('MSG_PAYMENT_RECHARGE_FAIL') });
        return ctx.redirect(process.env.APP_CLIENT_URL + '/payment');
    }
}