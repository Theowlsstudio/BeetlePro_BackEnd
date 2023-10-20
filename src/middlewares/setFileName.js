import config from "../../config.js";

let { HttpStatusCodes } = config;

function dynamicFieldName(req, res, next) {
    try {

        const filename = req.query.filename || req.body.filename;

        if (!filename) {
            return res.status(400).json({ msg: "Please specify the file name to upload the file!" })
        }

        req.fieldName = filename

        next();
    } catch (error) {
        return res.status(error?.statusCode ?? HttpStatusCodes.internalServerError).json({ msg: error?.message ?? "Internal server error" })
    }
};

export default dynamicFieldName;