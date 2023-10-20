import jwt from "jsonwebtoken";
import Users from '../../models/User.js';
import handleError from '../../utils/ReturnError.js';

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
        let user = await Users.findOne({ _id: _id }).select('-password').lean().exec();
        if (!user) {
            return res.status(404).json({ msg: "user not found", status: false })
        }
        req.user = user;
        next();

    } catch (error) {
        let response = handleError(error);
        return res.status(response.statusCode).json({ msg: response.body, status: false })
    }
};

export default apiGuard;