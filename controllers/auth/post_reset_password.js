const reset_password = require('../../../helper/api/reset_password');
const forbiddenWord = require('../../../utils/word_filters/word_in_game');
const { hasSpecialChars } = require('../../../helper/data_type');

module.exports = async (ctx) => {
    let { token, password } = ctx.request.body;
  
    if (!token) {
        ctx.flash('state.notifier', { status: false, message: ctx.i18n.__('MSG_TOKEN_EXPIRED') });
        return ctx.redirect(process.env.APP_AUTH_URL);
    }

    if (!password) {
        ctx.flash('state.notifier', { status: false, message: ctx.i18n.__('MSG_PASSWORD_REQUIRED') });
        return ctx.redirect(process.env.APP_AUTH_URL);
    }

    const res = await reset_password({ token, password });

    if (!res) {
        ctx.flash('state.notifier', { status: false, message: ctx.i18n.__('MSG_RESET_PASSWORD_FAIL') });
        return ctx.redirect(process.env.APP_AUTH_URL);
    }

    if (!res.status) {
        ctx.flash('state.notifier', { status: false, message: res.message });
        return ctx.redirect(process.env.APP_AUTH_URL);
    }

    // That's ok 
    ctx.flash('state.notifier', { status: true, message: ctx.i18n.__('MSG_RESET_PASSWORD_SUCCESSFULLY') });
    return ctx.redirect(process.env.APP_AUTH_URL);
}