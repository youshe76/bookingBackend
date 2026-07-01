import multer from "multer"
import cloudinary from "../Utils/cloudinary.js";
import {CloudinaryStorage} from "multer-storage-cloudinary"

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "uploads",
        allowed_formats: ["jpg", "jpeg", "png"]
    }
})

const upload = multer({
    storage,
    limits:{
        fileSize: 1024 * 1024*5
    }
})
export default upload;