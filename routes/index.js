const Router = require('@koa/router');
const router = new Router();

const authRouter = require('./auth');
router.use(authRouter);

const checkAuthMiddleware = require('../middleware/authenticate');
router.use(checkAuthMiddleware);

router.get('/', (ctx) => {
    // Chưa có dashboard sẽ redirect về customer
    return ctx.redirect('/customer');
});

const customerRouter = require('./customer');
router.use(customerRouter);

const voiceBioRouter = require('./voicebio');
router.use(voiceBioRouter);

const verifyRouter = require('./verify');
router.use(verifyRouter);

// router.get('/info', (ctx) => {
//     return ctx.render('info', {});
// });

router.get('/payment', (ctx) => {
    return ctx.render('payment', {});
});

// const registerRouter = require('./register');
// router.use('/api/register', registerRouter);

// const infoRouter = require('./info');
// router.use('/api/info', infoRouter);

const paymentRouter = require('./payment');
router.use('/api/payment', paymentRouter);

module.exports = router.routes();