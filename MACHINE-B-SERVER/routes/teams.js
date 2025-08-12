const express = require("express")
const Team = require("../models/Team")
const User = require("../models/User")
const { auth, requireRole } = require("../middleware/auth")

const router = express.Router()

// Get all teams
router.get("/", async (req, res) => {
  try {
    const teams = await Team.find({ status: "approved" })
      .populate("leader_id", "full_name email")
      .sort({ registration_date: -1 })
    res.json(teams)
  } catch (error) {
    console.error("Teams fetch error:", error)
    res.status(500).json({ error: "Failed to fetch teams" })
  }
})

// Register new team
router.post("/register", auth, requireRole(["team_leader", "admin"]), async (req, res) => {
  try {
    const { name, members, category, description, contact_email, contact_phone } = req.body

    // Check if team name already exists
    const existingTeam = await Team.findOne({ name })
    if (existingTeam) {
      return res.status(400).json({ error: "Team name already exists" })
    }

    // Check if user already leads a team
    const existingLeadership = await Team.findOne({ leader_id: req.user._id })
    if (existingLeadership) {
      return res.status(400).json({ error: "You already lead a team" })
    }

    const team = new Team({
      name,
      leader: req.user.full_name,
      leader_id: req.user._id,
      members,
      category,
      description,
      contact_email,
      contact_phone,
      status: "registered",
    })

    await team.save()

    // Update user's team_id
    await User.findByIdAndUpdate(req.user._id, { team_id: team._id })

    res.status(201).json({
      message: "Team registered successfully",
      team,
    })
  } catch (error) {
    console.error("Team registration error:", error)
    res.status(500).json({ error: "Failed to register team" })
  }
})

// Get team details
router.get("/:id", async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate("leader_id", "full_name email phone")

    if (!team) {
      return res.status(404).json({ error: "Team not found" })
    }

    res.json(team)
  } catch (error) {
    console.error("Team fetch error:", error)
    res.status(500).json({ error: "Failed to fetch team" })
  }
})

module.exports = router
