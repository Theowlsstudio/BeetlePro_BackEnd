import bcrypt from 'bcrypt';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import Drivers from '../../../models/Driver.js';
import Files from '../../../models/File.js';
import handleError from '../../../utils/ReturnError.js'
import config from '../../../../config.js'

const extractField = ['name', 'email', 'user_phone', 'role_type', '_id', 'createdAt', 'updatedAt', 'user_id', 'image'];

const SignUp = async (req, res) => {
    try {
        let files = req?.files;
        let userData = req.user;
        let password = await bcrypt.hash(userData.password.trim(), 12);
        let user_id = uuidv4();
        let newUser = {
            email: userData.email.trim(),
            ...userData,
            password,
            user_id,
            role_type: userData.role_type,
        }
        let registerUser = await Drivers.create(newUser);
        let imageUrl;
        if (files?.length > 0) {
            let file = files[0];
            let uploadImage = await Files.create({ user: registerUser._id, ...file });
            let saveImage = await uploadImage.save();
            imageUrl = `${config.imageURL}/${saveImage._id}`
        }
        registerUser.image = imageUrl
        let date = new Date(registerUser.createdAt);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let getdate = date.getDate();
        registerUser.member_since = `${getdate}/${month}/${year}`;
        let savedUser = await registerUser.save();
        let user = _.pick(savedUser, extractField);
        let token = jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_SECRET);
        return res.status(200).json(
            {
                ...user, token,
                status: true
            });


    } catch (error) {
        let response = handleError(error);
        return res.status(response.statusCode).json({ msg: response.body, status: false })
    }
};

export default SignUp;