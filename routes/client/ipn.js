const Router = require('@koa/router');
const router = new Router();

const cdPaymentsIPNController = require('../../controllers/app_client/cd/ipn');
router.post('/cd/payments/ipn', cdPaymentsIPNController);

const pobPaymentsIPNController = require('../../controllers/app_client/pob/ipn');
router.post('/pob/payments/ipn', pobPaymentsIPNController);

module.exports = router.routes();