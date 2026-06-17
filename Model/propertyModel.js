
import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true, 
        minlength: 10
    },
    description:{
        type: String
    },
    location:{
        type: String, 
        required: true
    },
    amenities:{
        type: [String], 
        enum:["Wifi","Pool", "Gym", "Breakfast", "Parking","Spa","Pet Friendly", "Kitchen", "AC"]
    },
    owner_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }, 
    url:{
        type: String, 
        required : true 
    },
    contactNum:{
        type: Number,
        minlength: 10, 
        required: true 
    },
    contactMail:{
        type: String
    },
    rating:{
        type: [Number], 
        default: [0,0]
    }
})

export const Property = mongoose.model("Property", propertySchema); 