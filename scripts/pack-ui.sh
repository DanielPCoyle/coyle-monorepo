#!/bin/bash
# Define directories
CHAT_UI_DIR="packages/chat-ui"
DEST_DIR="applications/web/public"

# Remove DEST_DIR/base if it exists
if [ -d "$DEST_DIR/build" ]; then
    rm -rf "$DEST_DIR/build" || { echo "Failed to remove $DEST_DIR/build"; exit 1; }
fi

# Navigate to the chat-ui package directory
cd "$CHAT_UI_DIR" || { echo "Failed to navigate to $CHAT_UI_DIR"; exit 1; }

# Run yarn build
yarn build || { echo "yarn build failed"; exit 1; }

# Check if the build directory exists
if [ ! -d "build" ]; then
    echo "Build directory not found. Exiting."
    exit 1
fi

# Move the build directory to the destination

mv build/static/js/main*.js build/static/js/main.js
mv build/static/css/main*.css build/static/css/main.css

mv "build" "../../$DEST_DIR" || { echo "Failed to move build directory"; exit 1; }

# Print success message
echo "Successfully moved build directory to $DEST_DIR"