import { razorpay } from "../Config/razorpay.js"
import Billing from "../Models/billing.model.js"
import crypto from "crypto"
import User from "../Models/user.models.js";

export const createOrder = async (req, res) => {
    try{
       const {plan} = req.body
       const userId = req.userId
       console.log("Logged-in User ID:", userId);

       let amount = 0

       if(plan === "pro"){
        amount = 699
       }
       const order = await razorpay.orders.create({
        amount:
        amount * 100,
        currency: "INR",
        receipt:
        `receipt_${Date.now()}`,
       });
       await Billing.create({
        userId,
        amount,
        plan,
        orderId:order.id
       })

       return res.json({
        success: true,
        order,
       });
    }catch(error){
        console.log(error);

        return res.status(500).json({
            success: false,
            message:
            "Order creation failed",
        })

    }
}

// export const verifyBilling = async (req, res) => {
//     console.log("VERIFY BILLING API CALLED");
//     try {
//         const {razorpay_order_id,
//             razorpay_payment_id,
//             razorpay_signature,
//         } = req.body

//         const userId = req.userId
//         const sign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(
//             razorpay_order_id + "|" + 
//             razorpay_payment_id
//         ).digest("hex")

//         if(sign!==razorpay_signature){
//             return res.json({
//                 success: false,
//                 message:
//                 "Payment verification failed",
//             });
//         }

//         await Billing.findOneAndUpdate({orderId: razorpay_order_id},{
//             paymentId:razorpay_payment_id,
//             status:"paid"
//         })

//         const user = await User.findByIdAndUpdate(userId,{
//             plan:"pro",
//             paymentStatus:
//             "paid",
//             proExpiresAt:
//             new Date(
//                 Date.now() + 
//                 90*24*60*60*1000
//             ),
//         }, {new:true})
//         return res.json({
//             success:true,
//             user
//         })
//     } catch (error) {
//         console.log(error);

//         return res.status(500).json({
//             success:false,
//             message:
//             "Payment verification failed",
//         });
        
//     }
// }

export const verifyBilling = async (req, res) => {
    console.log("VERIFY BILLING API CALLED");

    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        const userId = req.userId;

        console.log("User ID:", userId);
        console.log("Order ID:", razorpay_order_id);

        const sign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (sign !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });
        }

        const billing = await Billing.findOneAndUpdate(
            { orderId: razorpay_order_id, userId },
            {
                paymentId: razorpay_payment_id,
                status: "paid"
            },
            { returnDocument: "after" }
        );

        if (!billing) {
            return res.status(404).json({
                success: false,
                message: "Billing record not found"
            });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            {
                plan: "pro",
                proExpiresAt: new Date(
                    Date.now() + 90 * 24 * 60 * 60 * 1000
                )
            },
            { returnDocument: "after" }
        );

        console.log("Updated User:", user);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.json({
            success: true,
            user
        });

    } catch (error) {
        console.error("Billing Verification Error:", error);

        return res.status(500).json({
            success: false,
            message: "Payment verification failed"
        });
    }
};
