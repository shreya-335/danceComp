# Machine C - Database Setup (MongoDB)
IP: 192.168.1.30

## Installation Steps

### 1. Install MongoDB
\`\`\`bash
sudo apt update
sudo apt install -y mongodb
sudo systemctl enable mongodb
sudo systemctl start mongodb
\`\`\`

### 2. Configure Remote Access
Edit MongoDB config:
\`\`\`bash
sudo nano /etc/mongodb.conf
\`\`\`

Change bindIp to:
\`\`\`
bindIp: 0.0.0.0
\`\`\`

Restart MongoDB:
\`\`\`bash
sudo systemctl restart mongodb
\`\`\`

### 3. Configure Firewall
\`\`\`bash
sudo ufw allow from 192.168.1.20 to any port 27017
sudo ufw enable
\`\`\`

### 4. Initialize Database
\`\`\`bash
mongo < init-database.js
\`\`\`

## File Structure
\`\`\`
MACHINE-C-DATABASE/
├── README.md
├── init-database.js
├── backup-script.sh
└── mongodb.conf
