const Router = require('@koa/router');
const router = new Router();

const getDisplayPOBController = require('../../controllers/app_client/pob/display');
router.get('/pob', getDisplayPOBController);

const pobHistoryController = require('../../controllers/app_client/pob/history.js');
router.get('/pob-history', pobHistoryController);

const pobListBankController = require("../../controllers/app_client/pob/post_pob_list_bank");
router.post("/pob/list-bank", pobListBankController);

const pobGetReceiverController = require("../../controllers/app_client/pob/post_pob_get_receiver");
router.post("/pob/get-receiver", pobGetReceiverController);

const pobCreateTransactionController = require("../../controllers/app_client/pob/post_pob_create_transaction");
router.post("/pob/create-transaction", pobCreateTransactionController);

module.exports = router.routes();