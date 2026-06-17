import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()
const connectDB = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.DB_URI,{
            dbName: process.env.DB_NAME || "DB"
        } );
        console.log("DB connected")
    }
    catch (e){
        console.error(e)
    }
}

export default connectDB;