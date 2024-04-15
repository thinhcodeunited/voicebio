const ssoLoginConfig = require('../../../config/sso_login');

module.exports = async (ctx) => {
    let service = 'id';
    if (ctx.request.url.includes('nsfw')) {
        service = 'nsfw';
    }

    const stateMsg = ctx.flash('state.notifier');
   
    if (!ctx.session.ecosystem_key) {
        return ctx.render('auth/login', {
            stateMsg: (stateMsg.length > 0) ? stateMsg[0] : null,
            envAuthUrl: process.env.APP_AUTH_URL,
            envApiUrl: process.env.APP_API_URL,
            queryString: ctx.request.querystring,
            i18n: ctx.i18n,
            service
        });
    }

    return ctx.redirect(ssoLoginConfig()[service].callbackURI + '?access_token=' + ctx.state.access_token);
}