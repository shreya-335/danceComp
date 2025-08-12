#!/bin/bash
# Database backup script

BACKUP_DIR="/home/ubuntu/db-backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Create backup
mongodump --db dancecompetitiondb --out $BACKUP_DIR/backup_$DATE

# Keep only last 7 days of backups
find $BACKUP_DIR -type d -name "backup_*" -mtime +7 -exec rm -rf {} \;

echo "Backup completed: $BACKUP_DIR/backup_$DATE"
