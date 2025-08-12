import { Typography, Box, Grid, Card, CardContent, Button } from "@mui/material"
import { Link } from "react-router-dom"

const Home = () => {
  return (
    <Box>
      <Typography variant="h2" component="h1" gutterBottom align="center">
        Welcome to Dance Competition
      </Typography>

      <Typography variant="h5" component="h2" gutterBottom align="center" color="textSecondary">
        Experience the ultimate dance competition platform
      </Typography>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h3" gutterBottom>
                Watch Competitions
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Book your seats and enjoy amazing dance performances from talented teams.
              </Typography>
              <Button variant="contained" component={Link} to="/events" sx={{ mt: 2 }}>
                View Events
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h3" gutterBottom>
                Join as Team
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Register your dance team and participate in exciting competitions.
              </Typography>
              <Button variant="contained" component={Link} to="/teams" sx={{ mt: 2 }}>
                View Teams
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h3" gutterBottom>
                Easy Booking
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Simple seat selection and booking process for all events.
              </Typography>
              <Button variant="contained" component={Link} to="/register" sx={{ mt: 2 }}>
                Get Started
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Home
