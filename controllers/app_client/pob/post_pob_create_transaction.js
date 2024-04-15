const axios = require('axios');
const chihoFactory = require('../../../models/chiho.factory');
const clientId = process.env.CHI_HO_CLIENT_ID;
const clientSecret = process.env.CHI_HO_CLIENT_SECRET;
const chihoEndPoint = process.env.CHI_HO_API_URL;
const makeSignatureHelper = require('../../../helper/make_signature');

module.exports = async (ctx) => {
    const user = ctx.state.user;
    const { bank_code, account_number, account_name, amount } = ctx.request.body;
    if (!bank_code || !account_number || !account_name || !amount) return ctx.body = {
        status: false,
        message: ctx.i18n.__('MSG_POB_CREATE_TRANSACTION_ERROR')
    }

    try {
        const order_info = "Thu nghiem chi ho";

        /// Khởi tạo yêu cầu chi hộ
        const chihoQuery = {
            bank_code,
            account_number,
            account_name,
            amount,
            order_info,
            user,
            clientId,
            clientSecret
        }
        const order = await chihoFactory.createItem(chihoQuery);

        let body = {
            client_id: clientId,
            data_receiver: [{
                "bank_code": bank_code,
                "account_number": account_number,
                "amount": amount
            }],

            language: "vi",
            order_id: order._id.toString(),
            order_info: order_info,
        }
        // Convert array to string
        let bodySignature = { ...body };
        bodySignature.data_receiver = JSON.stringify(bodySignature.data_receiver);
        body = { ...body, signature: makeSignatureHelper(bodySignature, process.env.CHI_HO_CLIENT_SECRET) }

        let res = await axios.post(chihoEndPoint + '/api/v1/disbursement/create-transaction', body);

        if (!res || !res.data) return ctx.body = {
            status: false,
            message: ctx.i18n.__('MSG_POB_CREATE_TRANSACTION_ERROR')
        }

        const { error_code, error_message, transaction_id } = res.data;
        let updateQuery = { transaction_id }

        if (error_code != '0') {
            updateQuery = {
                ...updateQuery,
                errorCode: error_code,
                errorMessage: error_message,
                status: 'error'
            }
            // Chi hộ thất bại, cập nhật order
            await chihoFactory.updateItem({ _id: order._id }, updateQuery);

            return ctx.body = {
                status: false,
                message: error_message
            }
        }

        // Cập nhật chi hộ
        await chihoFactory.updateItem({ _id: order._id }, updateQuery);

        return ctx.body = {
            status: true,
            message: ctx.i18n.__('MSG_POB_CREATE_TRANSACTION_SUCCESS')
        }
    } catch (error) {
        console.log(error);
        return ctx.body = {
            status: false,
            message: ctx.i18n.__('MSG_POB_CREATE_TRANSACTION_ERROR')
        }
    }
}