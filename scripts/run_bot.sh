#!/bin/bash


# Step 1: Run Docker Compose
echo "Starting Docker containers..."
docker-compose up -d  # The '-d' flag will run it in detached mode

# Step 2: Run the Vault script
echo "Running Vault script..."
./init_vault.sh

# Step 3: Run the frontend development server
echo "Starting frontend development server..."
cd ../
cd packages/frontend
pnpm run dev &  # The '&' will run it in the background
cd ../

# Step 4: Run the backend development server
echo "Starting backend development server..."
cd api-server
pnpm run start:dev &  # The '&' will run it in the background

# Keep the script running
wait
