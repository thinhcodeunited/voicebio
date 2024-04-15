const Router = require('@koa/router');
const router = new Router();

const upload = require('../../../../vmg-pay/project/vivui-web-app/helper/images');

// Update profile photo
const postUploadProfilePhotoController = require('../../../../vmg-pay/project/vivui-web-app/controllers/app_client/ajax/post_upload_profile_photo');
router.post('/profile/update-profilePhoto', upload.single('imgProfile'), postUploadProfilePhotoController)

// Upload image default
const postUploadDefaultAvatarController = require('../../../../vmg-pay/project/vivui-web-app/controllers/app_client/ajax/post_upload_default');
router.post('/profile/update-default', postUploadDefaultAvatarController);

// Upload image
const postUploadImageController = require('../../../../vmg-pay/project/vivui-web-app/controllers/app_client/ajax/post_upload_images');
router.post('/profile/upload-image', upload.single('upload'), postUploadImageController);

const sendOtpCodeController = require('../../../../vmg-pay/project/vivui-web-app/controllers/app_client/ajax/send_otp_code');
router.post('/send-otp-code', sendOtpCodeController);

const transferMoneyController = require('../../../../vmg-pay/project/vivui-web-app/controllers/app_client/ajax/transfer_money');
router.post('/wallet/transfer-money', transferMoneyController);

const withdrawalMoneyController = require("../../../../vmg-pay/project/vivui-web-app/controllers/app_client/ajax/withdrawal_money");
const { authenticate } = require('../../../../vmg-pay/project/vivui-web-app/middleware/api/authenticate');
router.post('/wallet/withdrawal', withdrawalMoneyController);

// Bank information saving
const bankInforController = require("../../../../vmg-pay/project/vivui-web-app/controllers/app_client/ajax/bank_infor");
router.post("/wallet/bank-saved", bankInforController)

module.exports = router.routes();