"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"
import api from "../config/api"

const SeatSelection = () => {
  const { eventId } = useParams()
  const navigate = useNavigate()

  const [event, setEvent] = useState(null)
  const [seats, setSeats] = useState([])
  const [selectedSeats, setSelectedSeats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [bookingDialog, setBookingDialog] = useState(false)
  const [booking, setBooking] = useState(false)

  useEffect(() => {
    fetchSeats()
  }, [eventId])

  const fetchSeats = async () => {
    try {
      const response = await api.get(`/seats/event/${eventId}`)
      setEvent(response.data.event)
      setSeats(response.data.seats)
    } catch (error) {
      setError("Failed to load seats")
      console.error("Failed to fetch seats:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSeatClick = (seat) => {
    if (seat.status === "booked") return

    const seatId = `${seat.row}-${seat.number}`
    const isSelected = selectedSeats.some((s) => `${s.row}-${s.number}` === seatId)

    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((s) => `${s.row}-${s.number}` !== seatId))
    } else {
      setSelectedSeats([...selectedSeats, seat])
    }
  }

  const getSeatColor = (seat) => {
    const seatId = `${seat.row}-${seat.number}`
    const isSelected = selectedSeats.some((s) => `${s.row}-${s.number}` === seatId)

    if (seat.status === "booked") return "#f44336" // Red
    if (isSelected) return "#4caf50" // Green
    if (seat.section === "VIP") return "#ff9800" // Orange
    if (seat.section === "Premium") return "#2196f3" // Blue
    return "#9e9e9e" // Gray for General
  }

  const getTotalPrice = () => {
    return selectedSeats.reduce((total, seat) => total + seat.price, 0)
  }

  const handleBooking = async () => {
    if (selectedSeats.length === 0) return

    setBooking(true)
    try {
      const bookingData = {
        event_id: eventId,
        selected_seats: selectedSeats.map((seat) => ({
          row: seat.row,
          number: seat.number,
        })),
      }

      const response = await api.post("/bookings", bookingData)

      setBookingDialog(false)
      navigate("/profile", {
        state: {
          message: `Booking confirmed! Booking ID: ${response.data.booking.booking_id}`,
        },
      })
    } catch (error) {
      setError(error.response?.data?.error || "Booking failed")
    } finally {
      setBooking(false)
    }
  }

  const groupSeatsByRow = () => {
    const grouped = {}
    seats.forEach((seat) => {
      if (!grouped[seat.row]) {
        grouped[seat.row] = []
      }
      grouped[seat.row].push(seat)
    })

    // Sort seats within each row
    Object.keys(grouped).forEach((row) => {
      grouped[row].sort((a, b) => a.number - b.number)
    })

    return grouped
  }

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    )
  }

  const groupedSeats = groupSeatsByRow()

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Select Your Seats
      </Typography>

      {event && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h5">{event.name}</Typography>
          <Typography variant="body1">Venue: {event.venue}</Typography>
          <Typography variant="body1">Date: {new Date(event.event_date).toLocaleDateString()}</Typography>
          <Typography variant="body1">Base Price: ${event.base_price}</Typography>
        </Paper>
      )}

      {/* Legend */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Legend:
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          <Chip label="Available" sx={{ backgroundColor: "#9e9e9e", color: "white" }} />
          <Chip label="Selected" sx={{ backgroundColor: "#4caf50", color: "white" }} />
          <Chip label="Booked" sx={{ backgroundColor: "#f44336", color: "white" }} />
          <Chip label="VIP" sx={{ backgroundColor: "#ff9800", color: "white" }} />
          <Chip label="Premium" sx={{ backgroundColor: "#2196f3", color: "white" }} />
        </Box>
      </Box>

      {/* Stage */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Paper sx={{ p: 2, backgroundColor: "#f5f5f5" }}>
          <Typography variant="h6">🎭 STAGE 🎭</Typography>
        </Paper>
      </Box>

      {/* Seat Map */}
      <Box sx={{ mb: 4 }}>
        {Object.keys(groupedSeats)
          .sort()
          .map((row) => (
            <Box key={row} sx={{ mb: 1, display: "flex", alignItems: "center" }}>
              <Typography variant="h6" sx={{ minWidth: 30, mr: 2 }}>
                {row}
              </Typography>
              <Box display="flex" gap={0.5} flexWrap="wrap">
                {groupedSeats[row].map((seat) => (
                  <Button
                    key={`${seat.row}-${seat.number}`}
                    variant="contained"
                    size="small"
                    onClick={() => handleSeatClick(seat)}
                    disabled={seat.status === "booked"}
                    sx={{
                      minWidth: 40,
                      height: 40,
                      backgroundColor: getSeatColor(seat),
                      "&:hover": {
                        backgroundColor: seat.status === "booked" ? "#f44336" : "#4caf50",
                      },
                    }}
                  >
                    {seat.number}
                  </Button>
                ))}
              </Box>
            </Box>
          ))}
      </Box>

      {/* Selected Seats Summary */}
      {selectedSeats.length > 0 && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Selected Seats ({selectedSeats.length})
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
            {selectedSeats.map((seat) => (
              <Chip
                key={`${seat.row}-${seat.number}`}
                label={`${seat.row}${seat.number} (${seat.section}) - $${seat.price}`}
                onDelete={() => handleSeatClick(seat)}
              />
            ))}
          </Box>
          <Typography variant="h6">Total: ${getTotalPrice().toFixed(2)}</Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => setBookingDialog(true)}
            sx={{ mt: 2 }}
          >
            Book Selected Seats
          </Button>
        </Paper>
      )}

      {/* Booking Confirmation Dialog */}
      <Dialog open={bookingDialog} onClose={() => setBookingDialog(false)}>
        <DialogTitle>Confirm Booking</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            You are about to book {selectedSeats.length} seat(s) for ${getTotalPrice().toFixed(2)}.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Selected seats: {selectedSeats.map((s) => `${s.row}${s.number}`).join(", ")}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingDialog(false)}>Cancel</Button>
          <Button onClick={handleBooking} variant="contained" disabled={booking}>
            {booking ? <CircularProgress size={20} /> : "Confirm Booking"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default SeatSelection
