import mongoose from "mongoose";
const billingScheme = new mongoose.Schema({
    userId:{
        type:
        mongoose.Schema.Types.ObjectId,

        ref:"User",
    },
    amount:Number,
    plan:String,
    paymentId:String,
    orderId:String,
    status:{
        type:String,

        enum:[
            "created",
            "paid",
            "failed",
        ],

        default: "created",
    },
}, {timestamps:true})

const Billing = mongoose.model("Billing", billingScheme)

export default Billing