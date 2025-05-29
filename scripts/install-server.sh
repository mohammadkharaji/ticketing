#!/bin/bash

# Update and upgrade the system
sudo apt update && sudo apt upgrade -y

# Install necessary packages
sudo apt install -y curl git mysql-server

# Update Node.js to version 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Set up MySQL
sudo systemctl start mysql
sudo systemctl enable mysql

# Secure MySQL installation
sudo mysql_secure_installation

# Create a database and user for the project
DB_NAME="ticketing_db"
DB_USER="ticketing_user"
DB_PASSWORD="securepassword"

# Check if database exists and drop it if necessary
DB_EXISTS=$(sudo mysql -e "SHOW DATABASES LIKE '$DB_NAME';" | grep "$DB_NAME")
if [ "$DB_EXISTS" ]; then
  sudo mysql -e "DROP DATABASE $DB_NAME;"
fi

# Create database and user
sudo mysql -e "CREATE DATABASE $DB_NAME;"
sudo mysql -e "CREATE USER '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';"
sudo mysql -e "GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

# Remove existing project directory if it exists
if [ -d "$PROJECT_DIR" ]; then
  sudo rm -rf "$PROJECT_DIR"
fi

# Clone the project repository
PROJECT_DIR="/root/ticketing"
sudo git clone git@github.com:mohammadkharaji/ticketing.git $PROJECT_DIR

# Navigate to the project directory
cd $PROJECT_DIR

# Install project dependencies
sudo npm install

# Set up environment variables
cat <<EOL | sudo tee .env.local
DB_HOST=localhost
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_NAME=$DB_NAME
EOL

# Build the project
sudo npm run build

# Start the project automatically in the background
sudo npm start &

# Print completion message
echo "Installation complete. The project is running in the background."
