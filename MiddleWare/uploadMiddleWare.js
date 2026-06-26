import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb)=>cb(null, "./uploads"),
    filename: (req, file,cb)=>{
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix +"."+ file.originalname.split(".")[1]);
    }
})

const upload = multer({storage: storage, limits:{
    fileSize: 1024 *1024 * 5,
    files:1
}});
export default upload;