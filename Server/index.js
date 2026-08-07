import express from "express"
import dotenv from "dotenv"
import connectDB from "./Config/ConnectDB.js";
import cookieParser from "cookie-parser";
dotenv.config()
import cors from "cors"
import authRouter from "./Routes/auth.route.js";
import userRouter from "./Routes/user.route.js";


const app = express()
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

 


app.get("/", (req, res)=>{
    res.json("Hello from Server")
})

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
const PORT = process.env.PORT

app.listen(PORT, ()=>{
    console.log(`Server Started on PORT ${PORT}`)
    connectDB()
})