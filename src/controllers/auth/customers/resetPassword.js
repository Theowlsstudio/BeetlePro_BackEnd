import Users from "../../../models/User.js";
import handleError from "../../../utils/ReturnError.js"
import bcrypt from 'bcrypt';
const resetPassword = async (req, res) => {
    try {
        let { email, password } = req.body;
        let user = await Users.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: "User not found", status: false });
        };
        let hash = await bcrypt.hash(password, 12);
        user.password = hash;
        await user.save();
        return res.status(200).json({ msg: "Password reset successfuly", status: true })
    } catch (error) {
        let response = handleError(error)
        return res.status(response.statusCode).json({ msg: response.body, status: false });
    }
};

export default resetPassword;