const thuhoFactory = require('../../../models/thuho.factory');
const axios = require('axios');
const { HmacSHA256 } = require('crypto-js');

module.exports = async (ctx) => {
    const { bill_number, order_id, error_code, error_message, price, transaction_id, signature } = ctx.request.body;
    if (!bill_number ||
        !order_id ||
        typeof error_code === 'undefined' ||
        !error_message ||
        !price ||
        !transaction_id ||
        !signature
    ) return ctx.body = { status: false };

    const findOrder = await thuhoFactory.getItem({ _id: order_id });
    if (!findOrder || !findOrder.user) return ctx.body = { status: false };

    const { clientId, clientSecret } = findOrder;
    if (!clientId || !clientSecret) return ctx.body = { status: false };

    let order_history_replace = {
        errorCode: error_code,
        errorMessage: error_message
    }

    const confirm_signature = await HmacSHA256(
        `${bill_number}||${order_id}||${error_code}||${error_message}||${price}||${transaction_id}`,
        clientSecret,
    ).toString();

    if (confirm_signature !== signature) {
        // Update fail to history
        order_history_replace.status = 'error';
        await thuhoFactory.updateItem({ _id: order_id }, order_history_replace);

        return ctx.body = { status: false };
    };

    // Double check
    try {
        let payload = {
            "client_id": clientId,
            "order_id": order_id,
            "bill_number": bill_number,
            "language": "en",
            "signature": "112233"
        }
        // const bodySignature = Object.values(payload).join('||');
        // const doubleSignature = await HmacSHA256(bodySignature, clientSecret).toString();
        // payload = { ...payload, signature: doubleSignature }

        const response = await axios.post(
            process.env.THU_HO_API_URL + '/api/v1/collection/check-status',
            payload,
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            },
        );

        if (!response || !response.data || !response.data.status || !response.data.data) {
            // Ko call đc API này
            order_history_replace.status = 'error';
            await thuhoFactory.updateItem({ _id: order_id }, order_history_replace);

            return ctx.body = { status: false };
        }

        const { status } = response.data.data;
        if (!status || status == 'FAILED') {
            // Giao dịch thất bại
            order_history_replace.status = 'error';
            await thuhoFactory.updateItem({ _id: order_id }, order_history_replace);

            return ctx.body = { status: false };
        }

        if (status == 'PROCESS') {
            // Giao dịch đang xử lý
            await thuhoFactory.updateItem({ _id: order_id }, order_history_replace);

            return ctx.body = { status: false };
        }

        // OK
        order_history_replace.status = 'success';
        await thuhoFactory.updateItem({ _id: order_id }, order_history_replace);

        return ctx.body = { status: true };
    } catch (error) {
        // Update fail to history
        order_history_replace.status = 'error';
        await thuhoFactory.updateItem({ _id: order_id }, order_history_replace);

        return ctx.body = { status: false };
    }
}