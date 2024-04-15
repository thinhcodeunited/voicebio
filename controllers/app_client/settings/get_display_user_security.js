module.exports = async (ctx) => {
    let commonData = ctx.state.commonData;
    commonData.title = ctx.i18n.__('MSG_USER_SECURITY_TITLE');
    commonData.content = 'settings/user_security.ejs';
    commonData.act_content = 'user-security';

    return ctx.render('client/layout', commonData);
}