const express = require("express")
const Seat = require("../models/Seat")
const Event = require("../models/Event")

const router = express.Router()

// Get available seats for an event
router.get("/event/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params

    // Check if event exists
    const event = await Event.findById(eventId)
    if (!event) {
      return res.status(404).json({ error: "Event not found" })
    }

    // Get all seats (general seating layout)
    const seats = await Seat.find({ event_id: { $exists: false } }).sort({ row: 1, number: 1 })

    // Get booked seats for this specific event
    const bookedSeats = await Seat.find({
      event_id: eventId,
      status: { $in: ["booked", "reserved"] },
    })

    // Mark booked seats
    const seatMap = seats.map((seat) => {
      const isBooked = bookedSeats.some(
        (bookedSeat) => bookedSeat.row === seat.row && bookedSeat.number === seat.number,
      )

      return {
        ...seat.toObject(),
        status: isBooked ? "booked" : "available",
        price: event.ticket_price * seat.price_multiplier,
      }
    })

    res.json({
      event: {
        id: event._id,
        name: event.name,
        venue: event.venue,
        event_date: event.event_date,
        base_price: event.ticket_price,
      },
      seats: seatMap,
    })
  } catch (error) {
    console.error("Seats fetch error:", error)
    res.status(500).json({ error: "Failed to fetch seats" })
  }
})

module.exports = router
