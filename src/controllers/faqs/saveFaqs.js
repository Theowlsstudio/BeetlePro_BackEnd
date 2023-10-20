import Faqs from "../../models/Faqs.js";
import handleError from "../../utils/ReturnError.js";
import { v4 as uuidv4 } from "uuid";

const saveFaqs = async (req, res) => {
    try {

        let { faqs } = req.body;

        if (!faqs) {
            return res.status(400).json({ msg: "Bad request", status: false })
        };

        if (faqs.length < 1) {
            return res.status(400).json({ msg: "Bad request", status: false })
        }


        await faqs.forEach(async (element) => {
            let faq_id = uuidv4();
            let createFaq = await Faqs.create({ ...element, faq_id });
            await createFaq.save();
        });

        return res.status(200).json({ msg: "Faqs saved successfuly!", status: true })

    } catch (error) {
        const response = handleError(error);
        return res.status(response.statusCode).json({ response, status: false });
    }
};

export default saveFaqs;