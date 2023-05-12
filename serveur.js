const express = require("express");
const cors = require("cors");
const http = require("http");
const jwt = require("jsonwebtoken");
const socketIO = require("socket.io");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
  },
});

const users = [];
const rooms = [];

app.post("/login", (req, res) => {
  const { username } = req.body;
  const token = jwt.sign({ username }, "secret_key");
  res.json({ token });
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("join-room", ({ room, token }) => {
    try {
      const decoded = jwt.verify(token, "secret_key");
      const { username } = decoded;

      socket.join(room);

      const user = {
        id: socket.id,
        username,
        room,
      };

      users.push(user);

      socket.emit("message", {
        id: uuidv4(),
        text: "Welcome to the chat room!",
        username: "Admin",
        createdAt: new Date(),
      });

      socket.broadcast.to(room).emit("message", {
        id: uuidv4(),
        text: `${username} has joined the chat`,
        username: "Admin",
        createdAt: new Date(),
      });

      const roomIndex = rooms.findIndex((r) => r.name === room);
      if (roomIndex === -1) {
        rooms.push({
          name: room,
          users: [user],
        });
      } else {
        rooms[roomIndex].users.push(user);
      }

      io.to(room).emit("room-data", {
        room,
        users: rooms[roomIndex].users,
      });
    } catch (error) {
      console.error(error);
      socket.emit("error", "Invalid token");
    }
  });

  socket.on("send-message", ({ room, token, message }) => {
    try {
      const decoded = jwt.verify(token, "secret_key");
      const { username } = decoded;

      io.to(room).emit("message", {
        id: uuidv4(),
        text: message,
        username,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error(error);
      socket.emit("error", "Invalid token");
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");

    const userIndex = users.findIndex((u) => u.id === socket.id);

    if (userIndex !== -1) {
      const { room, username } = users[userIndex];
      users.splice(userIndex, 1);

      const roomIndex = rooms.findIndex((r) => r.name === room);
      if (roomIndex !== -1) {
        const userIndexInRoom = rooms[roomIndex].users.findIndex(
          (u) => u.id === socket.id
        );
        if (userIndexInRoom !== -1) {
          rooms[roomIndex].users.splice(userIndexInRoom, 1);

          io.to(room).emit("room-data", {
            room,
            users: rooms[roomIndex].users,
          });

          io.to(room).emit("message", {
            id: uuidv4(),
            text: `${username} has left the chat`,
            username: "Admin",
            createdAt: new Date(),
          });
        }
      }
    }
  });
});

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
