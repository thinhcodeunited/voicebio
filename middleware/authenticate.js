const redisHelper = require('../helper/redis');

module.exports = async (ctx, next) => {
    const accessToken = ctx.session.accessToken;
    if (!accessToken) return ctx.redirect(process.env.APP_URL + "/login");

    const checkLife = await redisHelper.getSingleRedis(accessToken);
    if (!checkLife) {
        ctx.session.accessToken = null;
        return ctx.redirect(process.env.APP_URL + "/login");
    }

    ctx.state.accessToken = accessToken;
    return next();
}