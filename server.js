import express from "express";
import connectDB from "./Model/connectDB.js";
import dotenv from "dotenv";
import router from "./Routes/routes.js";
connectDB()
dotenv.config()
const app = express()
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use("/api/v1/", router)
app.get("/", (req, res)=>{
    res.json({
        message: "hello world"
    })
})

app.listen(process.env.PORT, ()=>{
    console.log("Server is running at http://localhost:"+process.env.PORT)
})

