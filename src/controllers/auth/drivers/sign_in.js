import zod from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import Drivers from '../../../models/Driver.js';
import handleError from '../../../utils/ReturnError.js';

const extractField = ['name', 'email', 'user_phone', 'role_type', '_id', 'createdAt', 'updatedAt', 'user_id', 'user_image'];

const SignIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ msg: "Bad request! Provide login credentails to login", status: false })
        }
        let user = await Drivers.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: `User not found with this email ${email}`, status: false })
        }
        let matchPassword = await bcrypt.compare(password, user?.password ?? "");
        if (!matchPassword) {
            return res.status(400).json({ msg: "Password not matched!", status: false });
        }
        let token = jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_SECRET);
        let userdata = _.pick(user, extractField);
        return res.status(200).json({ ...userdata, token, status: true })
    } catch (error) {
        let resposne = handleError(error);
        return res.status(resposne.statusCode).json({ msg: resposne.body, status: false })
    }
};

export default SignIn;