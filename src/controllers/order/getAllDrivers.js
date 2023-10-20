import Drivers from "../../models/Driver.js";
import handleError from "../../utils/ReturnError.js"

let driver_fields = [
    'user_address',
    'user',
    "name",
    "total_ratings",
    "email",
    "user_id",
    "_id",
    "user_phone",
    "vehicle_type",
    "vehicle_reg_number",
    "vehicle_color",
    'model_number',
    "completed_orders",
]

const getAllDrivers = async (req, res) => {
    try {
        let drivers = await Drivers.find({}).select(driver_fields);
        return res.status(200).json({ drivers, status: true });
    } catch (error) {
        const response = handleError(error)
        return res.status(response.statusCode).json({ msg: response.body, status: false });
    }
};


export default getAllDrivers;