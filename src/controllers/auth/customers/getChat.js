import Chats from "../../../models/Chat.js";
import handleError from "../../../utils/ReturnError.js"

const getChat = async (req, res) => {
    try {
        let user = req.user;
        let { driver_id } = req.params;
        let conversation = await Chats.findOne({ driver: driver_id, client: user._id }).select("messages");

        if (!conversation) {
            return res.status(200).json({ conversation: [], status: true });
        }

        return res.status(200).json({ conversation, status: true })

    } catch (error) {
        console.log(error)
        let response = handleError(error);
        return res.status(response.statusCode).json({ msg: response.body, status: false })
    }
};

export default getChat;