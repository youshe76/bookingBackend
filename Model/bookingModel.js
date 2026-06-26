import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    property_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending"
    }
}, {
    timestamps: true
});

export const Booking = mongoose.model("Bookng", bookingSchema);
