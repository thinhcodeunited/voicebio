const chihoFactory = require('../../../models/chiho.factory');
const axios = require('axios');
const { HmacSHA256 } = require('crypto-js');
const makeSignatureHelper = require('../../../helper/make_signature');

module.exports = async (ctx) => {
    const { transaction_id, order_id, data, signature } = ctx.request.body;
    if (!transaction_id ||
        !order_id ||
        typeof data === 'undefined' ||
        !signature
    ) return ctx.body = { status: false };

    const findOrder = await chihoFactory.getItem({ _id: order_id });
    if (!findOrder || !findOrder.user) return ctx.body = { status: false };

    const { clientId, clientSecret } = findOrder;
    if (!clientId || !clientSecret) return ctx.body = { status: false };

    let order_history_replace = {}

    const confirm_signature = await HmacSHA256(
        `${order_id}||${transaction_id}||${JSON.stringify(data)}`,
        clientSecret,
    ).toString();

    if (confirm_signature !== signature) {
        // Update fail to history
        order_history_replace.status = 'error';
        await chihoFactory.updateItem({ _id: order_id }, order_history_replace);

        return ctx.body = { status: false };
    };

    // Double check
    try {
        let body = {
            client_id: clientId,
            language: "vi",
            order_id: order_id,
        }
        body = { ...body, signature: makeSignatureHelper(body, process.env.CHI_HO_CLIENT_SECRET) }


        const response = await axios.post(
            process.env.THU_HO_API_URL + '/api/v1/disbursement/check-transaction',
            body,
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            },
        );

        if (!response || !response.data || !response.data.status || !response.data.data || response.data.data.length < 1) {
            // Ko call đc API này
            order_history_replace.status = 'error';
            await chihoFactory.updateItem({ _id: order_id }, order_history_replace);

            return ctx.body = { status: false };
        }

        // Lấy phần tử đầu tiên
        const { error_code, error_message } = response.data.data[0];
        order_history_replace = {
            ...order_history_replace,
            errorCode: error_code,
            errorMessage: error_message,
            status: (error_code != 0) ? 'error' : 'success'
        }

        await chihoFactory.updateItem({ _id: order_id }, order_history_replace);
        return ctx.body = { status: (error_code != 0) ? false : true };
    } catch (error) {
        // Update fail to history
        order_history_replace.status = 'error';
        await chihoFactory.updateItem({ _id: order_id }, order_history_replace);

        return ctx.body = { status: false };
    }
}