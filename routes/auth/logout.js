const Router = require('@koa/router');
const router = new Router();
const axios = require('axios');

const usersActivityFactory = require('../../models/users_activity.factory');

const clear_ecosystem_key = async (ecosystem_key) => {
    if (!ecosystem_key) return false;

    // Tìm list khác dựa theo ecosystem key
    const list_devices = await usersActivityFactory.getItemsByQuery({ ecosystem_key });
    if (!list_devices || list_devices.length < 1) return true;

    // Cập nhật lại danh sách này
    const list_device_ids = list_devices.map(e => e._id);
    await usersActivityFactory.updateManyItem({ _id: { $in: list_device_ids } }, { ecosystem_key: null, access_token: null, refresh_token: null, type: 'force-logout' })
}

router.get(['/logout', '/logout/:type'], async (ctx) => {
    const type = ctx.params.type;
    
    // Remove all access token from ecokey
    await clear_ecosystem_key(ctx.session.ecosystem_key);

    try {
        const headers = {
            Authorization: `Bearer ${ctx.state.access_token}`
        }

        await axios.post(process.env.APP_API_URL + '/api/auth/logout', {}, { headers });
    } catch (error) {
       
        // Do nothing
    }

    switch (type) {
        case 'nsfw':
            link_redirect = process.env.APP_AUTH_URL + '/authorize/nsfw';
            break;
        default:
            link_redirect = process.env.APP_AUTH_URL;
            break;
    }

    // Xóa ecosystem_key và access_key
    // ctx.session.access_token = null;
    // ctx.session.ecosystem_key = null;

    return ctx.redirect(link_redirect);
});

module.exports = router.routes();