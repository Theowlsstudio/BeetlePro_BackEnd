import Orders from "../../../models/Order.js";
import handleError from "../../../utils/ReturnError.js";

const getOrderStatus = async (req, res) => {
    try {

        const { order_id } = req.params;

        let order = await Orders.findOne({ order_id });

        if (!order) {
            return res.status(404).json({ msg: "Order not found", status: false });
        }

        return res.status(200).json({ order, status: true });

    } catch (error) {
        let response = handleError(error);
        return res.status(response.statusCode).json({ msg: response.body, status: false })
    }
};

export default getOrderStatus;