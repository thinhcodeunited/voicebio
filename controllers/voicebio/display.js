const redisHelper = require('../../helper/redis');

module.exports = async (ctx) => {
    const {user_code} = ctx.request.query;

    const getUserInfo = await redisHelper.getSingleRedis(`${user_code}_data_customer`);

    let stateMsg = ctx.flash('state.notifier');
    const pageData = {
        pageTitle: "Thông tin khách hàng",
        pageContent: "voicebio.ejs",
        activeTab: 'voicebio',
        stateMsg: (stateMsg.length > 0) ? stateMsg[0] : null,
        userData: getUserInfo ? JSON.parse(getUserInfo) : null
    }

    return ctx.render('client/layout', pageData);
}