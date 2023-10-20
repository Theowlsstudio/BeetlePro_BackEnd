import Drivers from "../../../models/Driver.js";
import handleError from "../../../utils/ReturnError.js";

let selectFields = ['image',
    'name',
    'user_phone',
    'user_id',
    '_id',
    'total_ratings',
    'completed_orders',
    'createdAt',
    'vehicle_type',
    'vehicle_reg_number',
    'member_since',
];

const getDriverInfo = async (req, res) => {
    try {
        let { id } = req.params;

        if (!id) {
            return res.status(400).json({ msg: "Provide required data to get the driver data" });
        }

        let driver = await Drivers.findOne({ _id: id }).select(selectFields).lean().exec();

        if (!driver) {
            return res.status(404).json({ msg: "Driver not found", status: false });
        }

        let member_since;

        if (!driver.member_since) {
            let date = new Date(driver.createdAt);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let getdate = date.getDate();
            member_since = `${getdate}/${month}/${year}`;
        }

        return res.status(200).json({ driver: { ...driver, member_since: driver.member_since ? driver.member_since : member_since }, status: true });

    } catch (error) {
        let response = handleError(error);
        return res.status(response.statusCode).json({ msg: response.body, status: false });
    }
};

export default getDriverInfo;