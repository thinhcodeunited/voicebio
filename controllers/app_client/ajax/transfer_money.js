const { isValidId, isNumeric } = require('../../../helper/data_type');
const api_transfer_money = require('../../../helper/api/transfer_money');

module.exports = async (ctx) => {
    let { transfer_to_user, transfer_money, transfer_otp } = ctx.request.body;
    const access_token = ctx.state.access_token;
    if (transfer_money) transfer_money = transfer_money.split(/[,.]+/).join('');

    if (!isValidId(transfer_to_user)) {
        return ctx.body = {
            status: false,
            message: ctx.i18n.__('MSG_INVALID_TRANSFER_RECEIVER')
        }
    }
    if (!transfer_money || !isNumeric(transfer_money)) {
        return ctx.body = {
            status: false,
            message: ctx.i18n.__('MSG_INVALID_TRANSFER_MONEY')
        }
    }
    if (!transfer_otp) {
        return ctx.body = {
            status: false,
            message: ctx.i18n.__('MSG_OTP_EMPTY')
        }
    }
    // Call api to transfer
    const result = await api_transfer_money({ access_token, otp: transfer_otp, amount: transfer_money, receiver: transfer_to_user })
   
    if (!result) {
        return ctx.body = {
            status: false,
            message: ctx.i18n.__('MSG_TRANSFER_MONEY_FAIL')
        }
    }

    if (!result.status) {
        return ctx.body = {
            status: false,
            message: result.message
        }
    }

    return ctx.body = {
        status: true,
        message: ctx.i18n.__('MSG_TRANSFER_MONEY_SUCCESSFULLY')
    }
}