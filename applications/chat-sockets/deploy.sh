#!/bin/bash

cd chat-sockets/
sudo docker stop chat-sockets && sudo docker rm chat-sockets
sudo docker build -t chat-sockets .
sudo docker run --name chat-sockets -d -p 3000:3000 chat-sockets
sudo docker restart chat-sockets
sudo docker logs chat-sockets
echo "Restarting Nginx"
sudo systemctl restart nginx
echo "Deployment complete"