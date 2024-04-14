const Router = require('@koa/router');
const router = new Router();

router.get('/', (ctx) => {
    return ctx.render('register', {});
});

router.get('/info', (ctx) => {
    return ctx.render('info', {});
});

router.get('/payment', (ctx) => {
    return ctx.render('payment', {});
});

const registerRouter = require('./register');
router.use('/api/register', registerRouter);

const infoRouter = require('./info');
router.use('/api/info', infoRouter);

const paymentRouter = require('./payment');
router.use('/api/payment', paymentRouter);

module.exports = router.routes();