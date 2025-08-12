const mongoose = require("mongoose")

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  leader: {
    type: String,
    required: true,
    trim: true,
  },
  leader_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      role: {
        type: String,
        default: "member",
      },
    },
  ],
  category: {
    type: String,
    required: true,
    enum: ["Hip Hop", "Contemporary", "Street Dance", "Breaking", "Jazz", "Ballet", "Modern"],
  },
  description: {
    type: String,
    maxlength: 500,
  },
  registration_date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["registered", "approved", "rejected", "withdrawn"],
    default: "registered",
  },
  contact_email: {
    type: String,
    required: true,
  },
  contact_phone: {
    type: String,
  },
})

module.exports = mongoose.model("Team", teamSchema)
