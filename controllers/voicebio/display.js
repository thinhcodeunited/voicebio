module.exports = (ctx) => {
    let stateMsg = ctx.flash('state.notifier');
    const pageData = {
        pageTitle: "Thông tin khách hàng",
        pageContent: "voicebio.ejs",
        activeTab: 'voicebio',
        stateMsg: (stateMsg.length > 0) ? stateMsg[0] : null,
    }

    return ctx.render('client/layout', pageData);
}