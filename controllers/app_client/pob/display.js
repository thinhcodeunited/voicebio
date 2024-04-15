module.exports = async (ctx) => {
    let commonData = ctx.state.commonData;
    commonData.content = 'pob/index.ejs';
    commonData.title = ctx.i18n.__('MSG_POB_TITLE');
    commonData.act_content = '';

    return ctx.render('client/layout', commonData);
}