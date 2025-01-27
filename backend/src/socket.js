import {Server} from "socket.io"
import http from "http"
import express, { query } from "express"

const app = express();
const server = http.createServer(app)



const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
    },
})

export function getRecieverSocketId(userId) {
    return usersocketMap[userId];
}

const usersocketMap = {}; // Maps userId to socket.id

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Retrieve userId from the handshake query
  const userId = socket.handshake.query.userId;

  if (userId) {
    // Map userId to the current socket.id
    usersocketMap[userId] = socket.id;

    console.log("User logged in:", userId);
  } else {
    console.warn("User connected without a userId:", socket.id);
  }

  // Emit the list of online users to all clients
  io.emit("getOnlineUsers", Object.keys(usersocketMap));

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);

    // Find and remove the disconnected userId from the map
    const disconnectedUserId = Object.keys(usersocketMap).find(
      (key) => usersocketMap[key] === socket.id
    );

    if (disconnectedUserId) {
      delete usersocketMap[disconnectedUserId];
      console.log("User logged out:", disconnectedUserId);
    }

    // Emit the updated list of online users
    io.emit("getOnlineUsers", Object.keys(usersocketMap));
  });
});


export {io, app, server}