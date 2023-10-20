import config from "../../../config.js";
import Drivers from "../../models/Driver.js";
import bcrypt from "bcrypt";
import Users from "../../models/User.js";

let { HttpStatusCodes, driversCollection, usersCollection } = config;

const updateCurrentPassword = (collection) => {
    return async (req, res) => {
        try {
            const { currentpassword, newpassword } = req.body;
            const user = req.user;
            const user_id = user._id;

            if (currentpassword === newpassword) {
                return res.status(400).json({ msg: "Choose a new password instead of current password", status: false });
            }

            if (collection === driversCollection) {

                let userPassword = await Drivers.findOne({ _id: user_id }).select("password");

                let comparePassword = await bcrypt.compare(currentpassword, userPassword.password);

                if (!comparePassword) {
                    return res.status(400).json({ msg: "Incorrect password", status: false });
                }

                const hashPassword = await bcrypt.hash(newpassword, 12);

                await Drivers.findOneAndUpdate({ _id: user_id }, { $set: { password: hashPassword } }, { new: true });
                return res.status(200).json({ msg: "Password updated successfuly", status: true });
            }

            if (collection === usersCollection) {

                let userPassword = await Users.findOne({ _id: user_id }).select("password");

                let comparePassword = await bcrypt.compare(currentpassword, userPassword.password);

                if (!comparePassword) {
                    return res.status(400).json({ msg: "Incorrect password", status: false });
                }

                const hashPassword = await bcrypt.hash(newpassword, 12);

                await Users.findOneAndUpdate({ _id: user_id }, { $set: { password: hashPassword } }, { new: true });
                return res.status(200).json({ msg: "Password updated successfuly", status: true });
            }


        } catch (error) {
            return res.status(error?.statusCode ?? HttpStatusCodes.internalServerError).json({ msg: error?.message ?? "Interanal Server Error", status: false })
        }
    }
};

export default updateCurrentPassword;