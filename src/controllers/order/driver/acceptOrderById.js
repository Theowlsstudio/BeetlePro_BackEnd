import config from "../../../../config.js";
import Orders from "../../../models/Order.js";
import handleError from "../../../utils/ReturnError.js";


let { order_status } = config;

const acceptOrderById = async (req, res) => {
    try {

        let user = req.user;
        let { order_id } = req.body;
        let order = await Orders.findOne({ order_id: order_id, driver_id: user._id });
        if (!order) {
            return res.status(400).json({ status: false, msg: `Order not found with this id:${order_id}, for driver:${user.user_id}` });
        };
        if (order.order_status !== order_status.active) {
            return res.status(400).json({ status: false, msg: `Only order's can be accepted when your customer initially creates an order!` });
        }
        if (order.flag && order.order_accepted_at) {
            return res.status(400).json({ status: false, msg: `Order has already been accepted` });
        }
        order.flag = 1;
        await order.save();

        return res.status(200).json({ msg: `Congrates ${user.name} you have successfuly accepted the order!`, status: true });

    } catch (error) {
        let response = handleError(error);
        return res.status(response.statusCode).json({ msg: response.body, status: false })
    }
};

export default acceptOrderById;