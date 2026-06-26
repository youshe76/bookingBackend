import { Property } from "../Model/propertyModel.js"
import fs from "node:fs/promises";
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

            const {propertyName, price, city, amenities, phone, email, description}= req.body;
            console.log("File: ", req.file, "Body",  req.body)
            
            
            
            let parsedAmenities = amenities;
            if (typeof amenities === 'string') {
                parsedAmenities = amenities.split(',').map(item => item.trim());
            }

            const r = await Property.find({
                $and:[
                    {name: propertyName},
                    {location: city}
                ]
            })
            
            if(r.length > 0){
                return res.status(400).json({
                    message: "Please pick another name or location"
                })
            }
            if(!req.file){
                return res.status(400).json({
                    message: "No file was uploaded"
                })
            }
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
            if(!allowedTypes.includes(req.file.mimetype)){

            }

            const property = await Property.create({
                name: propertyName, 
                price: price,
                description: description,
                location: city, 
                amenities: parsedAmenities, 
                owner_id: req.id, 
                contactNum: phone, 
                contactMail: email,
                url: req.file.path
            })
            res.status(200).json({
                message: "Property added successfully",
                property
            })
        } else {
            res.status(403).json({
                message: "Only owners can add properties"
            })
        }
    }
    catch (e){
        console.error(e)
        try{
            await fs.unlink(req.file.path)
        }
        catch (e){
            console.error("File deletion error", e)
        }
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}
