module.exports = async (ctx) => {
    let stateMsg = ctx.flash('state.notifier');
    const pageData = {
        pageTitle: "Thanh toán",
        pageContent: "payment.ejs",
        activeTab: 'payment',
        stateMsg: (stateMsg.length > 0) ? stateMsg[0] : null,
    }
    return ctx.render('client/layout', pageData);
}