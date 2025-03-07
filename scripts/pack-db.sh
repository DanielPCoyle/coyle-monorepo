#!/bin/bash

# Define directories
DATABASE_DIR="packages/database"
DEST_DIR="applications/chat-sockets"

# Navigate to the database package directory
cd "$DATABASE_DIR" || { echo "Failed to navigate to $DATABASE_DIR"; exit 1; }

# Run yarn pack
yarn pack || { echo "yarn pack failed"; exit 1; }

# Find the generated .tgz file
TGZ_FILE=$(ls -t *.tgz | head -n 1)

# Check if the file exists
if [ -z "$TGZ_FILE" ]; then
  echo "No .tgz file found. Exiting."
  exit 1
fi

# Move the .tgz file to the destination directory
mv "$TGZ_FILE" "../../$DEST_DIR/" || { echo "Failed to move .tgz file"; exit 1; }

# Print success message
echo "Successfully moved $TGZ_FILE to $DEST_DIR"
