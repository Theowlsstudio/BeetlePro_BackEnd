import Drivers from "../../models/Driver.js";
import bcrypt from 'bcrypt';
import Users from "../../models/User.js";
import config  from '../../../config.js';

let { usersCollection, driversCollection, HttpStatusCodes  } = config;

const resetPassword = (collection) => {
    return async (req, res) => {
        try {
            const { password, confirmpassword, user_id } = req.body;
            if (password !== confirmpassword) {
                return res.status(400).json({ msg: "Bad request" });
            }
            const hashPassword = await bcrypt.hash(password, 12);

            if (collection === driversCollection) {
                await Drivers.findOneAndUpdate({ user_id: user_id }, { $set: { password: hashPassword } });
                return res.status(200).json({ msg: "New password set successfuly" });
            }

            if (collection === usersCollection) {
                await Users.findOneAndUpdate({ user_id: user_id }, { $set: { password: hashPassword } });
                return res.status(200).json({ msg: "New password set successfuly" });
            }

        } catch (error) {
            return res.status(error?.statusCode ?? HttpStatusCodes.internalServerError).json({ msg: error?.message ?? "Interanal Server Error" })
        }
    };
};

export default resetPassword;
