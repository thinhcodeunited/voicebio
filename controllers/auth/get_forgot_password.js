
module.exports = async (ctx) => {
    ctx.session.ecosystem_key = null;

    return ctx.render('auth/forgot_password', {
        envAuthUrl: process.env.APP_AUTH_URL,
        envApiUrl: process.env.APP_API_URL,
        i18n: ctx.i18n
    });
}