import Drivers from "../../../models/Driver.js";
import Files from "../../../models/File.js";
import handleError from "../../../utils/ReturnError.js";
import { upload } from '../../uploads/Upload.js';
import config from '../../../../config.js';


const OnboardingV1 = async (req, res) => {
    try {
        let user = req.user;
        let id = user._id;
        const files = req.files;
        if (!files.length) {
            return res.status(401).json({ msg: "select files complete onboarding", status: false });
        }
        files.forEach(async (element) => {
            let uploadFile = await Files.create({
                ...element,
                isDriver: true,
                user: id
            });
            let fieldname = element.fieldname;
            let imageURL = `${config.imageURL}/${uploadFile._id}`;
            await Drivers.findByIdAndUpdate({ _id: id }, { $set: { [fieldname]: imageURL } }, { new: true });
        });
        return res.status(200).json({ msg: "Files have been uploaded!", status: true })
    } catch (error) {
        let response = handleError(error)
        return res.status(response.statusCode).json({ msg: response.body, status: false });
    }
};

const OnboardingV2 = async (req, res) => {
    try {
        let user = req.user;
        let id = user._id;
        const files = req.files;
        if (Object.keys(files).length === 0) {
            return res.status(401).json({ msg: "select files complete onboarding", status: false });
        }
        let filesarry = [];
        for (const element in files) {
            filesarry.push({ ...files[element][0] });
        }
        filesarry.forEach(async (element) => {
            let uploadFile = await Files.create({
                ...element,
                isDriver: true,
                user: id
            });
            let fieldname = element.fieldname;
            let imageURL = `${config.imageURL}/${uploadFile._id}`;
            await Drivers.findByIdAndUpdate({ _id: id }, { $set: { [fieldname]: imageURL } }, { new: true });
        });

        return res.status(200).json({ msg: "Files are uploaded!", status: true })
    } catch (error) {
        let response = handleError(error);
        return res.status(response.statusCode).json({ msg: response.body, status: false });
    }
};

const OnboardingV3 = async (req, res) => {

    try {

        let user = req.user;
        let id = user._id;
        upload.single(req.fieldName)(req, res, async function (err) {
            if (err) {
                return res.status(400).json({ error: err.message, status: false });
            }
            let uploadFile = await Files.create({
                ...req.file,
                isDriver: true,
                user: id,
            });
            let fieldname = req.file.fieldname;
            let imageURL = `${config.imageURL}/${uploadFile._id}`;
            await Drivers.findByIdAndUpdate({ _id: id }, { $set: { [fieldname]: imageURL } }, { new: true });
            res.send({ msg: 'File uploaded successfully', status: true });
        });

    } catch (error) {
        let response = handleError(error)
        return res.status(response.statusCode).json({ msg: response.body, status: false });
    }
};

export { OnboardingV1, OnboardingV2, OnboardingV3 };