const Router = require('@koa/router');
const router = new Router();

const displayController = require('../controllers/voicebio/display');
router.get('/voicebio', displayController);

const createCustomerController = require('../controllers/voicebio/create_customer');
router.post('/customer/create', createCustomerController);

module.exports = router.routes();