import Orders from "../../../models/Order.js";
import handleError from "../../../utils/ReturnError.js";
import config from '../../../../config.js';
import _ from 'lodash';

let { order_status } = config;

let order_status_arr = [order_status.delivered, order_status.completed];

let order_fields = [
    "tracking_id",
    "order_id",
    "itemtype",
    "deliverytype",
    "createdAt",
    "order_status",
    "status_analytics",
    "order_subtotal_price",
    "driver_id",
    "dropofflocation"
]

const getOrdersCompleted = async (req, res) => {
    try {
        let user = req.user;
        let orders = await Orders.find({ sender_id: user._id, order_status: { $in: order_status_arr } }).select(order_fields);

        return res.status(200).json({ orders, status: true });

    } catch (error) {
        let response = handleError(error);
        return res.status(response.statusCode).json({ msg: response.body, status: false });
    }
};

export default getOrdersCompleted;