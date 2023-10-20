import Users from '../../models/User.js';
import Drivers from '../../models/Driver.js';
import config from '../../../config.js';

let { roles } = config;

const useCheckExistingEmail = async (req, res, next) => {
    try {

        const { email, role_type } = req.body;
        email.trim();
        let checkIfEmailinDrivers = await Drivers.findOne({ email });
        let checkIfEmailinCutomers = await Users.findOne({ email });

        if (checkIfEmailinCutomers) {
            return res.status(400).json({ msg: "User already exists with this email!", status: false })
        }

        if (checkIfEmailinDrivers) {
            return res.status(400).json({ msg: "User already exists with this email!", status: false })
        }

        let role = roles.find((item) => item.id === role_type);

        if (!role) {
            return res.status(404).json({ msg: `Role didn't found with id:${role_type}`, status: false })
        }

        req.user = req.body;
        req.user.role_type = role.id;
        next()

    } catch (error) {
        return res.status(error?.statusCode ?? 500).json({ msg: error?.message ?? "Internal Server Error", status: false })
    }
};

export default useCheckExistingEmail;