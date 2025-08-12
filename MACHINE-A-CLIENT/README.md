# Machine A - Client Setup (React.js Frontend)
IP: 192.168.1.10

## Installation Steps

### 1. Install Node.js and npm
\`\`\`bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
\`\`\`

### 2. Create React App
\`\`\`bash
npx create-react-app dance-competition-client
cd dance-competition-client
npm install axios react-router-dom @mui/material @emotion/react @emotion/styled
\`\`\`

### 3. Replace src folder with provided files

### 4. Update API Configuration
Edit src/config/api.js and update the server IP if needed.

### 5. Start Development Server
\`\`\`bash
npm start
\`\`\`

The app will run on http://192.168.1.10:3000

## File Structure
\`\`\`
MACHINE-A-CLIENT/
├── README.md
├── package.json
├── public/
│   ├── index.html
│   └── favicon.ico
└── src/
    ├── index.js
    ├── App.js
    ├── config/
    │   └── api.js
    ├── components/
    │   ├── Layout/
    │   ├── Auth/
    │   ├── Events/
    │   ├── Seats/
    │   ├── Teams/
    │   └── Bookings/
    ├── pages/
    │   ├── Home.js
    │   ├── Login.js
    │   ├── Register.js
    │   ├── Events.js
    │   ├── SeatSelection.js
    │   ├── Teams.js
    │   └── Profile.js
    ├── context/
    │   └── AuthContext.js
    └── utils/
        └── auth.js
