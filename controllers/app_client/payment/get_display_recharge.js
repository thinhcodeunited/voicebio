const cardValues = require('../../../config/payment_conf');

module.exports = async (ctx) => {
    let commonData = ctx.state.commonData;
    commonData.content = 'payment/payment.ejs';
    commonData.title = ctx.i18n.__('MSG_PAYMENT_TITLE');
    commonData.act_content = '';

    commonData = {
        ...commonData,
        cardValues
    };

    return ctx.render('client/layout', commonData);
}