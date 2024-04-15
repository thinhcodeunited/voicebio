const { isValidPhonenumber, isNumeric } = require('../../../helper/data_type');
const forbiddenWord = require('../../../utils/word_filters/word_in_game');
const change_information = require('../../../helper/api/change_user_info');

module.exports = async (ctx) => {
    let { fullName, address, dob, phone, gender, identityCardNumber, recipients, dateRecipients, identityHometown, identityNationality, identityLicenseBefore, identityLicenseAfter } = ctx.request.body;

    if (phone) {
        if (!isValidPhonenumber(phone)) {
            ctx.flash('state.notifier', { status: false, message: ctx.i18n.__('MSG_INVALID_PHONE_TYPE') });
            return ctx.redirect(process.env.APP_CLIENT_URL);
        }
    }

    if (identityCardNumber) {
        if (!isNumeric(identityCardNumber)) {
            ctx.flash('state.notifier', { status: false, message: ctx.i18n.__('MSG_INVALID_IDENTITY_NUMBER_TYPE') });
            return ctx.redirect(process.env.APP_CLIENT_URL);
        }

        if (identityCardNumber.length > 12 || identityCardNumber.length < 9) {
            ctx.flash('state.notifier', { status: false, message: ctx.i18n.__('MSG_INVALID_IDENTITY_NUMBER_LENGTH') });
            return ctx.redirect(process.env.APP_CLIENT_URL);
        }
    }

    if (fullName) {
        if (forbiddenWord.includes(fullName.toLowerCase())) {
            ctx.flash('state.notifier', { status: false, message: ctx.i18n.__('MSG_FULL_NAME_STANDARD_VIOLATION') });
            return ctx.redirect(process.env.APP_CLIENT_URL);
        }
    }

    const query_to_change = {
        access_token: ctx.state.access_token,
        phone,
        full_name: fullName,
        address,
        gender,
        dob,
        identity_card_number: identityCardNumber,
        recipients,
        date_recipients: dateRecipients,
        identity_hometown: identityHometown,
        identity_nationality: identityNationality,
        identity_license_before: identityLicenseBefore,
        identity_license_after: identityLicenseAfter
    };

    // Gửi api thay đổi thông tin
    const result = await change_information(query_to_change);
    if (!result) {
        ctx.flash('state.notifier', { status: false, message: ctx.i18n.__('MSG_UPDATE_USER_INFORMATION_FAIL') });
        return ctx.redirect(process.env.APP_CLIENT_URL);
    }

    if (!result.status) {
        ctx.flash('state.notifier', { status: false, message: result.message });
        return ctx.redirect(process.env.APP_CLIENT_URL);
    }

    ctx.flash('state.notifier', { status: true, message: ctx.i18n.__(`MSG_UPDATE_USER_INFORMATION_SUCCESSFULLY`) });
    return ctx.redirect(process.env.APP_CLIENT_URL);
}