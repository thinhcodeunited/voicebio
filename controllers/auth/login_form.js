
module.exports = async (ctx) => {
    let stateMsg = ctx.flash('state.notifier');

    if (!ctx.state.access_token) {
        return ctx.render('auth/login', {
            stateMsg: (stateMsg.length > 0) ? stateMsg[0] : null,
        });
    }

    return ctx.redirect("/");
}