import Orders from "../../../models/Order.js";
import handleError from "../../../utils/ReturnError.js";
import config from '../../../../config.js';

let { order } = config;

let { cancel, pending } = order;

const cancelOrder = async (req, res) => {
    try {

        let user = req.user;
        let { order_id, sender_order_cancellation_reason } = req.body;

        let order = await Orders.findOne({ order_id, sender_id: user._id });

        if (!order) {
            return res.status(404).json({ msg: `Order not found with this id:${order_id}`, status: false });
        }

        if (order.order_status !== pending) {
            return res.status(400).json({ msg: `Bad request: Orders accepted by riders can't be canceled!`, status: false });
        }

        // if (order?.driver_order_status === cancel) {
        //     return res.status(200).json({ msg: `Order:${order_id} has already been canceled by the driver,`, reason: `${order.driver_order_cancellation_reason}` });
        // }

        // if (order?.sender_order_status === cancel) {
        //     return res.status(200).json({ msg: `Order:${order_id} has already been canceled!`, reason: `${order.sender_order_cancellation_reason}` });
        // }

        order.order_status = cancel;
        order.sender_order_status = cancel;
        order.sender_order_cancellation_reason = sender_order_cancellation_reason ?? "No order cancellation reason provided!";

        await order.save();

        // await Orders.findByIdAndUpdate({ _id: order._id }, {
        //     $set: {
        //         order_status: cancel,
        //         sender_order_status: cancel,
        //         sender_order_cancellation_reason: sender_order_cancellation_reason ?? "No order cancellation reason provided!"
        //     }
        // })

        return res.status(200).json({ msg: `Order:${order_id} has been canceled successfuly.`, status: true })

    } catch (error) {
        let response = handleError(error);
        return res.status(response.statusCode).json({ msg: response.body, status: false });
    }
};

export default cancelOrder;