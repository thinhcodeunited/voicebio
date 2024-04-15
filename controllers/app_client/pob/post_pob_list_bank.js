const axios = require('axios');
const makeSignatureHelper = require('../../../helper/make_signature');

module.exports = async (ctx) => {
    try {
        let payload = {
            "client_id": process.env.CHI_HO_CLIENT_ID,
            "language": "en"
        };
        payload = { ...payload, signature: makeSignatureHelper(payload, process.env.CHI_HO_CLIENT_SECRET) }

        let res = await axios.post(process.env.CHI_HO_API_URL + '/api/v1/disbursement/list-bank', payload);
      
        if (!res || !res.data || !res.data.status || !res.data.data)  return ctx.body = {
            status: false,
            message: ctx.i18n.__('MSG_GET_POB_LIST_BANK_ERROR')
        }

        return ctx.body = {
            status: true,
            message: ctx.i18n.__('MSG_GET_POB_LIST_BANK_SUCCESS'),
            data : res.data.data
        }
    } catch (error) {
        return ctx.body = {
            status: false,
            message: ctx.i18n.__('MSG_GET_POB_LIST_BANK_ERROR')
        }
    }
}