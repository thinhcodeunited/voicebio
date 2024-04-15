const Router = require('@koa/router');
const router = new Router();

const getDisplayCDController = require('../../controllers/app_client/cd/display');
router.get('/cd', getDisplayCDController);

const cdHistoryController = require('../../controllers/app_client/cd/history.js');
router.get('/cd-history', cdHistoryController);

const cdGetBillController = require("../../controllers/app_client/cd/post_cd_get_bill");
router.post("/cd/get-bill", cdGetBillController);

const cdCreateQRController = require("../../controllers/app_client/cd/post_cd_payment_crete_qr");
router.post("/cd/payment/create-qr", cdCreateQRController);

const cdPaymentViaWalletController = require("../../controllers/app_client/cd/post_cd_payment_via_wallet");
router.post("/cd/payment/payment-via-wallet", cdPaymentViaWalletController);

const cdPaymentViaBankController = require("../../controllers/app_client/cd/post_cd_payment_via_bank");
router.post("/cd/payment/payment-via-bank", cdPaymentViaBankController);

const cdPaymentsCallbackController = require('../../controllers/app_client/cd/payments_callback');
router.get('/cd/payments/callback', cdPaymentsCallbackController);

module.exports = router.routes();