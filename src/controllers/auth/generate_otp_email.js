const { HttpStatusCodes } = require("../../config.js");
const Drivers = require("../../database/models/Driver.js");
const Users = require("../../database/models/User.js");

const GenerateOtpForEmail = async (req, res) => {
    try {

        const {email} = req.body;

        let user;

        user = await Drivers.findOne({email});

        if(user){

        }

        user = await Users.findOne({email});

        if(!user){
            return res.status(404).json({msg:"User doesn't exists with this email"});
        }

    } catch (error) {
        return res.status(error?.statusCode ?? HttpStatusCodes.internalServerError).json({ msg: error?.message ?? 'Internal Server Error' })
    }
};

module.exports = GenerateOtpForEmail;