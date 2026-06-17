import express from "express"; 
import {Login, Delete} from "../Controller/userController.js";

import { getProperty, addProperty } from "../Controller/propertyController.js";
import authorize from "../MiddleWare/authMiddleware.js"
const router = express.Router()

router.post("/user/auth", Login)
router.delete("/user/", authorize, Delete)
router.get("/getProperty", getProperty)
router.post("/addProperty", authorize, addProperty);

export default router; 
