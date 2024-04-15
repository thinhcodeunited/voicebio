const axios = require('axios');
const makeSignatureHelper = require('../../../helper/make_signature');

module.exports = async (ctx) => {
    const {bank_code, account_number} = ctx.request.body;
    if (!bank_code || !account_number) return ctx.body = {
        status: false,
        message: ctx.i18n.__('MSG_POB_GET_RECEIVER_ERROR')
    }

    try {
        let body = {
            client_id: process.env.CHI_HO_CLIENT_ID,
            data_receiver: [{
                bank_code: bank_code,
                account_number: account_number
            }],
            language: "vi"
        }

        let bodySignature = { ...body };
        bodySignature.data_receiver = JSON.stringify(bodySignature.data_receiver);
        body = { ...body, signature: makeSignatureHelper(bodySignature, process.env.CHI_HO_CLIENT_SECRET) }


        let res = await axios.post(process.env.CHI_HO_API_URL + '/api/v1/disbursement/get-receiver', body);
        if (!res || !res.data || !res.data.status || !res.data.data || res.data.data.length < 1)  return ctx.body = {
            status: false,
            message: ctx.i18n.__('MSG_POB_GET_RECEIVER_ERROR')
        }

        return ctx.body = {
            status: true,
            message: ctx.i18n.__('MSG_POB_GET_RECEIVER_SUCCESS'),
            data : res.data.data[0]
        }
    } catch (error) {
        return ctx.body = {
            status: false,
            message: ctx.i18n.__('MSG_POB_GET_RECEIVER_ERROR')
        }
    }
}