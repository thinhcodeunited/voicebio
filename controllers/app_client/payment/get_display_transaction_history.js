const get_list_transactions = require("../../../helper/api/get_list_transactions");
module.exports = async (ctx) => {
  let commonData = ctx.state.commonData;
  const access_token = ctx.state.access_token;

  let orders = await get_list_transactions({ access_token });

  commonData = {
    ...commonData,
    orders: orders ? orders : [],
    content: "payment/transaction_history.ejs",
    title: ctx.i18n.__("MSG_TRANSACTION_HISTORY"),
    act_content: "transaction-history",
  };

  return ctx.render("client/layout", commonData);
};
