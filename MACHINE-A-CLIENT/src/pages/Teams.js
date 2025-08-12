"use client"

import { useState, useEffect } from "react"
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material"
import { useAuth } from "../context/AuthContext"
import api from "../config/api"

const Teams = () => {
  const { user } = useAuth()
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [registerDialog, setRegisterDialog] = useState(false)
  const [registering, setRegistering] = useState(false)
  const [teamForm, setTeamForm] = useState({
    name: "",
    members: [{ name: "", role: "member" }],
    category: "",
    description: "",
    contact_email: "",
    contact_phone: "",
  })

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      const response = await api.get("/teams")
      setTeams(response.data)
    } catch (error) {
      setError("Failed to load teams")
      console.error("Failed to fetch teams:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFormChange = (e) => {
    setTeamForm({
      ...teamForm,
      [e.target.name]: e.target.value,
    })
  }

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...teamForm.members]
    newMembers[index][field] = value
    setTeamForm({
      ...teamForm,
      members: newMembers,
    })
  }

  const addMember = () => {
    setTeamForm({
      ...teamForm,
      members: [...teamForm.members, { name: "", role: "member" }],
    })
  }

  const removeMember = (index) => {
    if (teamForm.members.length > 1) {
      const newMembers = teamForm.members.filter((_, i) => i !== index)
      setTeamForm({
        ...teamForm,
        members: newMembers,
      })
    }
  }

  const handleTeamRegistration = async () => {
    setError("")
    setRegistering(true)

    try {
      const response = await api.post("/teams/register", teamForm)
      setRegisterDialog(false)
      setTeamForm({
        name: "",
        members: [{ name: "", role: "member" }],
        category: "",
        description: "",
        contact_email: "",
        contact_phone: "",
      })
      fetchTeams() // Refresh teams list
      alert("Team registered successfully!")
    } catch (error) {
      setError(error.response?.data?.error || "Team registration failed")
    } finally {
      setRegistering(false)
    }
  }

  const categories = ["Hip Hop", "Contemporary", "Street Dance", "Breaking", "Jazz", "Ballet", "Modern"]

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Dance Teams
        </Typography>

        {user && user.role === "team_leader" && (
          <Button variant="contained" color="primary" onClick={() => setRegisterDialog(true)}>
            Register Team
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {teams.map((team) => (
          <Grid item xs={12} md={6} lg={4} key={team._id}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  {team.name}
                </Typography>

                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Leader: {team.leader}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Chip label={team.category} color="primary" size="small" sx={{ mr: 1 }} />
                  <Chip label={team.status} color={team.status === "approved" ? "success" : "default"} size="small" />
                </Box>

                {team.description && (
                  <Typography variant="body2" paragraph>
                    {team.description}
                  </Typography>
                )}

                <Typography variant="body2" gutterBottom>
                  <strong>Members ({team.members.length}):</strong>
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {team.members.slice(0, 3).map((member, index) => (
                    <Typography key={index} variant="body2" color="textSecondary">
                      • {member.name}
                    </Typography>
                  ))}
                  {team.members.length > 3 && (
                    <Typography variant="body2" color="textSecondary">
                      ... and {team.members.length - 3} more
                    </Typography>
                  )}
                </Box>

                <Typography variant="body2" color="textSecondary">
                  Registered: {new Date(team.registration_date).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {teams.length === 0 && (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          No teams registered yet.
        </Typography>
      )}

      {/* Team Registration Dialog */}
      <Dialog open={registerDialog} onClose={() => setRegisterDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Register Your Dance Team</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Team Name"
            fullWidth
            variant="outlined"
            value={teamForm.name}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select name="category" value={teamForm.category} label="Category" onChange={handleFormChange}>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            margin="dense"
            name="description"
            label="Team Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={teamForm.description}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            name="contact_email"
            label="Contact Email"
            type="email"
            fullWidth
            variant="outlined"
            value={teamForm.contact_email}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            name="contact_phone"
            label="Contact Phone"
            fullWidth
            variant="outlined"
            value={teamForm.contact_phone}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          />

          <Typography variant="h6" gutterBottom>
            Team Members
          </Typography>

          {teamForm.members.map((member, index) => (
            <Box key={index} sx={{ display: "flex", gap: 1, mb: 1 }}>
              <TextField
                label="Member Name"
                variant="outlined"
                size="small"
                value={member.name}
                onChange={(e) => handleMemberChange(index, "name", e.target.value)}
                sx={{ flexGrow: 1 }}
              />
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Role</InputLabel>
                <Select
                  value={member.role}
                  label="Role"
                  onChange={(e) => handleMemberChange(index, "role", e.target.value)}
                >
                  <MenuItem value="member">Member</MenuItem>
                  <MenuItem value="choreographer">Choreographer</MenuItem>
                  <MenuItem value="captain">Captain</MenuItem>
                </Select>
              </FormControl>
              {teamForm.members.length > 1 && (
                <Button variant="outlined" color="error" size="small" onClick={() => removeMember(index)}>
                  Remove
                </Button>
              )}
            </Box>
          ))}

          <Button variant="outlined" onClick={addMember} sx={{ mt: 1 }}>
            Add Member
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRegisterDialog(false)}>Cancel</Button>
          <Button
            onClick={handleTeamRegistration}
            variant="contained"
            disabled={registering || !teamForm.name || !teamForm.category}
          >
            {registering ? <CircularProgress size={20} /> : "Register Team"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Teams
