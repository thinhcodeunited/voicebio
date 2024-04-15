const register_app = require('../../../helper/api/register_app');
const forbiddenWord = require('../../../utils/word_filters/word_in_game');
const { hasSpecialChars } = require('../../../helper/data_type');

module.exports = async (ctx) => {
    let { email, username, password, fullname, query, code } = ctx.request.body;
    if (!email) {
        ctx.flash('state.notifier', { status: false, message: ctx.i18n.__('MSG_EMAIL_REQUIRED') });
        return ctx.redirect(process.env.APP_AUTH_URL + (query ? '?' + query : ''));
    }

    if (!username) {
        ctx.flash('state.notifier', { status: false, message: ctx.i18n.__('MSG_USERNAME_REQUIRED') });
        return ctx.redirect(process.env.APP_AUTH_URL + (query ? '?' + query : ''));
    }

    if (!password) {
        ctx.flash('state.notifier', { status: false, message: ctx.i18n.__('MSG_PASSWORD_REQUIRED') });
        return ctx.redirect(process.env.APP_AUTH_URL + (query ? '?' + query : ''));
    }

    if (hasSpecialChars(username)) {
        ctx.flash('state.notifier', { status: false, message: ctx.i18n.__('MSG_USERNAME_HAS_SPECIAL_CHARACTERS') });
        return ctx.redirect(process.env.APP_AUTH_URL + (query ? '?' + query : ''));
    }

    if (forbiddenWord.includes(username.toLowerCase()) || forbiddenWord.includes(email.toLowerCase())) {
        ctx.flash('state.notifier', { status: false, message: ctx.i18n.__('MSG_USERNAME_STANDARD_VIOLATION') });
        return ctx.redirect(process.env.APP_AUTH_URL + (query ? '?' + query : ''));
    }

    const res = await register_app({ email, username, password, fullname, code });

    if (!res) {
        ctx.flash('state.notifier', { status: false, message: ctx.i18n.__('MSG_REGISTER_FAIL') });
        return ctx.redirect(process.env.APP_AUTH_URL + (query ? '?' + query : ''));
    }

    if (!res.status) {
        ctx.flash('state.notifier', { status: false, message: res.message });
        return ctx.redirect(process.env.APP_AUTH_URL + (query ? '?' + query : ''));
    }

    // That's ok 
    ctx.flash('state.notifier', { status: true, message: ctx.i18n.__('MSG_REGISTER_SUCCESSFULLY') });
    return ctx.redirect(process.env.APP_AUTH_URL + (query ? '?' + query : ''));
}