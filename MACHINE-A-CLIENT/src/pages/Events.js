"use client"

import { useState, useEffect } from "react"
import { Typography, Grid, Card, CardContent, Button, Box, Chip } from "@mui/material"
import { Link } from "react-router-dom"
import api from "../config/api"

const Events = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await api.get("/events")
      setEvents(response.data)
    } catch (error) {
      console.error("Failed to fetch events:", error)
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

  if (loading) {
    return <Typography>Loading events...</Typography>
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dance Competition Events
      </Typography>

      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} md={6} lg={4} key={event._id}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  {event.name}
                </Typography>

                <Typography variant="body2" color="textSecondary" paragraph>
                  {event.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Date:</strong> {formatDate(event.event_date)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Venue:</strong> {event.venue}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Price:</strong> ${event.ticket_price}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Available Seats:</strong> {event.available_seats}/{event.total_seats}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  {event.categories.map((category, index) => (
                    <Chip key={index} label={category} size="small" sx={{ mr: 1, mb: 1 }} />
                  ))}
                </Box>

                <Button
                  variant="contained"
                  component={Link}
                  to={`/events/${event._id}/seats`}
                  disabled={event.available_seats === 0}
                  fullWidth
                >
                  {event.available_seats === 0 ? "Sold Out" : "Book Seats"}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {events.length === 0 && (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          No events available at the moment.
        </Typography>
      )}
    </Box>
  )
}

export default Events
