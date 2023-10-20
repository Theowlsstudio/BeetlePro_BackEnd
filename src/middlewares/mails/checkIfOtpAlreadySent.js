const { HttpStatusCodes } = require("../../config");
const Drivers = require("../../database/models/Driver");
const OTP_Email = require("../../database/models/OtpEmail");
const Users = require("../../database/models/User");

const CheckIfOtpAlreadySent = async (req, res, next) => {
    try {

        let { email } = req.body;

        if (!email) {
            return res.status(400).json({ msg: "Bad Request" })
        }

        let user = await Drivers.findOne({ email });
        let getOtp = await OTP_Email.findOne({ user: user._id });


        if (user && user.user_verification) {

            if (!getOtp) {
                await Drivers.findByIdAndUpdate({ _id: user._id }, { $set: { user_verification: null } }, { new: true });
                next();
            };

            const currentTime = new Date();
            const otpTime = getOtp.createdAt;
            const timeDifference = (currentTime - otpTime) / 1000;

            if (timeDifference <= 1800) {
                return res.status(400).json({ msg: "An otp has already sent to your email!" });
            } else {
                next();
            }

        }

        let customer = await Users.findOne({ email });

        if (customer && customer.user_verification) {

            if (!getOtp) {
                await Users.findByIdAndUpdate({ _id: customer._id }, { $set: { user_verification: null } }, { new: true });
                next();
            };

            const currentTime = new Date();
            const otpTime = getOtp.createdAt;
            const timeDifference = (currentTime - otpTime) / 1000;

            if (timeDifference <= 1800) {
                return res.status(400).json({ msg: "An otp has already sent to your email!" });
            } else {
                next();
            }
        }

    } catch (error) {
        return res.status(error?.statusCode ?? HttpStatusCodes.internalServerError).json({ msg: error?.message ?? 'Internal Server Error' })
    }
};

module.exports = CheckIfOtpAlreadySent;