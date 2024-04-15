const usersFactory = require('../../../models/users.factory');
const redisHelper = require('../../../helper/redis');

module.exports = async (ctx) => {
    const { token } = ctx.request.query;
    if (!token) return ctx.throw(ctx.i18n.__('MSG_TOKEN_EXPIRED'));

    const userId = await redisHelper.getSingleRedis(token);
    if (!userId) return ctx.throw(ctx.i18n.__('MSG_TOKEN_EXPIRED'));

    const user = await usersFactory.getUser(userId);
    const obj = {
        token,
        userLogo: (user.profilePhoto) ? user.profilePhoto : '/images/profile.png',
        userEmail: user.email,
        envAuthUrl: process.env.APP_AUTH_URL,
        envApiUrl: process.env.APP_API_URL,
        i18n: ctx.i18n
    }

    return ctx.render('auth/reset_password', obj);
}