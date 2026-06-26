import { Booking } from "../Model/bookingModel.js";
import { Property } from "../Model/propertyModel.js";

export const createBooking = async (req, res) => {
    try {
        const { property_id, startDate, endDate } = req.body;
        
        if (!property_id || !startDate || !endDate) {
            return res.status(400).json({
                message: "Missing required details: property_id, startDate, endDate"
            });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start >= end) {
            return res.status(400).json({
                message: "End date must be after start date"
            });
        }

        const property = await Property.findById(property_id);
        if (!property) {
            return res.status(404).json({
                message: "Property not found"
            });
        }

        const overlapping = await Booking.findOne({
            property_id,
            status: { $ne: "cancelled" },
            $or: [
                {
                    startDate: { $lt: end },
                    endDate: { $gt: start }
                }
            ]
        });

        if (overlapping) {
            return res.status(400).json({
                message: "Property is already booked for these dates"
            });
        }

        // Calculate total price based on duration
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const totalPrice = diffDays * Number(property.price);

        const booking = await Booking.create({
            property_id,
            user_id: req.id,
            startDate: start,
            endDate: end,
            totalPrice,
            status: "pending"
        });

        res.status(200).json({
            message: "Booking requested successfully",
            booking
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

export const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user_id: req.id })
            .populate("property_id")
            .sort({ createdAt: -1 });

        res.status(200).json(bookings);
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

export const getOwnerBookings = async (req, res) => {
    try {
        if (req.userType !== "owner") {
            return res.status(403).json({
                message: "Access denied. Only owners can view incoming bookings."
            });
        }

        const myProperties = await Property.find({ owner_id: req.id });
        const myPropertyIds = myProperties.map(p => p._id);

        const bookings = await Booking.find({ property_id: { $in: myPropertyIds } })
            .populate("property_id")
            .populate("user_id", "email")
            .sort({ createdAt: -1 });

        res.status(200).json(bookings);
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

export const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["confirmed", "cancelled"].includes(status)) {
            return res.status(400).json({
                message: "Invalid status update. Must be 'confirmed' or 'cancelled'."
            });
        }

        const booking = await Booking.findById(id).populate("property_id");
        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        const isOwner = req.userType === "owner" && booking.property_id.owner_id.toString() === req.id;
        const isClient = booking.user_id.toString() === req.id;

        if (!isOwner && !isClient) {
            return res.status(403).json({
                message: "Unauthorized to update this booking"
            });
        }

        // Clients can only cancel bookings
        if (isClient && !isOwner && status !== "cancelled") {
            return res.status(403).json({
                message: "Travelers can only cancel bookings"
            });
        }

        booking.status = status;
        await booking.save();

        res.status(200).json({
            message: `Booking status updated to ${status} successfully`,
            booking
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
