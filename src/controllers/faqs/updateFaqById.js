import Faqs from "../../models/Faqs.js";
import handleError from "../../utils/ReturnError.js"

const getFaqById = async (req, res) => {
    try {
        let { faq_id } = req.params;
        let { title, paragraph } = req.body;

        let faq = await Faqs.findOne({ faq_id });

        if (!faq) {
            return res.status(404).json({ msg: "Faq not found", status: false });
        };

        faq.title = title;
        faq.paragraph = paragraph;

        await faq.save();

        return res.status(200).json({ msg: "Faq Updated successfuly", status: true })

    } catch (error) {
        const response = handleError(error);
        return res.status(response.statusCode).json({ msg: response.body, status: false });

    }
};

export default getFaqById;