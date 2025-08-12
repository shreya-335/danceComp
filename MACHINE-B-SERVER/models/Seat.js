const mongoose = require("mongoose")

const seatSchema = new mongoose.Schema({
  row: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  section: {
    type: String,
    enum: ["VIP", "Premium", "General"],
    required: true,
  },
  price_multiplier: {
    type: Number,
    required: true,
    default: 1.0,
  },
  status: {
    type: String,
    enum: ["available", "booked", "reserved"],
    default: "available",
  },
  event_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
})

// Compound index for unique seat identification
seatSchema.index({ row: 1, number: 1, event_id: 1 }, { unique: true })

module.exports = mongoose.model("Seat", seatSchema)
