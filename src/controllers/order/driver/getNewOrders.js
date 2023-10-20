import Orders from "../../../models/Order.js";
import handleError from "../../../utils/ReturnError.js";
import config from '../../../../config.js';

let { order_status } = config;

let order_fields=['-sender_id','-driver_id','-flag','-__v'];

const getNewOrders = async (req, res) => {
    try {
        let user = req.user;
        let newOrders = await Orders.find({
            driver_id: user._id,
            order_status: order_status.active,
            flag: 0
        }).select(order_fields);
        return res.status(200).json({ orders: newOrders, status: true });

    } catch (error) {
        let response = handleError(error);
        return res.status(response.statusCode).json({ msg: response.body, status: false });
    }
};

export default getNewOrders;