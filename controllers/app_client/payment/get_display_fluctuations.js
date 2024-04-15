const get_list_fluctuations = require('../../../helper/api/get_list_fluctuations');

module.exports = async (ctx) => {
    let commonData = ctx.state.commonData;
    const access_token = ctx.state.access_token;

    const fluctuations = await get_list_fluctuations({ access_token });

    commonData = {
        ...commonData,
        fluctuations,
        content: 'wallet/fluctuations.ejs',
        title: ctx.i18n.__('MSG_FLUCTUATIONS_TITLE'),
        act_content: 'fluctuations'
    };

    return ctx.render('client/layout', commonData);
}