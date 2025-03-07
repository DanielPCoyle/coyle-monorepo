#!/bin/bash

cd chat-sockets/
sudo docker build -t chat-sockets .
# sudo docker run --name chat-sockets -d chat-sockets
sudo docker restart chat-sockets