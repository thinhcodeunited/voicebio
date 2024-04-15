module.exports = async (ctx) => {
    const file = ctx.file;

    return ctx.body = {
        status: true,
        uploadedImage: `${process.env.APP_CLIENT_URL}/uploads/${file.filename}`,
        relativeUploadedImage: `/uploads/${file.filename}`,
        message: ctx.i18n.__('MSG_UPLOAD_PHOTO_SUCCESSFULLY')
    }
}