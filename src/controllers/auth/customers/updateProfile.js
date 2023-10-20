import Files from "../../../models/File.js";
import handleError from "../../../utils/ReturnError.js";
import config from '../../../../config.js';
import Users from "../../../models/User.js";
import Drivers from "../../../models/Driver.js";

let { imageURL } = config;

const updateUserProfile = async (req, res) => {
    try {

        let user = req.user;
        let data = req.body;
        let file = req.file ?? null;

        if (!data) {
            return res.status(400).json({ msg: "Please provide data to update profile", status: false });
        }

        if (file) {

            let Image = await Files.create({ ...file, user: user._id });
            let savedImage = await Image.save();

            let imagelink = `${imageURL}/${savedImage._id}`;
            data.user_image = imagelink;
            for (const key in data) {
                await Users.findByIdAndUpdate({ _id: user._id }, { $set: { [key]: data[key], user_image: imagelink } }, { new: true });
            }

            await Users.findById(user._id).select('-password').lean().exec();

            return res.status(200).json({ msg: "Profile updated successfuly", status: true })

        }

        for (const key in data) {
            await Users.findByIdAndUpdate({ _id: user._id }, { $set: { [key]: data[key] } }, { new: true });
        }

        await Users.findById(user._id).select('-password').lean().exec();

        return res.status(200).json({ msg: "Profile updated successfuly", status: true })

    } catch (error) {
        let response = handleError(error);
        return res.status(response.statusCode).json({ msg: response.body, status: false });
    }
};

export default updateUserProfile;
