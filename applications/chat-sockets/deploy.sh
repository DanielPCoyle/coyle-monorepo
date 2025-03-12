#!/bin/bash

cd chat-sockets/
sudo docker build -t chat-sockets .

# Stop and remove the old container
sudo docker stop chat-sockets
sudo docker run --name chat-sockets-new -d -p 3000:3000 chat-sockets
# Rename the new container to the original name
sudo docker rm chat-sockets
sudo docker rename chat-sockets-new chat-sockets

# Restart Nginx to apply changes
echo "Restarting Nginx"
sudo systemctl restart nginx

# Remove any unused Docker images
sudo docker image prune -f
echo "Deployment complete"