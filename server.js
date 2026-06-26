import express from "express";
import connectDB from "./Model/connectDB.js";
import dotenv from "dotenv";
import router from "./Routes/routes.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB()
dotenv.config()
const app = express()

const options ={
    origin: "https://hotel-booking-front-end-umber.vercel.app",
    credentials:true
}

app.use(cors(options));
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/v1/", router)



app.get("/", (req, res)=>{
    res.json({
        message: "hello world"
    })
})

app.listen(process.env.PORT, ()=>{
    console.log("Server is running at http://localhost:"+process.env.PORT)
})

