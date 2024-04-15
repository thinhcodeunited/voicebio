const thuhoFactory = require('../../../models/thuho.factory');
const { HmacSHA256 } = require('crypto-js');

module.exports = async (ctx) => {
    const { order_id, error_code, error_message, price, transaction_id, signature } = ctx.request.query;
    if (!order_id || !error_code || !error_message || !price || !transaction_id || !signature) {
        ctx.flash('state.notifier', { status: false, message: ctx.i18n.__('MSG_PAYMENT_RECHARGE_FAIL') });
        return ctx.redirect(process.env.APP_CLIENT_URL + '/cd');
    }

    const findOrder = await thuhoFactory.getItem({ _id: order_id });
    if (!findOrder) {
        ctx.flash('state.notifier', { status: false, message: ctx.i18n.__('MSG_PAYMENT_RECHARGE_FAIL') });
        return ctx.redirect(process.env.APP_CLIENT_URL + '/cd');
    }

    const { clientId, clientSecret } = findOrder;
    if (!clientId || !clientSecret) {
        ctx.flash('state.notifier', { status: false, message: ctx.i18n.__('MSG_PAYMENT_RECHARGE_FAIL') });
        return ctx.redirect(process.env.APP_CLIENT_URL + '/cd');
    }

    const confirm_signature = await HmacSHA256(`${error_code}||${error_message}||${order_id}||${price}||${transaction_id}`, clientSecret).toString();
    if (confirm_signature !== signature) {
        ctx.flash('state.notifier', { status: false, message: ctx.i18n.__('MSG_PAYMENT_RECHARGE_FAIL') });
        return ctx.redirect(process.env.APP_CLIENT_URL + '/cd');
    }

    if (error_code == "0") {
        // Success
        ctx.flash('state.notifier', { status: true, message: ctx.i18n.__('MSG_PAYMENT_RECHARGE_SUCCESSFULLY') });
        return ctx.redirect(process.env.APP_CLIENT_URL + '/cd');
    } else {
        // Fail
        ctx.flash('state.notifier', { status: false, message: error_message || ctx.i18n.__('MSG_PAYMENT_RECHARGE_FAIL') });
        return ctx.redirect(process.env.APP_CLIENT_URL + '/cd');
    }
}