const usersFactory = require('../../../models/users.factory');
const redisHelper = require('../../../helper/redis');

module.exports = async (ctx) => {
    const { token } = ctx.request.query;
    if (!token) return ctx.throw(404, ctx.i18n.__('MSG_RESOURCE_NOT_FOUND'));

    // Verify token
    const is_verified = await redisHelper.verifyRedis(token);
    if (!is_verified) return ctx.throw(ctx.i18n.__('MSG_EXPIRED_TOKEN'));

    // Get user_id from token
    const userId = await redisHelper.getSingleRedis(token);

    // update user info with replace
    const newobj = await usersFactory.updateUser(userId, { isVerified: true });
    if (!newobj) return ctx.throw(ctx.i18n.__('MSG_TOKEN_VERIFY_FAIL'))

    // Remove token from redis
    await redisHelper.removeSingleRedis(token);

    // That's ok 
    ctx.flash('state.notifier', { status: true, message: ctx.i18n.__('MSG_TOKEN_VERIFY_SUCCESSFULLY') });
    return ctx.redirect(process.env.APP_AUTH_URL);
}