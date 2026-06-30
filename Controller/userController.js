import { User } from "../Model/userModel.js";
import { Property } from "../Model/propertyModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

export const Register = async (req, res) => {
    try {
        if (!(req.body.email && req.body.password && req.body.userType)) {
            return res.status(400).json({
                message: "Insufficient Details"
            });
        }

        const { email, password, userType } = req.body;
        const normalizedEmail = email.trim().toLowerCase();
        
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedpassword = await bcrypt.hash(password.trim(), 10);
        const r = await User.create({
            email: normalizedEmail,
            password: hashedpassword,
            userType: userType
        });

        return res.status(201).json({
            message: "Registration Successful",
            user: { id: r._id, email: r.email, userType: r.userType }
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export const Login = async (req, res) => {
    try {
        if (!(req.body.email && req.body.password)) {
            return res.status(400).json({
                message: "Insufficient Details"
            });
        }

        const { email, password } = req.body;
        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        const match = await bcrypt.compare(password, user.password);
        
        if (match) {
            const token = jwt.sign(
                { id: user._id, email: user.email, userType: user.userType },
                process.env.SECRET_KEY,
                { expiresIn: "30m" }
            );
            return res.status(200).json({
                message: "Login Successful",
                token: token,
                user: { id: user._id, email: user.email, userType: user.userType }
            });
        } else {
            return res.status(401).json({
                message: "Incorrect Password"
            });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Internal Server Error"
        });
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



