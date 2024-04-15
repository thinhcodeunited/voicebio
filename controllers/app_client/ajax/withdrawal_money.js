const ErrorHandler = require("../../../error_handler/error_handler");
const { isNumeric } = require("../../../helper/data_type");
const api_withdraw_money = require("../../../helper/api/withdraw_money");
module.exports = async (ctx) => {
  const {
    amount,
    bank_code,
    account_number,
    account_name,
    identify_number,
    otp,
    save_bank,
  } = ctx.request.body;
  const access_token = ctx.state.access_token;

  if (!amount || !isNumeric(amount)) {
    return (ctx.body = {
      status: false,
      message: ctx.i18n.__("MSG_INVALID_WITHDRAWAL_AMOUNT"),
    });
  }
  if (!bank_code) {
    return (ctx.body = {
      status: false,
      message: ctx.i18n.__("MSG_INVALID_BANK_CODE"),
    });
  }

  if (!account_number) {
    return (ctx.body = {
      status: false,
      message: ctx.i18n.__("MSG_INVALID_WITHDRAWAL_ACCOUNT_NUMBER"),
    });
  }

  if (!account_name) {
    return (ctx.body = {
      status: false,
      message: ctx.i18n.__("MSG_INVALID_WITHDRAWAL_ACCOUNT_NAME"),
    });
  }

  if (!identify_number) {
    return (ctx.body = {
      status: false,
      message: ctx.i18n.__("MSG_INVALID_IDENTIFY_NUMBER"),
    });
  }

  if (!otp) {
    return (ctx.body = {
      status: false,
      message: ctx.i18n.__("MSG_OTP_EMPTY"),
    });
  }

  const payload = {
    bank_code,
    account_number,
    account_name,
    identify_number,
    otp,
    access_token,
    amount: amount,
    save_bank,
  };
  // Call api to withdrawal
  const response = await api_withdraw_money(payload);
  console.log("=================API WITHDRAWAL===================");
  console.log(response);
  console.log("=================API WITHDRAWAL===================");
  if (response && response.errorCode === 229) {
    return (ctx.body = {
      status: false,
      message: ctx.i18n.__("MSG_WITHDRAWAL_TRANSACTION_PROCESSING"),
      errorCode: 229,
    });
  }
  if (response && response.errorCode !== 0) {
    return (ctx.body = {
      ...response,
      status: false,
    });
  }
  return (ctx.body = response);
};
