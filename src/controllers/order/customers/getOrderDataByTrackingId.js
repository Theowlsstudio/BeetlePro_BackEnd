import Orders from "../../../models/Order.js";
import handleError from "../../../utils/ReturnError.js";
import config from '../../../../config.js';

const getOrderDataByTrackingId = async (req, res) => {
    try {

        let user = req.user;

        let { tracking_id } = req.params;

        if (!tracking_id) {
            return res.status(400).json({ msg: "Please provide order tracking id to get the order status", status: false })
        }

        let order = await Orders.findOne({ tracking_id, sender_id: user._id });

        if (!order) {
            return res.status(404).json({ msg: "Order not found!", status: false })
        }

        if (order?.order_status !== config.order_status.completed) {
            return res.status(400).json({ msg: "The order hasn't been completed!", status: false });
        }

        return res.status(200).json({
            order: {
                itemtype: order?.itemtype,
                order_id: order?.order_id,
                deliverytype: order?.deliverytype,
                tracking_id: order?.tracking_id,
                order_status: order?.order_status,
                createdAt: order?.createdAt,
                order_subtotal_price: order?.order_subtotal_price,
                status_analytics: order?.status_analytics
            },
            status: true
        })

    } catch (error) {
        console.log(error)
        let response = handleError(error);
        return res.status(response.statusCode).json({ msg: response.body, status: false });
    }
};

export default getOrderDataByTrackingId;