const Router = require('@koa/router');
const router = new Router();

const authRouter = require('./auth');
router.use(authRouter);

const checkAuthMiddleware = require('../middleware/authenticate');
router.use(checkAuthMiddleware);

 // Chưa có dashboard sẽ redirect về customer
router.get('/', (ctx) => {
    return ctx.redirect('/customer');
});

const customerRouter = require('./customer');
router.use(customerRouter);

const displayController = require('../controllers/voicebio/display');
router.get('/voicebio', displayController);

const displayVerifyController = require('../controllers/verify/display');
router.get('/verify', displayVerifyController);

const displayPaymentController = require('../controllers/payment/display');
router.get('/payment', displayPaymentController);

module.exports = router.routes();