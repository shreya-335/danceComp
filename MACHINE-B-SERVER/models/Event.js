const mongoose = require("mongoose")

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  event_date: {
    type: Date,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  total_seats: {
    type: Number,
    required: true,
    min: 1,
  },
  available_seats: {
    type: Number,
    required: true,
    min: 0,
  },
  ticket_price: {
    type: Number,
    required: true,
    min: 0,
  },
  categories: [
    {
      type: String,
      required: true,
    },
  ],
  status: {
    type: String,
    enum: ["upcoming", "ongoing", "completed", "cancelled"],
    default: "upcoming",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Event", eventSchema)
