const { languages } = require('../../../config/languages');
const get_user_activity = require('../../../helper/api/get_user_activity');
const moment = require('moment');

module.exports = async (ctx) => {
    let commonData = ctx.state.commonData;
    commonData.title = ctx.i18n.__('MSG_USER_INFORMATION_TITLE');
    commonData.content = 'settings/user_information.ejs';
    commonData.act_content = 'user-information';

    const access_token = ctx.state.access_token;
    let activities = await get_user_activity({ access_token });
    let loginDetail;
    if (activities && activities.length > 0) {
        loginDetail = activities[0].platform + ' - ' + activities[0].os + ' - IP:' + activities[0].ip;
    }

    let security_check_info = false;
    // Kiểm tra các thông tin trong CMND đã nhập đủ chưa?
    const {dob, identityCardNumber, recipients, dateRecipients, identityHometown, identityNationality, identityLicenseBefore, identityLicenseAfter } = commonData.user
    if ( !identityCardNumber || !recipients || !dateRecipients || !identityHometown || !identityNationality || !identityLicenseBefore || !identityLicenseAfter) {
        security_check_info = true;
    }

    // Kiểm tra ngày sinh xem đã đủ 18 tuổi chưa?
    let security_check_age = false;
    if (moment().diff(dob, 'years') < 18) {
        security_check_age = true;
    }

    commonData = {
        ...commonData,
        loginDetail,
        languages: {
            data: languages,
            currentLang: (commonData.user) ? commonData.user.language : process.env.APP_DEFAULT_LANGUAGE
        },
        security_check_info,
        security_check_age
    }

    return ctx.render('client/layout', commonData);
}