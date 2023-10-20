import config from "../../../../config.js";
import Orders from "../../../database/models/Order.js";
import handleError from "../../../utils/ReturnError.js";


let { order } = config;

const { pending } = order;

const getPendingOrders = async (req, res) => {
    try {

        let user = req.user;

        let orders = await Orders.find({ sender_id: user._id, order_status: pending });

        return res.status(200).json({ orders, status: true });

    } catch (error) {
        let response = handleError(error);
        console.log(error)
        return res.status(response.statusCode).json({ msg: response.body, status: false })
    }
};

export default getPendingOrders;