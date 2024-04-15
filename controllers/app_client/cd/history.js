const thuhoFactory = require('../../../models/thuho.factory');

module.exports = async (ctx) => {
  let commonData = ctx.state.commonData;
  const user = ctx.state.user;

  let orders = await thuhoFactory.getItems({ user });

  commonData = {
    ...commonData,
    orders: orders ? orders : [],
    content: "cd/history.ejs",
    title: ctx.i18n.__("MSG_CD_HISTORY_TITLE"),
    act_content: "cd-history",
  };

  return ctx.render("client/layout", commonData);
};
