module.exports = async (ctx, next) => {
    const accessToken = ctx.session.accessToken;
    if (!accessToken) return ctx.redirect('/login');
    return next();
}