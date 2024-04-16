const Router = require('@koa/router');
const router = new Router();

const authRouter = require('./auth');
router.use(authRouter);

const checkAuthMiddleware = require('../middleware/authenticate');
router.use(checkAuthMiddleware);

router.get('/', (ctx) => {
    let stateMsg = ctx.flash('state.notifier');
    const pageData = {
        pageTitle: "Thông tin khách hàng",
        pageContent: "customer_info.ejs",
        stateMsg: (stateMsg.length > 0) ? stateMsg[0] : null,
    }
    
    return ctx.render('client/layout', pageData);
});

// router.get('/info', (ctx) => {
//     return ctx.render('info', {});
// });

// router.get('/payment', (ctx) => {
//     return ctx.render('payment', {});
// });

// const registerRouter = require('./register');
// router.use('/api/register', registerRouter);

// const infoRouter = require('./info');
// router.use('/api/info', infoRouter);

// const paymentRouter = require('./payment');
// router.use('/api/payment', paymentRouter);

module.exports = router.routes();