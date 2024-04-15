module.exports = async (ctx) => {
    let commonData = ctx.state.commonData;
    commonData.content = 'cd/index.ejs';
    commonData.title = ctx.i18n.__('MSG_CD_TITLE');
    commonData.act_content = '';

    return ctx.render('client/layout', commonData);
}