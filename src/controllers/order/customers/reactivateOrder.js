import config from "../../../../config.js"
import Orders from "../../../database/models/Order.js";

const { HttpStatusCodes, order } = config;
const { delivered, accept, pending } = order;

const reactivateOrder = async (req, res) => {
    try {

        let user = req.user;

        const { order_id } = req.body;

        let order = await Orders.findOne({ order_id, sender_id: user._id });

        if (!order) {
            return res.status(400).json({ msg: `Order:${order_id} not found` });
        };

        if (order.order_status === delivered) {
            return res.status(400).json({ msg: "This order has been delivered." })
        }

        if (order.order_status === accept) {
            return res.status(400).json({ msg: "Order is already active" })
        }

        order.order_status = pending;
        order.sender_order_status = accept;
        order.sender_order_cancellation_reason = null;

        await order.save();

        return res.status(200).json({ msg: "Order has been reactivated!" })

    } catch (error) {
        return res.status(error?.statusCode ?? HttpStatusCodes.internalServerError).json({ msg: error?.message ?? "Internal Server Error" })
    }
};

export default reactivateOrder;