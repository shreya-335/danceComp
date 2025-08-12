"use client"

import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material"
import { useAuth } from "../context/AuthContext"
import api from "../config/api"

const Profile = () => {
  const { user } = useAuth()
  const location = useLocation()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message)
    }
    fetchBookings()
  }, [location])

  const fetchBookings = async () => {
    try {
      const response = await api.get("/bookings/my-bookings")
      setBookings(response.data)
    } catch (error) {
      setError("Failed to load bookings")
      console.error("Failed to fetch bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "success"
      case "pending":
        return "warning"
      case "cancelled":
        return "error"
      default:
        return "default"
    }
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "success"
      case "pending":
        return "warning"
      case "refunded":
        return "info"
      default:
        return "default"
    }
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        My Profile
      </Typography>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage("")}>
          {successMessage}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* User Information */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              User Information
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Full Name
              </Typography>
              <Typography variant="body1">{user?.full_name}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Username
              </Typography>
              <Typography variant="body1">{user?.username}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Email
              </Typography>
              <Typography variant="body1">{user?.email}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Role
              </Typography>
              <Chip label={user?.role?.replace("_", " ").toUpperCase()} color="primary" size="small" />
            </Box>
            {user?.team_id && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Team
                </Typography>
                <Typography variant="body1">Team Leader</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Bookings */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              My Bookings
            </Typography>

            {loading ? (
              <Box display="flex" justifyContent="center" mt={2}>
                <CircularProgress />
              </Box>
            ) : bookings.length === 0 ? (
              <Typography variant="body1" color="textSecondary" align="center" sx={{ mt: 4 }}>
                No bookings found. Book your first event!
              </Typography>
            ) : (
              <Box>
                {bookings.map((booking) => (
                  <Card key={booking._id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                        <Typography variant="h6">{booking.event_id?.name}</Typography>
                        <Box>
                          <Chip
                            label={booking.booking_status}
                            color={getStatusColor(booking.booking_status)}
                            size="small"
                            sx={{ mr: 1 }}
                          />
                          <Chip
                            label={`Payment: ${booking.payment_status}`}
                            color={getPaymentStatusColor(booking.payment_status)}
                            size="small"
                          />
                        </Box>
                      </Box>

                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Booking ID: {booking.booking_id}
                      </Typography>

                      <Typography variant="body2" gutterBottom>
                        <strong>Event Date:</strong> {formatDate(booking.event_id?.event_date)}
                      </Typography>

                      <Typography variant="body2" gutterBottom>
                        <strong>Venue:</strong> {booking.event_id?.venue}
                      </Typography>

                      <Typography variant="body2" gutterBottom>
                        <strong>Seats ({booking.seats.length}):</strong>{" "}
                        {booking.seats.map((seat) => `${seat.row}${seat.number}`).join(", ")}
                      </Typography>

                      <Divider sx={{ my: 1 }} />

                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" color="textSecondary">
                          Booked on: {formatDate(booking.created_at)}
                        </Typography>
                        <Typography variant="h6" color="primary">
                          Total: ${booking.total_amount.toFixed(2)}
                        </Typography>
                      </Box>

                      {booking.seats.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2" gutterBottom>
                            <strong>Seat Details:</strong>
                          </Typography>
                          {booking.seats.map((seat, index) => (
                            <Typography key={index} variant="body2" color="textSecondary">
                              • Row {seat.row}, Seat {seat.number} ({seat.section}) - ${seat.price}
                            </Typography>
                          ))}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Profile
