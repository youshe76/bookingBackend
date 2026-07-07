import { Property } from "../Model/propertyModel.js"
import { Booking } from "../Model/bookingModel.js";
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
            

            const property = await Property.create({
                name: propertyName.trim(), 
                price: price,
                description: description.trim(),
                location: city.trim(), 
                amenities: parsedAmenities, 
                owner_id: req.id, 
                contactNum: phone, 
                contactMail: email.trim(),
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

export const deleteProperty = async (req, res) => {
    try {
        if (req.userType !== "owner") {
            return res.status(403).json({
                message: "Only owners can delete properties"
            });
        }

        const { id } = req.params;

        const property = await Property.findById(id);
        if (!property) {
            return res.status(404).json({
                message: "Property not found"
            });
        }

        // Check if the property belongs to the logged-in owner
        if (property.owner_id.toString() !== req.id) {
            return res.status(403).json({
                message: "You are not authorized to delete this property"
            });
        }

        // Delete all bookings associated with this property
        await Booking.deleteMany({ property_id: id });

        // Delete the property itself
        await Property.findByIdAndDelete(id);

        res.status(200).json({
            message: "Property deleted successfully"
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
