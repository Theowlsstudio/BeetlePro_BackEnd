import Orders from "../../../models/Order.js";
import handleError from "../../../utils/ReturnError.js";
import config from '../../../../config.js';

let { order } = config;

let { delivered, cancel } = order;

const cancelOrder = async (req, res) => {
    try {

        let user = req.user;
        let { order_id } = req.body;

        let order = await Orders.findOne({ order_id, driver_id: user._id });

        if (!order) {
            return res.status(404).json({ msg: `Order not found with this id:${order_id}`, status: false });
        }

        if (order.order_status === delivered || order.order_status === cancel) {
            return res.status(400).json({ msg: `Bad request: Order has been already delivered or canceled`, status: false });
        }

        if (order?.driver_order_status === cancel) {
            return res.status(400).json({ msg: `Order:${order_id} has already been canceled!`, status: false });
        }

        order.driver_order_status = cancel;
        await order.save();

        // await Orders.findByIdAndUpdate({ _id: order._id }, {
        //     $set:
        //     {
        //         driver_order_status: driver_order_status.canceled,
        //     }
        // })

        return res.status(200).json({ msg: `Order:${order_id} has been canceled successfuly.`, status: true });

    } catch (error) {
        let response = handleError(error);
        return res.status(response.statusCode).json({ msg: response.body, status: false });
    }
};

export default cancelOrder;