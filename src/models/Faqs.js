import mongoose from "mongoose";

const FaqsSchema = new mongoose.Schema({
    title: { type: String },
    paragraph: { type: String },
    faq_id: { type: String },
    for: { type: String }
},
    {
        timestamps: true
    }

);

const Faqs = mongoose.models.Faq || mongoose.model("Faq", FaqsSchema);
export default Faqs;