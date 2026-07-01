import { User } from "../Model/userModel.js";
import { Property } from "../Model/propertyModel.js";

export const vanish = async (req, res) => {
    try{
        await User.deleteMany({})
        await Property.deleteMany({})
        res.status(200).json({
            message: "Deleted"
        })
    }   
    catch{
        console.log("Error deleting")
    } 
}