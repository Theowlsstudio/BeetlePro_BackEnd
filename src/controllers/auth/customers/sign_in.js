import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import _ from 'lodash';
import Users from '../../../models/User.js';
import handleError from '../../../utils/ReturnError.js';

const extractFields = ['name', 'email', 'user_phone', 'role_type', '_id', 'createdAt', 'updatedAt', 'user_id', 'user_image'];

const SignIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        email.trim();

        let user = await Users.findOne({ email });

        if (!user) {
            return res.status(404).json({ msg: `User not found with this email ${email}`, status: false })
        }

        let matchPassword = await bcrypt.compare(password, user?.password ?? "");

        if (!matchPassword) {
            return res.status(400).json({ msg: "Password not matched!", status: false });
        }

        let token = jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_SECRET);

        let userdata = _.pick(user, extractFields);

        return res.status(200).json({ user: userdata, token, status: true });

    } catch (error) {
        let response = handleError(error);
        return res.status(response.statusCode).json({ msg: response.body, status: false })
    }
};

export default SignIn;