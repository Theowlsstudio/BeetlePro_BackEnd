const { HttpStatusCodes } = require("../../config")

const sendOTPtoMail= async (req,res)=>{
    try {
        
    } catch (error) {
        return res.status(error?.statusCode??HttpStatusCodes.internalServerError).json({msg:error?.message??"Internal Server Error"})
    }
}