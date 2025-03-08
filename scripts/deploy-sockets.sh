#!/bin/bash
yarn pack-db
# Remove the existing chat-sockets folder on the server
ssh -i "philaprints.pem" ubuntu@ec2-44-223-25-160.compute-1.amazonaws.com 'rm -rf /home/ubuntu/chat-sockets'
# Sync the chat-sockets application to the server
rsync -av --progress -e "ssh -i ./philaprints.pem" ./applications/chat-sockets ubuntu@ec2-44-223-25-160.compute-1.amazonaws.com:/home/ubuntu/ --exclude node_modules

# SSH into the server and handle the deployment
ssh -i "philaprints.pem" ubuntu@ec2-44-223-25-160.compute-1.amazonaws.com 'bash ./chat-sockets/deploy.sh'