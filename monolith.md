# Managing Your F1 Dashboard Services

## Starting and Stopping Services

### Start Services
```bash
# Start all services
sudo systemctl start f1-dash-live f1-dash-api f1-dash-frontend

# Start individual services
sudo systemctl start f1-dash-live      # Start live backend
sudo systemctl start f1-dash-api       # Start API backend
sudo systemctl start f1-dash-frontend  # Start frontend
```

### Stop Services
```bash
# Stop all services
sudo systemctl stop f1-dash-live f1-dash-api f1-dash-frontend

# Stop individual services
sudo systemctl stop f1-dash-live       # Stop live backend
sudo systemctl stop f1-dash-api        # Stop API backend
sudo systemctl stop f1-dash-frontend   # Stop frontend
```

### Restart Services
```bash
# Restart all services
sudo systemctl restart f1-dash-live f1-dash-api f1-dash-frontend

# Restart individual services
sudo systemctl restart f1-dash-live      # Restart live backend
sudo systemctl restart f1-dash-api       # Restart API backend
sudo systemctl restart f1-dash-frontend  # Restart frontend
```

## Verifying Services Are Built and Running

### Check If Services Are Built

#### Backend
```bash
# Check if backend binaries exist
ls -la /root/HypeRacing/target/release/live
ls -la /root/HypeRacing/target/release/api

# If you see files with execution permissions, they are built
```

#### Frontend
```bash
# Check if Next.js has built files
ls -la /root/HypeRacing/dash/.next

# If the .next directory exists and contains files, the frontend is built
```

### Check If Services Are Running

#### Check Service Status
```bash
# Check status of all services
sudo systemctl status f1-dash-live f1-dash-api f1-dash-frontend

# Check status of individual services
sudo systemctl status f1-dash-live      # Live backend status
sudo systemctl status f1-dash-api       # API backend status
sudo systemctl status f1-dash-frontend  # Frontend status

# Look for "Active: active (running)" in the output
```

#### Check Listening Ports
```bash
# Install net-tools if not already installed
sudo apt install net-tools

# Check what's listening on your service ports
sudo netstat -tulpn | grep -E ':(3000|4000|4001)'

# You should see processes listening on ports:
# - 3000 (frontend)
# - 4000 (live backend)
# - 4001 (API backend)
```

#### Check Service Logs
```bash
# View recent logs
sudo journalctl -u f1-dash-live --since "10 minutes ago"
sudo journalctl -u f1-dash-api --since "10 minutes ago"
sudo journalctl -u f1-dash-frontend --since "10 minutes ago"

# Follow logs in real-time
sudo journalctl -u f1-dash-live -f
sudo journalctl -u f1-dash-api -f
sudo journalctl -u f1-dash-frontend -f
```

#### Test Service Responses
```bash
# Test if services respond
curl -v http://localhost:3000  # Should return HTML from frontend
curl -v http://localhost:4000  # Live backend
curl -v http://localhost:4001  # API backend
```

#### Check Web Access
```bash
# Test if your site is accessible through Nginx
curl -v http://104.248.237.41
```

## Rebuilding Services When Needed

### Rebuild Backend
```bash
cd /root/HypeRacing
source $HOME/.cargo/env
cargo build --release -p live -p api
sudo systemctl restart f1-dash-live f1-dash-api
```

### Rebuild Frontend
```bash
cd /root/HypeRacing/dash
rm -rf .next   # Clean previous build
npm run build
sudo systemctl restart f1-dash-frontend
```

By using these commands, you can effectively manage, verify, and troubleshoot your F1 Dashboard deployment.

