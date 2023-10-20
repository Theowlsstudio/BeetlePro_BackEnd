import config from '../../../config.js';
import jwt from "jsonwebtoken";
import Drivers from '../../models/Driver.js';

const { HttpStatusCodes } = config;
const apiGuard = async (req, res, next) => {

    const token = req.headers.authorization;

    try {

        if (!token) {
            return res.status(400).json({ msg: "Authentication faild!", status: false })
        };

        const { _id, email } = jwt.verify(token, process.env.JWT_SECRET);

        if (!_id || !email) {
            return res.status(400).json({ msg: "Authentication faild!", status: false });
        }

        let user = await Drivers.findOne({ _id }).select('-password').lean().exec();

        if (!user) {
            return res.status(404).json({ msg: "Authentication faild, User not found", status: false })
        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(error?.statusCode ?? HttpStatusCodes.internalServerError).json({ msg: error?.message ?? "Internal Server Error", status: false })
    }
};

export default apiGuard;
