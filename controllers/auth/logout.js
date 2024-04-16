const redisHelper = require('../../helper/redis');

module.exports = async (ctx) => {
    const accessToken = ctx.session.accessToken;

    redisHelper.removeSingleRedis(accessToken);
    ctx.session.accessToken = '';

    return ctx.redirect(process.env.APP_URL + "/login");
}