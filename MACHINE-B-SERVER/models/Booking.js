const mongoose = require("mongoose")
const { v4: uuidv4 } = require("uuid")

const bookingSchema = new mongoose.Schema({
  booking_id: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  event_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  seats: [
    {
      seat_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seat",
        required: true,
      },
      row: String,
      number: Number,
      section: String,
      price: Number,
    },
  ],
  total_amount: {
    type: Number,
    required: true,
  },
  booking_status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
  payment_status: {
    type: String,
    enum: ["pending", "paid", "refunded"],
    default: "pending",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Booking", bookingSchema)
