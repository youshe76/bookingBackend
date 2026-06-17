import { Property } from "../Model/propertyModel.js"
export const  getProperty = async (req , res )=>{
    try{
        const properties = await Property.find();
        if(!properties){
            return res.status(200).json({
                message: "Not Found"
            })
        }
        res.status(200).json(
            properties
        )
    }
    catch(e){
        console.error(e);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const addProperty = async  (req,res)=>{
    try{
        if(req.userType==="owner"){
            const {name, location, owner_id, amenities, contactNum, contactMail, url, description}= req.body
            const r = await Property.find({
                $and:[
                    {name: name},
                    {location: location}
                ]
            })
            console.log("The found result is", r)
            if(r.length >0){
                return res.status(500).json({
                    message: "Please pick another name or location"
                })
            }
            const property = await Property.create({
                name: name, 
                location: location, 
                owner_id: owner_id, 
                amenities: amenities, 
                contactNum: contactNum, 
                contactMail: contactMail,
                url: url , 
                description: description

            })
            res.status(200).json({
                message: "Property added successfully",
                property
            })
        }
    }
    catch (e){
        console.error(e)
        res.send(500).json({
            message: "Internal Server Error"
        })
    }
}
