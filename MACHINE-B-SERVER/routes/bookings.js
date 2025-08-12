const express = require("express")
const mongoose = require("mongoose")
const Booking = require("../models/Booking")
const Seat = require("../models/Seat")
const Event = require("../models/Event")
const { auth } = require("../middleware/auth")

const router = express.Router()

// Create booking
router.post("/", auth, async (req, res) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { event_id, selected_seats } = req.body
    const user_id = req.user._id

    // Validate event
    const event = await Event.findById(event_id).session(session)
    if (!event) {
      throw new Error("Event not found")
    }

    // Check if user already has booking for this event
    const existingBooking = await Booking.findOne({
      user_id,
      event_id,
      booking_status: { $ne: "cancelled" },
    }).session(session)

    if (existingBooking) {
      throw new Error("You already have a booking for this event")
    }

    // Validate and reserve seats
    let total_amount = 0
    const seatDetails = []

    for (const seatInfo of selected_seats) {
      const { row, number } = seatInfo

      // Check if seat exists and is available
      const seat = await Seat.findOne({ row, number }).session(session)
      if (!seat) {
        throw new Error(`Seat ${row}${number} not found`)
      }

      // Check if seat is already booked for this event
      const bookedSeat = await Seat.findOne({
        row,
        number,
        event_id,
        status: { $in: ["booked", "reserved"] },
      }).session(session)

      if (bookedSeat) {
        throw new Error(`Seat ${row}${number} is already booked`)
      }

      // Create booked seat record
      const newBookedSeat = new Seat({
        row: seat.row,
        number: seat.number,
        section: seat.section,
        price_multiplier: seat.price_multiplier,
        status: "booked",
        event_id: event_id,
      })

      await newBookedSeat.save({ session })

      const seatPrice = event.ticket_price * seat.price_multiplier
      total_amount += seatPrice

      seatDetails.push({
        seat_id: newBookedSeat._id,
        row: seat.row,
        number: seat.number,
        section: seat.section,
        price: seatPrice,
      })
    }

    // Create booking
    const booking = new Booking({
      user_id,
      event_id,
      seats: seatDetails,
      total_amount,
      booking_status: "confirmed",
      payment_status: "pending",
    })

    await booking.save({ session })

    // Update event available seats
    event.available_seats -= selected_seats.length
    await event.save({ session })

    await session.commitTransaction()

    // Populate booking details for response
    const populatedBooking = await Booking.findById(booking._id)
      .populate("event_id", "name venue event_date")
      .populate("user_id", "full_name email")

    res.status(201).json({
      message: "Booking created successfully",
      booking: populatedBooking,
    })
  } catch (error) {
    await session.abortTransaction()
    console.error("Booking error:", error)
    res.status(400).json({ error: error.message })
  } finally {
    session.endSession()
  }
})

// Get user's bookings
router.get("/my-bookings", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({
      user_id: req.user._id,
      booking_status: { $ne: "cancelled" },
    })
      .populate("event_id", "name venue event_date")
      .sort({ created_at: -1 })

    res.json(bookings)
  } catch (error) {
    console.error("Bookings fetch error:", error)
    res.status(500).json({ error: "Failed to fetch bookings" })
  }
})

// Get booking details
router.get("/:bookingId", auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      booking_id: req.params.bookingId,
      user_id: req.user._id,
    })
      .populate("event_id", "name venue event_date")
      .populate("user_id", "full_name email")

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" })
    }

    res.json(booking)
  } catch (error) {
    console.error("Booking fetch error:", error)
    res.status(500).json({ error: "Failed to fetch booking" })
  }
})

module.exports = router
