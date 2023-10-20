import Drivers from "../../models/Driver.js";
import Orders from "../../models/Order.js";
import handleError from "../../utils/ReturnError.js";

let order_fields = [
    'itemtype',
    'package_size',
    'package_instructions',
    'order_shipping_assurance',
    'sender_name',
    'order_status',
    'recieverfullname',
    'recieverphonenum',
    'recievercompleteaddress',
    'order_id',
    'createdAt',
    'order_subtotal_price',
    'driver_id',
    'tracking_id',
    'order_dropoff_location',
    'order_pickup_day',
    'status_analytics',
    '_id',
]

let driver_fields = [
    'image',
    'user_phone',
    'name',
    'email',
    'user_address',
    'user_city',
    'user_country',
    'user_state',
    'completed_orders',
    'vehicle_reg_number',
    'total_ratings',
]

const getUserOrders = async (req, res) => {
    try {
        let user = req.user;
        let sender_id = user._id;
        let orders = await Orders.find({ sender_id }).select(order_fields).lean().exec();

        if (orders.length < 1) {
            return res.status(200).json({ orders: [], status: true });
        }

        let orders_with_driver_details = [];

        for (let i = 0; i < orders.length; i++) {
            let driver = await Drivers.findOne({ _id: orders[i].driver_id }).select(driver_fields).lean().exec();
            let driver_address = driver.user_address ? driver?.user_address : `${driver.user_city} ${driver.user_state} ${driver.user_country}`;
            let data = {
                ...orders[i],
                driver: { ...driver, driver_address: driver_address ? driver_address : "Driver address is missing" }
            }
            orders_with_driver_details.push(data);
        }

        return res.status(200).json({ orders: orders_with_driver_details, status: true });

    } catch (error) {
        const response = handleError(error);
        return res.status(response.statusCode).json({ msg: response.body, status: false })
    }
};

export default getUserOrders;