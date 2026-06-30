import express from "express"; 
import {Login, Register, Delete} from "../Controller/userController.js";
import { getProperty, addProperty } from "../Controller/propertyController.js";
import { createBooking, getUserBookings, getOwnerBookings, updateBookingStatus } from "../Controller/bookingController.js";
import authorize from "../MiddleWare/authMiddleware.js"
import upload from "../MiddleWare/uploadMiddleWare.js";

const router = express.Router()

router.post("/user/register", Register)
router.post("/user/login", Login)
router.delete("/user/", authorize, Delete)
router.get("/getProperty", getProperty)
router.post("/addProperty", authorize, upload.single("propertyImage"), addProperty);

// Booking routes
router.post("/booking", authorize, createBooking);
router.get("/booking/my-bookings", authorize, getUserBookings);
router.get("/booking/owner-bookings", authorize, getOwnerBookings);
router.patch("/booking/:id/status", authorize, updateBookingStatus);

export default router; 
