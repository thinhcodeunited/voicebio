const change_information = require('../../../helper/api/change_user_info');

module.exports = async (ctx) => {
    const { password, old_password } = ctx.request.body;

    if (!old_password) {
        ctx.flash('state.notifier', { status: false, message: ctx.i18n.__('MSG_OLD_PASSWORD_REQUIRED') });
        return ctx.redirect(process.env.APP_CLIENT_URL + '/user-security');
    }

    if (!password) {
        ctx.flash('state.notifier', { status: false, message: ctx.i18n.__('MSG_PASSWORD_REQUIRED') });
        return ctx.redirect(process.env.APP_CLIENT_URL + '/user-security');
    }

    if (password.length < 5 || password.length > 20) {
        ctx.flash('state.notifier', { status: false, message: ctx.i18n.__('MSG_PASSWORD_LIMIT_CHARACTERS') });
        return ctx.redirect(process.env.APP_CLIENT_URL + '/user-security');
    }

    // Gửi thông tin thay đổi
    const result = await change_information({
        access_token: ctx.state.access_token, 
        password, 
        old_password
    });

    if (!result) {
        ctx.flash('state.notifier', { status: false, message: ctx.i18n.__('MSG_CHANGE_PASSWORD_FAIL') });
        return ctx.redirect(process.env.APP_CLIENT_URL + '/user-security');
    }

    if (!result.status) {
        ctx.flash('state.notifier', { status: false, message: result.message });
        return ctx.redirect(process.env.APP_CLIENT_URL + '/user-security');
    }
 
    ctx.flash('state.notifier', { status: true, message: ctx.i18n.__('MSG_CHANGE_PASSWORD_SUCCESSFULLY') });
    return ctx.redirect(process.env.APP_CLIENT_URL + '/user-security');
}