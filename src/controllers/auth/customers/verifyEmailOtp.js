import Users from "../../../models/User.js";
import OTP_Email from "../../../models/OtpEmail.js";
import handleError from "../../../utils/ReturnError.js"

const verifyEmailOtp = async (req, res) => {
    try {
        let { email, otp } = req.body;

        let user = await Users.findOne({ email })

        if (!user) {
            return res.status(404).json({ msg: "User not found with the provided email", status: false });
        }

        if (!otp) {
            return res.status(400).json({ msg: "Bad request", status: false })
        }

        let otpRecord = await OTP_Email.findOne({ user: user._id, otp });

        if (!otpRecord) {
            return res.status(400).json({ msg: 'Invalid OTP', status: false });
        }

        if (otpRecord.expiry < new Date()) {
            return res.status(400).json({ msg: 'OTP has expired', status: false });
        }

        await OTP_Email.findOneAndDelete({ _id: otpRecord._id });

        return res.status(200).json({ msg: "Password reset sussessfuly", status: true })

    } catch (error) {
        let response = handleError(error);
        return res.status(response.statusCode).json({ msg: response.body, status: false });
    }
};

export default verifyEmailOtp;