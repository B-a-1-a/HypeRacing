#!/bin/bash

# Ensure the script exits on any error
set -e

echo "Starting F1 Dash deployment..."

# Install Rust if not already installed
if ! command -v cargo &> /dev/null; then
    echo "Installing Rust..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source $HOME/.cargo/env
fi

# Build the Rust backends
echo "Building Rust backends..."
cd /root/HypeRacing
source $HOME/.cargo/env
cargo build --release -p live -p api

# Install the systemd service files
echo "Installing service files..."
cp f1-dash-live.service /etc/systemd/system/
cp f1-dash-api.service /etc/systemd/system/
cp f1-dash-frontend.service /etc/systemd/system/

# Install and configure Nginx
echo "Setting up Nginx..."
apt update
apt install -y nginx
cp f1-dash-nginx /etc/nginx/sites-available/f1-dash
ln -sf /etc/nginx/sites-available/f1-dash /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
systemctl restart nginx

# Enable and start the services
echo "Starting services..."
systemctl daemon-reload
systemctl enable f1-dash-live f1-dash-api f1-dash-frontend
systemctl start f1-dash-live f1-dash-api f1-dash-frontend

echo "Deployment complete! Your F1 Dashboard should be accessible at http://104.248.237.41"
echo "Check service status with: systemctl status f1-dash-live f1-dash-api f1-dash-frontend"
