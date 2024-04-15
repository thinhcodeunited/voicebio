const axios = require('axios');
const thuhoFactory = require('../../../models/thuho.factory');
const { HmacSHA256 } = require('crypto-js');
const clientId = process.env.THU_HO_CLIENT_ID;
const clientSecret = process.env.THU_HO_CLIENT_SECRET;
const method_code = 'BIDV';
const type = 'ATM';

module.exports = async (ctx) => {
    const user = ctx.state.user;
    const { account_number, account_name, service_code, customer_id, bill_number, amount, customer_name, customer_address, period, extra_data } = ctx.request.body;
    if (!account_number || !account_name || !service_code || !customer_id || !bill_number) {
        return ctx.body = {
            status: false,
            message: ctx.i18n.__('MSG_CD_CREATE_PAYMENT_VIA_BANK_ERROR')
        }
    }

    try {
        // Khởi tạo yêu cầu thu hộ
        const thuhoQuery = {
            account_number,
            account_name,
            method: method_code,
            type,
            service_code,
            customer_id,
            customer_name,
            customer_address,
            bill_number,
            period,
            amount,
            extra_data,
            user,
            clientId,
            clientSecret
        }
        const order = await thuhoFactory.createItem(thuhoQuery);
        if (!order) {
            return ctx.body = {
                status: false,
                message: ctx.i18n.__('MSG_CD_CREATE_PAYMENT_VIA_BANK_ERROR')
            }
        }

        let payload = {
            "account_name": account_name,
            "account_number": account_number,
            "bill_number": bill_number,
            "client_id": process.env.THU_HO_CLIENT_ID,
            "customer_id": customer_id,
            "language": "vi",
            "method_code": method_code,
            "order_id": order._id.toString(),
            "service_code": service_code,
            "type": type,
        }
        const signature = await HmacSHA256(Object.values(payload).join('||'), clientSecret).toString();
        payload = { ...payload, signature }
        console.log(payload);
        let res = await axios.post(process.env.THU_HO_API_URL + '/api/v1/collection/create-transaction', payload);

        if (!res || !res.data) {
            return ctx.body = {
                status: false,
                message: ctx.i18n.__('MSG_CD_CREATE_PAYMENT_VIA_BANK_ERROR')
            }
        }
  
        const { error_code, error_message, transaction_id } = res.data;
        if (!res.data.status) {
            // Cập nhật thu hộ
            await thuhoFactory.updateItem({ _id: order._id }, {
                errorCode: error_code,
                errorMessage: error_message,
                status: 'error'
            });

            return ctx.body = {
                status: false,
                message: res.data.error_message
            }
        }

        // Cập nhật thu hộ
        await thuhoFactory.updateItem({ _id: order._id }, { transaction_id });
        let { paymentUrl } = res.data.data;
        if (!paymentUrl) {
            return ctx.body = {
                status: false,
                message: ctx.i18n.__('MSG_CD_CREATE_PAYMENT_VIA_BANK_ERROR')
            }
        }

        return ctx.body = {
            status: true,
            message: ctx.i18n.__('MSG_CD_CREATE_PAYMENT_QR_CODE_SUCCESS'),
            data: paymentUrl
        }
    } catch (error) {
        console.log(error);
        return ctx.body = {
            status: false,
            message: ctx.i18n.__('MSG_CD_CREATE_PAYMENT_VIA_BANK_ERROR')
        }
    }
}