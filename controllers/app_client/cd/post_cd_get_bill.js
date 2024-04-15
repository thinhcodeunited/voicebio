const axios = require('axios');

module.exports = async (ctx) => {
    const { service_code, customer_id } = ctx.request.body;
    if (!service_code || !customer_id) {
        return ctx.body = {
            status: false,
            message: ctx.i18n.__('MSG_CD_GET_BILL_ERROR')
        }
    }

    try {
        const payload = {
            "client_id": process.env.THU_HO_CLIENT_ID,
            "service_code": service_code,
            "customer_id": customer_id,
            "language": "vi",
            "signature": "112233"
        };

        let res = await axios.post(process.env.THU_HO_API_URL + '/api/v1/collection/check-bill', payload);
        if (!res || !res.data) {
            return ctx.body = {
                status: false,
                message: ctx.i18n.__('MSG_CD_GET_BILL_ERROR')
            }
        }

        if (!res.data.status) {
            return ctx.body = {
                status: false,
                message: res.data.error_message
            }
        }

        let { customer, bills } = res.data.data;
        if (!customer || !bills || bills.length < 1) {
            return ctx.body = {
                status: false,
                message: ctx.i18n.__('MSG_CD_GET_BILL_ERROR')
            }
        }

        return ctx.body = {
            status: true,
            message: ctx.i18n.__('MSG_CD_GET_BILL_SUCCESS'),
            data: {
                ...customer,
                ...bills[0]
            }
        }
    } catch (error) {
        return ctx.body = {
            status: false,
            message: ctx.i18n.__('MSG_CD_GET_BILL_ERROR')
        }
    }
}