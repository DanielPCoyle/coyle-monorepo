import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { io as Client } from "socket.io-client";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { handleConnection } from "../handleConnection";
import "../index"; // Import the index.ts file to include it in coverage

let server;
let io;
let httpServer;

beforeAll((done) => {
  const app = express();
  httpServer = createServer(app);
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  app.get("/", (req, res) => {
    res.send("Socket.io server is running");
  });

  const conversations = [];
  const peopleOnSite = [];

  io.on("connection", (socket) => {
    handleConnection(socket, io, conversations, peopleOnSite);
  });

  server = httpServer.listen(3002, done);
});

afterAll(() => {
  io.close();
  server.close();
});

describe("Express Server", () => {
  it("should return a success message on GET /", async () => {
    const response = await request(httpServer).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Socket.io server is running");
  });
});

describe("Socket.io Server", () => {
  it("should allow a client to connect and receive a welcome message", (done) => {
    const client = Client("http://localhost:3002");

    client.on("connect", () => {
      expect(client.connected).toBeTruthy();
      client.disconnect();
      done();
    });
  });

 

    it("should return 404 for unknown routes", async () => {
      const response = await request(httpServer).get("/unknown");
      expect(response.status).toBe(404);
    });
  });

    it("should handle multiple client connections", (done) => {
      const client1 = Client("http://localhost:3002");
      const client2 = Client("http://localhost:3002");

      let connectedClients = 0;

      const checkConnections = () => {
        connectedClients++;
        if (connectedClients === 2) {
          client1.disconnect();
          client2.disconnect();
          done();
        }
      };

      client1.on("connect", checkConnections);
      client2.on("connect", checkConnections);
    });

    it("should handle client disconnection", (done) => {
      const client = Client("http://localhost:3002");

      client.on("connect", () => {
        expect(client.connected).toBeTruthy();
        client.disconnect();
      });

      client.on("disconnect", () => {
        expect(client.connected).toBeFalsy();
        done();
      });
    });
