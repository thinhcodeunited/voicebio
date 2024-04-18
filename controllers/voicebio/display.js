const redisHelper = require('../../helper/redis');
const textCheck = require('../../config/text_check');
const { randomString } = require('../../helper/data_type');

module.exports = async (ctx) => {
    const { user_code } = ctx.request.query;

    const getUserInfo = await redisHelper.getSingleRedis(`${user_code}_data_customer`);
    let listText = textCheck.sort(() => Math.random() - 0.5);
    listText = listText.map(e => e.replace('$i', randomString(6, "0123456789")));

    let stateMsg = ctx.flash('state.notifier');
    const pageData = {
        pageTitle: "Thông tin khách hàng",
        pageContent: "voicebio.ejs",
        activeTab: 'voicebio',
        stateMsg: (stateMsg.length > 0) ? stateMsg[0] : null,
        userData: getUserInfo ? JSON.parse(getUserInfo) : null,
        listText
    }

    return ctx.render('client/layout', pageData);
}