
import jwt from "jsonwebtoken";

export default function authorize(req, res,next){
    try{
        const header = req?.headers?.authorization.split(" ")[1]
        const decoded = jwt.verify(header, process.env.SECRET_KEY)
        if(decoded){
            console.log(decoded)
            const {id, userType} = decoded; 
            req.id=id;
            req.userType = userType; 
            next();
            return 
        }
        else{
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

    }
    catch (e){
        console.error(e)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}