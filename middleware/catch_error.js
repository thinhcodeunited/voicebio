module.exports = async (ctx, next) => {
    try {
        await next();
        // ending life cycle
        const status = ctx.status || 404;
        if (status === 404) {
            ctx.throw(404);
        }
    } catch (err) {
        console.log(err);
        ctx.body = {
            status: false,
            error_code: err.status || 500,
            error_string: err.error_string || 'unknown_error'
        };
    }
}