const ErrorHandler = require("../../../error_handler/error_handler");
const usersFactory = require("../../../models/users.factory");
const UserBankInforModel = require("../../../models/mongod/user_bank_infor.db");
const axios = require("axios");
const code = require("../../../error_handler/error/code");
const URL_API = `${process.env.APP_API_URL}/api/wallet/bank-saved`;
module.exports = async (ctx) => {
  try {
    const { bank_code } = ctx.request.body;
    const access_token = ctx.state.access_token;
    const payload = {
      bank_code,
    };
    const response = await axios.post(URL_API, payload, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    ctx.body = response.data;
  } catch (error) {
    ctx.body = {
      status: false,
      message: code[500],
      error: error.message,
    };
  }
};
