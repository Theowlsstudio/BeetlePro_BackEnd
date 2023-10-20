import config from "../../../../config.js";
import Drivers from "../../../models/Driver.js";
import Orders from "../../../models/Order.js";
import handleError from "../../../utils/ReturnError.js";
import generateId from '../../../utils/generateRandomId.js'

let { order_status } = config;

const CreateOrder = async (req, res) => {
    try {

        let user = req.user;
        let data = req.body;
        let driver = await Drivers.findOne({ user_id: data.driver_id }).exec();
        if (!driver) {
            return res.status(404).json({ msg: `Driver not found with this id:${data.driver_id}` });
        }
        let order_id = generateId();
        let tracking_id = generateId();
        let createOrder = await Orders.create({
            ...data,
            order_id,
            driver_id: driver._id,
            sender_id: user._id,
            order_status: order_status.active,
            status_analytics: [{ status: order_status.active }],
            tracking_id,
            flag: 0

        });
        await createOrder.save();
        return res.status(200).json({ msg: "Order Create Successfuly", status: true });
    } catch (error) {
        let response = handleError(error)
        return res.status(response.statusCode).json({ msg: response.body, status: false });
    }
};

export default CreateOrder;