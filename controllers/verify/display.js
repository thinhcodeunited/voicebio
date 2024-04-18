module.exports = async (ctx) => {
    let stateMsg = ctx.flash('state.notifier');
    const pageData = {
        pageTitle: "Xác thực SĐT",
        pageContent: "verify.ejs",
        activeTab: 'verify',
        stateMsg: (stateMsg.length > 0) ? stateMsg[0] : null,
    }
    return ctx.render('client/layout', pageData);
}