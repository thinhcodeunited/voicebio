const change_information = require('../../../helper/api/change_user_info');

module.exports = async (ctx) => {
    const file = ctx.file;
    const access_token = ctx.state.access_token;
    const  profilePhoto =  (file) ? `/uploads/${file.filename}` : null;

    const result = await change_information({access_token, profile_photo: profilePhoto})
    if (!result || !result.status) {
        return ctx.body = {
            status: false,
            message: ctx.i18n.__('MSG_UPLOAD_AVATAR_FAIL')
        }
    }

    return ctx.body = {
        status: true,
        profilePhoto: profilePhoto,
        message: ctx.i18n.__('MSG_UPLOAD_AVATAR_SUCCESSFULLY')
    }
}