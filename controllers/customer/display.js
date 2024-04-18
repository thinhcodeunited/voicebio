module.exports = (ctx) => {
    const accessToken = ctx.state.accessToken;
    
    let stateMsg = ctx.flash('state.notifier');
    const pageData = {
        pageTitle: "Thông tin khách hàng",
        pageContent: "customer.ejs",
        activeTab: 'customer',
        stateMsg: (stateMsg.length > 0) ? stateMsg[0] : null,
        accessToken,
        API_URL: process.env.API_URL,
        API_URL2: process.env.API_URL2
    }

    return ctx.render('client/layout', pageData);
}