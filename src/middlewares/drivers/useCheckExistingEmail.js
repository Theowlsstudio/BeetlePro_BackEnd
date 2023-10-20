import config from '../../../config.js';
import Users from '../../models/User.js';
import Drivers from '../../models/Driver.js';

let { roles } = config;

const useCheckExistingEmail = async (req, res, next) => {
    try {

        const { email, role_type } = req.body;

        if (!email || !role_type) {
            return res.status(401).json({ msg: `Provide valid data to signup`, status: false })
        }

        let checkIfEmailinCutomers = await Users.findOne({ email });

        if (checkIfEmailinCutomers) {
            return res.status(400).json({ msg: "User already exists with this email!", status: false })
        };

        let checkIfEmailinDrivers = await Drivers.findOne({ email });

        if (checkIfEmailinDrivers) {
            return res.status(400).json({ msg: "User already exists with this email!", status: false })
        };

        let role = roles.find((item) => item.id === Number(role_type));

        if (!role) {
            return res.status(404).json({ msg: `Role didn't found with id:${role_type}`, status: false })
        }

        req.user = req.body;
        req.user.role_type = role.id;
        next();

    } catch (error) {
        return res.status(error?.statusCode ?? 500).json({ msg: error?.message ?? "Internal Server Error", status: false })
    }
};

export default useCheckExistingEmail;