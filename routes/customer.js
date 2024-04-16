const Router = require('@koa/router');
const router = new Router();

const displayController = require('../controllers/customer/display');
router.get('/customer', displayController);

const createCustomerController = require('../controllers/customer/create_customer');
router.post('/customer/create', createCustomerController);

module.exports = router.routes();