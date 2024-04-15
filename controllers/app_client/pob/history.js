const chihoFactory = require('../../../models/chiho.factory');

module.exports = async (ctx) => {
  let commonData = ctx.state.commonData;
  const user = ctx.state.user;

  let orders = await chihoFactory.getItems({ user });
  console.log(orders);
  commonData = {
    ...commonData,
    orders: orders ? orders : [],
    content: "pob/history.ejs",
    title: ctx.i18n.__("MSG_POB_HISTORY_TITLE"),
    act_content: "pob-history",
  };

  return ctx.render("client/layout", commonData);
};
