import Orders from "../../../models/Order.js";
import handleError from "../../../utils/ReturnError.js"
import config from "../../../../config.js";

const { order_status } = config;

const pickedUpOrder = async (req, res) => {
    try {

        let user = req.user;

        const { order_id } = req.body;

        let getorder = await Orders.findOne({ order_id, driver_id: user._id });

        if (!getorder) {
            return res.status(404).json({ msg: "Order not found", status: false });
        };

        if (getorder.order_status !== order_status.active) {
            if (getorder.order_status === order_status.picked_up) {
                return res.status(400).json({ msg: "Order has already been picked up!", status: false });
            } else if (getorder.order_status === order_status.delivered) {
                return res.status(400).json({ msg: "Order has been already delivered", status: false });
            } else if (getorder.order_status === order_status.completed) {
                return res.status(400).json({ msg: "Order has been completed", status: false });
            } else {
                return res.status(400).json({ msg: "Bad request", status: false });
            }
        }
        let status_analytics = [...getorder.status_analytics, { status: order_status.picked_up }]
        getorder.order_status = order_status.picked_up;
        getorder.status_analytics = status_analytics;
        await getorder.save();

        return res.status(200).json({ msg: "Order Picked up successfuly", status: true })

    } catch (error) {
        let respose = handleError(error);
        return res.status(respose.statusCode).json({ msg: respose.body, status: false });
    }
};

export default pickedUpOrder;