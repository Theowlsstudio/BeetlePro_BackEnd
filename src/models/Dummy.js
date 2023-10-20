import mongoose from "mongoose";
const Dummy = new mongoose.Schema({
    scheduled_time: { type: Number },
    order_status:{type:String}
},
    {
        timestamps: true
    }

);

const Dummys = mongoose.models.Dummy || mongoose.model("Dummy", Dummy);
export default Dummys



