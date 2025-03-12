#!/bin/bash
yarn pack-db

cp ./applications/chat-sockets/package.json ./applications/chat-sockets/production.package.json
sed -i '' 's/"@coyle\/database": "\*"/"@coyle\/database": "file:coyle-database-v1.0.0.tgz"/' ./applications/chat-sockets/production.package.json

# Remove the existing chat-sockets folder on the server
ssh -i "philaprints.pem" ubuntu@ec2-44-223-25-160.compute-1.amazonaws.com 'rm -rf /home/ubuntu/chat-sockets'
# Sync the chat-sockets application to the server
rsync -av --progress -e "ssh -i ./philaprints.pem" ./applications/chat-sockets ubuntu@ec2-44-223-25-160.compute-1.amazonaws.com:/home/ubuntu/ --exclude node_modules

rm ./applications/chat-sockets/production.package.json
# SSH into the server and handle the deployment
ssh -i "philaprints.pem" ubuntu@ec2-44-223-25-160.compute-1.amazonaws.com 'bash ./chat-sockets/deploy.sh'
ssh -i "philaprints.pem" ubuntu@ec2-44-223-25-160.compute-1.amazonaws.com 'rm -rf /home/ubuntu/chat-sockets'
