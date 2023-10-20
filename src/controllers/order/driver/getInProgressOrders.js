import Orders from "../../../models/Order.js";
import handleError from "../../../utils/ReturnError.js";
import config from '../../../../config.js';
import _ from 'lodash';
let { order_status } = config;
let filter_order_status_arr = [order_status.active, order_status.picked_up];
let order_fields = [
    "tracking_id",
    "order_id",
    "itemtype",
    "deliverytype",
    "createdAt",
    "order_status",
    "order_subtotal_price",
    "dropofflocation",
    "pickup_location"
];

const getOrdersInProgress = async (req, res) => {
    try {
        let user = req.user;
        let orders = await Orders.find({ driver_id: user._id, order_status: { $in: filter_order_status_arr } }).select(order_fields);
        return res.status(200).json({ orders, status: true });
    } catch (error) {
        let response = handleError(error);
        return res.status(response.statusCode).json({ msg: response.body, status: false });
    }
};

export default getOrdersInProgress;