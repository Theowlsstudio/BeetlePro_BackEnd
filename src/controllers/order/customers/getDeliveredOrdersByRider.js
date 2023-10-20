import Orders from "../../../database/models/Order.js";
import config from '../../../../config.js'
import handleError from "../../../utils/ReturnError.js";

let { order } = config;

const getDeliveredOrdersByRider = async (req, res) => {
    try {
        let user = req.user;
        let orders = await Orders.findOne({ _id: user._id, driver_order_status: order.delivered });
        return res.status(200).json({ orders, status: true });
    } catch (error) {
        let response = handleError(error);
        return res.status(response.statusCode).json({ msg: response.body, status: false })
    }
};

export default getDeliveredOrdersByRider;