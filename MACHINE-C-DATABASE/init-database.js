// Initialize Dance Competition Database - MongoDB Shell Script
// Run with: mongo < init-database.js

// Declare the db variable
var db

// Switch to the dance competition database
db = db.getSiblingDB("dancecompetitiondb")

// Teams collection
db.teams.insertMany([
  {
    name: "Fire Dancers",
    leader: "John Smith",
    members: ["John Smith", "Jane Doe", "Mike Johnson"],
    category: "Hip Hop",
    registration_date: new Date("2025-01-15T10:00:00"),
    status: "registered",
  },
  {
    name: "Rhythm Masters",
    leader: "Sarah Wilson",
    members: ["Sarah Wilson", "Tom Brown", "Lisa Davis"],
    category: "Contemporary",
    registration_date: new Date("2025-01-16T14:30:00"),
    status: "registered",
  },
  {
    name: "Street Legends",
    leader: "Alex Rodriguez",
    members: ["Alex Rodriguez", "Maria Garcia", "Chris Lee"],
    category: "Street Dance",
    registration_date: new Date("2025-01-17T09:15:00"),
    status: "registered",
  },
])

print("Teams collection created and populated")

// Events/Competitions collection
db.events.insertMany([
  {
    name: "Hip Hop Championship",
    description: "Annual hip hop dance competition",
    event_date: new Date("2025-03-15T18:00:00"),
    venue: "Main Auditorium",
    total_seats: 500,
    available_seats: 500,
    ticket_price: 25.0,
    categories: ["Hip Hop"],
    status: "upcoming",
  },
  {
    name: "Contemporary Dance Festival",
    description: "Showcase of contemporary dance styles",
    event_date: new Date("2025-03-22T19:00:00"),
    venue: "Dance Theater",
    total_seats: 300,
    available_seats: 300,
    ticket_price: 30.0,
    categories: ["Contemporary", "Modern"],
    status: "upcoming",
  },
  {
    name: "Street Dance Battle",
    description: "Ultimate street dance competition",
    event_date: new Date("2025-03-29T20:00:00"),
    venue: "Sports Arena",
    total_seats: 800,
    available_seats: 800,
    ticket_price: 35.0,
    categories: ["Street Dance", "Breaking"],
    status: "upcoming",
  },
])

print("Events collection created and populated")

// Create seats - VIP Section (Rows A-C, 20 seats each = 60 total)
var vipSeats = []
for (var i = 0; i < 3; i++) {
  for (var j = 1; j <= 20; j++) {
    vipSeats.push({
      row: String.fromCharCode(65 + i), // A, B, C
      number: j,
      section: "VIP",
      price_multiplier: 2.0,
      status: "available",
    })
  }
}

// Premium Section (Rows D-H, 25 seats each = 125 total)
var premiumSeats = []
for (var k = 0; k < 5; k++) {
  for (var l = 1; l <= 25; l++) {
    premiumSeats.push({
      row: String.fromCharCode(68 + k), // D, E, F, G, H
      number: l,
      section: "Premium",
      price_multiplier: 1.5,
      status: "available",
    })
  }
}

// General Section (Rows I-T, 30 seats each = 360 total)
var generalSeats = []
for (var m = 0; m < 12; m++) {
  for (var n = 1; n <= 30; n++) {
    generalSeats.push({
      row: String.fromCharCode(73 + m), // I-T
      number: n,
      section: "General",
      price_multiplier: 1.0,
      status: "available",
    })
  }
}

// Insert all seats
db.seats.insertMany(vipSeats.concat(premiumSeats).concat(generalSeats))

print("Seats collection created and populated (545 total seats)")

// Users collection (audience and teams)
db.users.insertMany([
  {
    username: "audience1",
    email: "audience1@example.com",
    password: "password123", // In production, this should be hashed
    role: "audience",
    full_name: "Alice Johnson",
    phone: "+1234567890",
    created_at: new Date(),
  },
  {
    username: "team_leader1",
    email: "leader1@example.com",
    password: "password123",
    role: "team_leader",
    full_name: "John Smith",
    phone: "+1234567891",
    team_id: null, // Will be populated when team registers
    created_at: new Date(),
  },
])

print("Users collection created and populated")

// Create indexes for better performance
db.teams.createIndex({ name: 1 }, { unique: true })
db.events.createIndex({ event_date: 1 })
db.seats.createIndex({ row: 1, number: 1 })
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ username: 1 }, { unique: true })

// Ensure bookings collection exists before creating indexes
db.createCollection("bookings")

db.bookings.createIndex({ user_id: 1, event_id: 1 })
db.bookings.createIndex({ booking_id: 1 }, { unique: true })

print("Database indexes created")
print("Database initialized successfully!")
print("Collections created: teams, events, seats, users, bookings")
print("Sample data inserted for testing")
print("Total seats created: 545 (60 VIP + 125 Premium + 360 General)")
