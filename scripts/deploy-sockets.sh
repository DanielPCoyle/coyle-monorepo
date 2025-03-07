#!/bin/bash

# Sync the chat-sockets application to the server
rsync -av --progress -e "ssh -i ./philaprints.pem" ./applications/chat-sockets ubuntu@ec2-54-224-222-155.compute-1.amazonaws.com:/home/ubuntu/ --exclude node_modules

# SSH into the server and handle the deployment
ssh -i ./philaprints.pem ubuntu@ec2-54-224-222-155.compute-1.amazonaws.com 'bash ./chat-sockets/deploy.sh'