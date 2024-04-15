const ssoLoginConfig = require('../../../config/sso_login');
const { isValidPhonenumber, parseCommonPhone } = require('../../../helper/data_type');
const login_app = require('../../../helper/api/login_app');

module.exports = async (ctx) => {
    // Dừng hoạt động login nếu đã có ecokey
    if (ctx.session.ecosystem_key) return ctx.throw(ctx.i18n.__('MSG_SYSTEM_ERROR_OCCURRED'));

    const { username, password, query, service } = ctx.request.body;
    const service_code = ssoLoginConfig()[service].code;

    if (!username) {
        ctx.flash('state.notifier', { status: false, message: ctx.i18n.__('MSG_USERNAME_REQUIRED') });
        return ctx.redirect(process.env.APP_AUTH_URL + (query ? '?' + query : ''));
    }

    if (!password) {
        ctx.flash('state.notifier', { status: false, message: ctx.i18n.__('MSG_PASSWORD_REQUIRED') });
        return ctx.redirect(process.env.APP_AUTH_URL + (query ? '?' + query : ''));
    }

    if (isValidPhonenumber(username)) {
        username = parseCommonPhone(username);
    }

    // Login vào hệ thống
    const res = await login_app({ ctx, username, password, service_code });

    if (!res) {
        ctx.flash('state.notifier', { status: false, message: ctx.i18n.__('MSG_LOGIN_FAIL') });
        return ctx.redirect(process.env.APP_AUTH_URL + (query ? '?' + query : ''));
    }

    if (!res.status) {
        ctx.flash('state.notifier', { status: false, message: res.message });
        return ctx.redirect(process.env.APP_AUTH_URL + (query ? '?' + query : ''));
    }

    // It's ok, store access token
    ctx.session.ecosystem_key = res.data.ecosystem_key;

    // That's ok , let go to profile
    return ctx.redirect(res.data.callback);
}