import React from 'react'
import { useEffect } from 'react';
import toast from 'react-hot-toast'
import {useNavigate} from 'react-router-dom'
import { serverurl } from '../App';
import axios from 'axios';

function Billing({user, setUser}) {
  const navigate = useNavigate()

  useEffect(()=>{
      if(user && !user.isSetupComplete){
        toast.error(
          "Set up your assistant first"
        );

        navigate("/builder");
        
      }
    },[])


  const remainingMessages = Math.max(0, (user?.RequestLimit || 0) - (user?.totalMessages || 0));

  const remainingDays = user?.proExpiresAt ? Math.max(0, Math.ceil((new Date(user.proExpiresAt) -
    new Date()) / (1000 * 60 * 60 * 24))) : 0;

    const handlepay = async (params) => {
      try {
        const res = await axios.post(serverurl + "/api/billing/order", {plan:"pro"},
          {withCredentials:true}
        )

        const order = res.data.order

        const options = {
          key:import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount:
          order.amount,

          currency:
          order.currency,

          name:
          "ShifraAI",

          description:
          "Pro Plan",

          order_id:
          order.id,

          handler:async(response)=>{
            console.log("Sending payment verification request:", response);
            const verifyRes = await axios.post(serverurl + "/api/billing/verify", response, {withCredentials:true})

            if(verifyRes.data.success){
              toast.success("Payment successfully")
              setUser(verifyRes.data.user)
            }
          },
          theme:{
            color:"#7c3aed",
          },
        }

        const razorpay = new window.Razorpay(options)
        razorpay.open()
      } catch (error) {
        toast.error("Payment Failed")
        console.log(error);
      }
      
    }

  return (
    <div className='min-h-screen bg-[#f7f8fc] px-3 py-5'>
      <div className='max-w-4xl mx-auto'>
        <div className='mb-4'>

          <h1 className="text-3xl font-bold text-gray-900">
            Billing and Subscription
          </h1>

          <p className="mt-2 text-gray-500">
            Manage your AI assistant plan and usage.
          </p>

        </div>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4'>
              <div className='bg-white rounded-2xl p-4 border border-gray-100 shadow-sm'>
                <p className='text-xs text-gray-400'>Current Plan</p>
                <h2 className='text-lg font-bold text-[#081028] mt-1 capitalize'>{user?.plan}</h2>
              </div>

              <div className='bg-white rounded-2xl p-4 border border-gray-100 shadow=-sm'>
                <p className='text-xs text-gray-400'>Gemini Status</p>
                <h2 className={`text-lg font-bold mt-1 capitalize ${
                  user?.geminiStatus === "active"
                  ?"text-emerald-600"
                  : user?.geminiStatus === "invalid"
                  ?"text-red-500"
                : "text-amber-500"
              }`}>{user?.geminiStatus}</h2>
              </div>

              <div className='bg-white rounded-2xl p-4 border border-gray-100 shadow=-sm'>
                <p className='text-xs text-gray-400'>{user?.plan === "free"?
                "Messages Left" : "Plan Expiry"}</p>
                <h2 className='text-lg font-bold text-[#081028] mt-1 capitalize'>{user?.plan === "free" ?
                 remainingMessages : `${remainingDays} Days`}</h2>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-5'>
              {/* free */}
              <div className='bg-white rounded-3xl p-8 border border-gray-100 shadow-sm'>
                <h2 className="text-2xl font-bold text-[#081028]">
                  Free Plan
                </h2>
                <h3 className="text-5xl font-bold mt-5 text-[#081028]">
                  ₹0
                </h3>
                <ul className="mt-4 space-y-3 text-gray-600">
                  <li>200 AI messages</li>
                  <li>Voice assistant</li>
                  <li>Navigation support</li>
                  <li>Basic customization</li>
                </ul>
              </div>

              <div className='rounded-2xl p-5 bg-gradient-to-r from-purple-600 to-emerald-500
              text-white shadow-lg'>

                <h2 className="text-xl font-bold text-[#081028]">
                  Pro Plan
                </h2>
                <h3 className="text-4xl font-bold mt-3 text-[#081028]">
                  ₹699
                </h3>

                <p className='mt-1 text-sm opacity-80'>3 Months Access</p>

                <ul className='mt-4 space-y-3 text-sm opacity-90'>
                  <li>Unlimited AI messages</li>
                  <li>Advanced AI assistant</li>
                  <li>Priority performance</li>
                  <li>Unlimited navigation</li>
                  <li>Premium support</li>
                </ul>

                <button
                onClick={handlepay}
                 disabled={user?.plan === "pro"} className={`mt-8 h-14 w-full rounded-2xl font-semibold transition ${user?.plan === "pro"
                  ? "bg-emerald-200 text-black cursor-default"
                  : "bg-white text-[#081028] cursor-pointer"
                }`}>
                  {user?.plan === "pro" ? "Active Plan" : "Upgrade Now"}
                </button>

              </div>
            </div>

      </div>
    </div>
  )
}

export default Billing