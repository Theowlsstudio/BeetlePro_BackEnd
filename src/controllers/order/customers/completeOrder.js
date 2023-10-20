import config from "../../../../config.js";
import Drivers from "../../../models/Driver.js";
import Orders from "../../../models/Order.js";
import handleError from "../../../utils/ReturnError.js";

let { order_status } = config;

const completeOrderById = async (req, res) => {
    try {

        let user = req.user;

        let { order_id } = req.body;

        if (!order_id) {
            return res.status(400).json({ msg: "Bad request! Specify order id to update order status.", status: false });
        }

        let order = await Orders.findOne({ order_id: order_id, sender_id: user._id });

        if (!order) {
            return res.status(404).json({ msg: `Order not found with this id:${order_id}, for driver:${user.user_id}`, status: false });
        };

        if (order.order_status !== order_status.delivered) {
            if (order.order_status === order_status.completed) {
                return res.status(400).json({ msg: `Order has already been completed!`, status: false });
            } else {
                return res.status(400).json({ msg: `Order hasn't been delivered yet by the rider!`, status: false });
            }
        }

        let status_analytics = [...order.status_analytics, { status: order_status.completed }]

        order.order_status = order_status.completed;
        order.status_analytics = status_analytics;

        await order.save();

        let driver = await Drivers.findOne({ _id: order.driver_id });
        driver.completed_orders = driver.completed_orders ? driver.completed_orders + 1 : 1;
        await driver.save();

        return res.status(200).json({ msg: `Order has been accepted`, status: true });

    } catch (error) {
        let response = handleError(error);
        return res.status(response.statusCode).json({ msg: response.body, status: false })
    }
};

export default completeOrderById;