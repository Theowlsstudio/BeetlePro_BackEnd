import jwt from 'jsonwebtoken';
import _ from 'lodash';
import Users from '../../models/User.js';
import handleError from '../../utils/ReturnError.js';

const VerifyToken = async (req, res, next) => {

    const token = req.headers.authorization;

    try {

        if (!token) {
            next();
            return;
        }

        let { _id, email } = jwt.verify(token, process.env.JWT_SECRET);

        if (!_id || !email) {
            return res.status(400).json({ msg: "Authentication faild!", status: false });
        }

        let user = await Users.findOne({ _id: _id }).select('-password').lean().exec();

        if (!user) {
            return res.status(404).json({ msg: "user not found", status: false })
        }

        return res.status(200).json({ ...user, token, status: true });


    } catch (error) {
        let response = handleError(error)
        return res.status(response.statusCode).json({ msg: response.body, status: false })

    }
};

export default VerifyToken;