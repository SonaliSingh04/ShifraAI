import React from 'react'
import { HiOutlineSparkles, HiOutlineMicrophone, HiOutlineCodeBracket, HiOutlineBolt } from "react-icons/hi2";
import { FcGoogle } from "react-icons/fc";
import logo from "../assets/logo.png"
import { auth, provider } from "../utils/firebase";
import { signInWithPopup } from "firebase/auth";
import axios from "axios"
import {serverurl} from "../App.jsx"
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Login({setUser}) {
    const navigate = useNavigate()
    const FEATURES = [
        {
            icon:
                <HiOutlineMicrophone />,
            title:
                "Voice AI",
            desc:
                "Natural real-time voice conversations.",
        },
        {
            icon:
                <HiOutlineSparkles />,
            title:
                "Smart Navigation",
            desc:
                "Navigate pages using voice commands.",
        },
        {
            icon:
                <HiOutlineCodeBracket />,
            title:
                "Easy Embed",
            desc:
                "Add assistant using one script tag.",
        },
        {
            icon:
                <HiOutlineBolt />,
            title:
                "Fast responses",
            desc:
                "Optimized Gemini AI responses.",
        },
    ];

    const handleLogin = async () => {
    try {
        const result = await signInWithPopup(auth, provider);

        // console.log("Firebase user:", result.user);

        const { displayName, email } = result.user;

        const res = await axios.post(
            serverurl + "/api/auth/google",
            {
                name: displayName,
                email
            },
            {
                withCredentials: true
            }
        );

        // console.log("Backend response:", res.data);
        setUser(res.data);
        toast.success("Login Successfully")

        navigate("/");
    } catch (error) {
        toast.error("Login Failed")
        console.log(error.response?.data);
        console.log(error);
    }
};
    return (
        <div className='min-h-screen bg-gradient-to-br from-purple-50 via-white to-emerald-50 overflow-hidden'>
            <div className='max-w-7xl mx-auto px-6 py-8 lg:py-12'>
                <div className='grid lg:grid-cols-2 gap-10 items-center'>
                    {/* {left} */}
                    <div>
                        <div className='inline-flex items-center gap-2 px-4 py-2  rounded-full border border-purple-200 bg-purple-100 text-purple-600 text-sm font-medium'>
                            <HiOutlineSparkles />
                            AI Voice Assistant Platform
                        </div>
                        <h1 className='mt-6 text-4xl lg:text-6xl font-black leading-tight text-[#081028]'>
                            Build AI Assistants
                            <span className='block text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-emerald-500'>For Any Website</span>

                        </h1>
                        <p className='mt-5 text-base text-[#475569] leading-7 max-w-2xl'>
                            Create customizable AI voice assistants that talk, guide users, and integrate into any website instantly.
                        </p>
                        <button onClick={handleLogin} className='mt-6 h-14 px-8 rounded-2xl bg-gradient-to-r from-purple-500 to-emerald-500 text-white text-lg font-semibold flex items-center gap-4 shadow-[0_20px_80px_rgba(139,92,246,0.25)] hover:scale-[1.02] transition cursor-pointer'>
                            <FcGoogle className='text-3xl bg-white rounded-full' />
                            Continue with Google
                        </button>
                        <p className='mt-4 text-sm text-[#64748b]'>Free plan includes 200 AI responses</p>
                    </div>
                    {/*{right}*/}
                    <div className='relative'>
                        <div className='absolute inset-0 bg-gradient-to-r from-purple-200/50 to-emerald-200/40 blur-[120px]' />

                        <div className='relative rounded-[32px] border border-black/5 bg-white shadow-[0_20px_80px_rgba(0,0,0,0.06)] p-6 overflow-hidden'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <h2 className='mt-2 text-3xl font-bold text-[#081028]'>Features</h2>
                                </div>
                                <div className='w-14 h-14 rounded-3xl bg-gradient-to-r from-purple-500 flex items-center justify-center shadow-[0_10px_40px_rgba(139,92,246,0.25)] p-3'>
                                    <img src={logo} alt="logo" className='w-full h-full object-contain' />
                                </div>
                            </div>
                            <div className='mt-6 space-y-3'>
                                {
                                    FEATURES.map(({icon, title, desc}, index) => (
                                        <div key={index} className='flex gap-4 bg-[#f8fafc] p-4 rounded-2xl border border-black/5'>
                                            <div className='min-w-[50px] h-[50px] rounded-xl bg-gradient-to-r from-purple-500 to-emerald-500 text-white text-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(139,92,246,0.20)]'>
                                                {icon}
                                                </div>
                                            <div>
                                                <h3 className='text-base font-semibold text-[#081028]'>{title}</h3>
                                                <p className='mt-1 text-sm leading-6 text-[#64748b]'>{desc}</p>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

            export default Login