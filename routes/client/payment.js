const Router = require('@koa/router');
const router = new Router();

const getDisplayPaymentController = require('../../controllers/app_client/payment/get_display_recharge');
router.get('/payment', getDisplayPaymentController);

const postPaymentsViaWalletController = require('../../controllers/app_client/payment/post_payments_via_wallet');
router.post('/payment/payment-via-wallet', postPaymentsViaWalletController);

const postPaymentsViaBankController = require('../../controllers/app_client/payment/post_payments_via_bank');
router.post('/payment/payment-via-bank', postPaymentsViaBankController);

// Wallet History
const getWalletHistoryController = require('../../controllers/app_client/payment/get_display_transaction_history');
router.get('/transaction-history', getWalletHistoryController);

// Callback
// http://127.0.0.1:4001/payments/callback
const postPaymentsCallbackController = require('../../controllers/app_client/payment/post_payments_callback');
router.get('/payments/callback', postPaymentsCallbackController);

// Wallet History
const getFluctuationsHistoryController = require('../../controllers/app_client/payment/get_display_fluctuations');
router.get('/fluctuations', getFluctuationsHistoryController);

module.exports = router.routes();
