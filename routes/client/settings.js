const Router = require('@koa/router');
const router = new Router();

const getUserInformationFormController = require('../../controllers/app_client/settings/get_display_user_information');
router.get('/user-information', getUserInformationFormController);
router.get('/settings', getUserInformationFormController);
router.get('/', getUserInformationFormController);

const getSecurityFormController = require('../../controllers/app_client/settings/get_display_user_security');
router.get('/user-security', getSecurityFormController);

// Update profile information
const postChangeInformationController = require('../../controllers/app_client/settings/post_change_information');
router.post('/change_information', postChangeInformationController);

// Change login detail
const postChangeLoginController = require('../../controllers/app_client/settings/post_change_login');
router.post('/change_login', postChangeLoginController);

module.exports = router.routes();
