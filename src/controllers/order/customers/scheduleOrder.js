import Drivers from "../../../models/Driver.js";
import Orders from "../../../models/Order.js";
import handleError from "../../../utils/ReturnError.js";
import { v4 as uuidv4 } from 'uuid';
import config from '../../../../config.js';

const { order } = config;

const scheduleOrder = async (req, res) => {
    try {
        let user = req.user;
        let data = req.body;
        let driver = await Drivers.findOne({ user_id: data.driver_id }).exec();
        let order_id = uuidv4();
        const scheduled_time = new Date();
        scheduled_time.setMinutes(scheduled_time.getMinutes() + 2);
        let createOrder = await Orders.create({
            ...data,
            order_id,
            driver_id: driver._id,
            sender_id: user._id,
            sender_order_status: order.schedule,
            order_status: order.schedule,
            scheduled_time: scheduled_time
        })
        await createOrder.save(createOrder);
        return res.status(200).json({ msg: "Order Create Successfuly", status: true });
    } catch (error) {
        console.log(error)
        let response = handleError(error);
        return res.status(response.statusCode).json({ msg: response.body, status: false });
    }
};

export default scheduleOrder;