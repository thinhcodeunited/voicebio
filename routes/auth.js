const Router = require('@koa/router');
const router = new Router();

const logoutController = require('../controllers/auth/login_form');
router.get('/logout', logoutController);

const loginFormController = require('../controllers/auth/login_form');
router.get('/login', loginFormController);

const postLoginController = require('../controllers/auth/post_login');
router.post('/login', postLoginController);

module.exports = router.routes();