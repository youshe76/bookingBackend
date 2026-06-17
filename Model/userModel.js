import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema(
    {
        email:{
            type: String, 
            required: true, 
            trim: true 
        },
        password:{
            type: String, 
            required:true
        },
        userType: {
            type: String,
            enum : ['user', 'owner'],
            default: "user"
        }
    }
)

export const User = mongoose.model('User', UserSchema);