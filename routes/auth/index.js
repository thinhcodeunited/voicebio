const Router = require('@koa/router');
const router = new Router();

const loginFormController = require('../../controllers/auth/login_form');
router.get('/login', loginFormController);

// const logout = require('./auth_logout');
// router.use(logout);

// const setState = require('../../middleware/web/app_auth/set_state');
// router.use(setState);

// const getDisplayFormController = require('../../controllers/app_auth/auth/get_display_form');
// const postLoginController = require('../../controllers/app_auth/auth/post_login');
// const postRegisterController = require('../../controllers/app_auth/auth/post_register');
// const getForgotPasswordController = require('../../controllers/app_auth/auth/get_forgot_password');
// const getResetPasswordController = require('../../controllers/app_auth/auth/get_reset_password');
// const postResetPasswordController = require('../../controllers/app_auth/auth/post_reset_password');
// const getVerifyUser = require('../../controllers/app_auth/auth/get_verify_user');

// router.get('/', getDisplayFormController);
// router.get('/authorize/nsfw', getDisplayFormController);

// router.post('/login', postLoginController);
// router.post('/register', postRegisterController);

// router.get('/forgot-password', getForgotPasswordController);
// router.get('/reset-password', getResetPasswordController);
// router.post('/reset-password', postResetPasswordController);
// router.get('/verify-user', getVerifyUser);

module.exports = router.routes();