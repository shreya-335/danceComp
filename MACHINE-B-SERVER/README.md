# Machine B - Server Setup (Node.js Backend)
IP: 192.168.1.20

## Installation Steps

### 1. Install Node.js and npm
\`\`\`bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
\`\`\`

### 2. Setup Project
\`\`\`bash
mkdir dance-competition-server
cd dance-competition-server
npm init -y
npm install express mongoose cors dotenv bcryptjs jsonwebtoken uuid multer
\`\`\`

### 3. Configure Environment
Copy the .env file and update the MongoDB IP if needed.

### 4. Start Server
\`\`\`bash
npm start
\`\`\`

The server will run on port 3000 and accept connections from all interfaces.

## File Structure
\`\`\`
MACHINE-B-SERVER/
├── README.md
├── package.json
├── .env
├── server.js
├── models/
│   ├── User.js
│   ├── Team.js
│   ├── Event.js
│   ├── Seat.js
│   └── Booking.js
├── routes/
│   ├── auth.js
│   ├── teams.js
│   ├── events.js
│   ├── seats.js
│   └── bookings.js
├── middleware/
│   └── auth.js
└── uploads/
