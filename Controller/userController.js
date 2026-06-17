import { User } from "../Model/userModel.js";
import { Property } from "../Model/propertyModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

export const Login = async (req, res) => {
    try{
        
        if(!(req.body.email && req.body.password)){
            return res.status(401).json({
                message: "Insufficient Details"
            })
        }

        const {email, password, userType} = req.body; 
        const user = await User.findOne({email: email.trim()});
       
        
        if(!user){
            if(!userType){ return res.status(401).json({
                message: "Insufficient Details"
            })}
            const hashedpassword = await bcrypt.hash(password?.trim(), 10)
            const r = await  User.create({email: email.trim(), password: hashedpassword,userType: userType })
            console.log(email)
            return res.status(200).json({
                message: "Registration Successful", 
                user: {id: r._id, email: r.email, userType:  r.userType}
            })
        }
        else{
           
            const match = await bcrypt.compare(password, user.password);
            
            if (match){
                const token = jwt.sign({id: user._id, email: user.email, userType: user.userType}, process.env.SECRET_KEY, {expiresIn: "30m"})
                return res.status(200).json(
                    {
                        message: "Login Sucessful", 
                        token : token 
                    }
                )
            }
            else{
                return res.status(400).json({
                    message: "Incorrect Password"
                })
            }
        }
        
    }
    catch (e){
        console.error(e);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const Delete = async (req, res)=>{
    try{
        const r = await User.deleteOne({id: req.id})
        await Property.deleteMany({
            owner_id: req.id
        })

        res.status(200).json({
            message: "User Deleted Successfully"
        })
    }
    catch (e){
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}



