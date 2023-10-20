import OTP_Email from "../../../models/OtpEmail.js";
import transporter from "../../../utils/EmailSender.js";
import handleError from "../../../utils/ReturnError.js";
import Drivers from '../../../models/Driver.js';

const generateEmailOtp = async (req, res) => {
    try {
        let { email } = req.body

        let user = await Drivers.findOne({ email });

        if (!user) {
            return res.status(404).json({ msg: "User not found with this email!", status: false });
        };

        const existingCodes = [];
        function generateUniqueRandomCode(existingCodes) {
            let code;
            do {
                code = Math.floor(1000 + Math.random() * 9000);
            } while (existingCodes.includes(code));

            existingCodes.push(code);
            return code;
        }

        let otp = generateUniqueRandomCode(existingCodes);

        let genOtp = await OTP_Email.create({
            user: user._id,
            otp,
            expiry: new Date(Date.now() + 15 * 60 * 1000),
        });

        await genOtp.save();
        transporter.sendMail(
            {
                from: "BeetlePro",
                to: email,
                subject: "Password Reset OTP",
                text: `${user?.name ? user?.name : user?.email}, Your OTP for password reset is ${otp}`

            }
        ).catch((error) => {
            return res.status(500).json({ msg: "Unexpected error occured while sending email!", status: false });
        })
        return res.status(200).json({ msg: "An otp has been send to your email!", status: true })

    } catch (error) {
        let response = handleError(error);
        return res.status(response.statusCode).json({ msg: response.body, status: false })
    }
};

export default generateEmailOtp;