import mongoose from "mongoose";
const ReviewsSchema = new mongoose.Schema({
    userRef: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        name: { type: String },
        email: { type: String },
        image: { type: String },
        user_phone: { type: String }
    },
    orderRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
    },
    driverRef: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Driver'
        },
        name: { type: String },
        email: { type: String },
        image: { type: String },
        user_phone: { type: String }
    },
    rating: { type: Number },
    text: { type: String },
},
    {
        timestamps: true
    }

);

const Reviews = mongoose.models.Review || mongoose.model("Review", ReviewsSchema);
export default Reviews;