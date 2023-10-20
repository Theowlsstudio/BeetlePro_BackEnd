import mongoose from "mongoose";
const OrdersSchema = new mongoose.Schema({
    distance: { type: String },
    tracking_id: { type: String },
    itemcount: { type: String },
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    package_size: { type: String },
    package_instructions: { type: String },
    sendercity: { type: String },
    senderpostalcode: { type: String },
    senderhouseno: { type: String },
    sender_address: { type: String },
    sender_name: { type: String },
    sender_phonenumber: { type: String },
    sender_description: { type: String },
    receivercity: { type: String },
    recieverpostalcode: { type: String },
    recieverhouseno: { type: String },
    recieverfullname: { type: String },
    recieverphonenum: { type: String },
    recievercompleteaddress: { type: String },
    receiver_description: { type: String },
    itemtype: { type: String },
    deliverytype: { type: String },
    weight: { type: String },
    pickup_location: { type: String },
    dropofflocation: { type: String },
    dropofflat: { type: String },
    dropofflng: { type: String },
    order_type_categories: { type: String },
    sender_order_cancellation_reason: { type: String },
    driver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
    },
    flag: { type: Number },
    order_accepted_at: { type: Date, default: Date.now },
    driver_quotation: { type: String },
    order_status: { type: String },
    status_analytics: [{ status: { type: String }, time: { type: Date, default: Date.now } }],
    order_id: { type: String },
    order_subtotal_price: { type: Number },
    order_shipping_assurance: { type: String },
    scheduled_time: { type: Number },
    reviewed_by_customer: { type: Boolean },
    reviewed_by_driver: { type: Boolean },
    review_id: {
        customer: { type: mongoose.Types.ObjectId, ref: "Review" },
        driver: { type: mongoose.Types.ObjectId, ref: "Review" }
    }
},
    {
        timestamps: true
    }

);

const Orders = mongoose.models.Order || mongoose.model("Order", OrdersSchema);
export default Orders



