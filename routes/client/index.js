const Router = require('@koa/router');
const router = new Router();

// Callback of SSO
router.get('/auth/callback', (ctx, next) => {
    const {access_token, refresh_token, access_expired} = ctx.request.query;

    if (!access_token) {
        return ctx.redirect(process.env.APP_AUTH_URL);
    }

    ctx.session.access_token = access_token;
    return ctx.redirect(process.env.APP_CLIENT_URL);
});

const ipnRouter = require('./ipn');
router.use(ipnRouter);

// Authenticate routes
const authenticate = require('../../middleware/web/authenticate');
router.use(authenticate);

// Ajax routes
const ajaxRouter = require('./ajax');
router.use('/ajax', ajaxRouter);

// Common data routes
const getCommonData = require('../../middleware/web/get_common_data');
router.use(getCommonData);

const settingsRouter = require('./settings');
router.use(settingsRouter);

const paymentRouter = require('./payment');
router.use(paymentRouter);

const pobRouter = require('./pob');
router.use(pobRouter);

const cdRouter = require('./cd');
router.use(cdRouter);

module.exports = router.routes();
