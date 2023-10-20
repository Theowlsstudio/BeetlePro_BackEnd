import config from "../../../../config.js";
import Orders from "../../../models/Order.js";
import handleError from "../../../utils/ReturnError.js";
import getDate from "../../../utils/getDate.js";

let { order_status } = config;

const completeOrderById = async (req, res) => {
    try {

        let user = req.user;

        let { order_id } = req.body;

        if (!order_id) {
            return res.status(400).json({ msg: "Bad request! Specify order id to update order status.", status: false });
        }
        let order = await Orders.findOne({ order_id, driver_id: user._id });
        if (!order) {
            return res.status(404).json({ msg: `Order not found with this id:${order_id}, for driver:${user.user_id}`, status: false });
        };
        if (order.order_status === order_status.delivered) {
            return res.status(400).json({ msg: `Order has already been delivered!`, status: false });
        }
        if (order.order_status !== order_status.picked_up) {
            return res.status(400).json({ msg: `Can't deliver an order before pickup!`, status: false });
        }

        let status_analytics = [...order.status_analytics, { status: order_status.delivered }]

        order.order_status = order_status.delivered;
        order.status_analytics = status_analytics;
        await order.save();

        return res.status(200).json({ msg: `Congrates ${user.name} you have successfuly delivered the order!`, status: true });

    } catch (error) {
        console.log(error)
        let response = handleError(error);
        return res.status(response.statusCode).json({ msg: response.body, status: false })
    }
};

export default completeOrderById;