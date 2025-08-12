const express = require("express")
const Event = require("../models/Event")
const { auth, requireRole } = require("../middleware/auth")

const router = express.Router()

// Get all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find({ status: { $ne: "cancelled" } }).sort({ event_date: 1 })
    res.json(events)
  } catch (error) {
    console.error("Events fetch error:", error)
    res.status(500).json({ error: "Failed to fetch events" })
  }
})

// Get single event
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) {
      return res.status(404).json({ error: "Event not found" })
    }
    res.json(event)
  } catch (error) {
    console.error("Event fetch error:", error)
    res.status(500).json({ error: "Failed to fetch event" })
  }
})

// Create new event (admin only)
router.post("/", auth, requireRole(["admin"]), async (req, res) => {
  try {
    const event = new Event(req.body)
    await event.save()
    res.status(201).json(event)
  } catch (error) {
    console.error("Event creation error:", error)
    res.status(500).json({ error: "Failed to create event" })
  }
})

module.exports = router
