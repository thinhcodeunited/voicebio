// Bắt các lỗi ngoại lệ và hiển thị trang 404
module.exports = async (ctx, next) => {
    try {
        await next();
        const status = ctx.status || 404;
        if (status === 404) {
            await ctx.render('error', {
                status,
                message: "Không tìm thấy tài nguyên"
            });
        }
    } catch (err) {
        const status = err.status || 500;
        await ctx.render('error', {
            status,
            message: err.message || "Lỗi không xác định"
        });
    }
}