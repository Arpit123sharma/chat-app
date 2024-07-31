import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "node:http";
import { Server as SocketIOServer } from "socket.io";

const app = express(); // express server
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middlewares configuration
const allowedOrigins = ["http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());

// Importing routes
import userRouter from "./Routes/user.route.js";
import searchRouter from "./Routes/Search/searching.route.js";
import requestRoute from "./Routes/friends/request.route.js";
import friendsRoute from "./Routes/friends/friend.routes.js";
import wsRoute from "./Routes/messageRoutes/request.route.js";
import fileMessageRoute from "./Routes/messageRoutes/chat.route.js";
import { textMessageHandlerForGroup, textMessageHandlerForIndi } from "./Controllers/messageController/chat.controller.js";

// Routing declaration
app.use("/chat-app/api/v1/user", userRouter); // to manage user
app.use("/chat-app/api/v1/SearchFriends", searchRouter); // searching for friends
app.use("/chat-app/api/v1/requests", requestRoute); // route for sending friend request and cancelling, acceptance
app.use("/chat-app/api/v1/Home", friendsRoute); // fetching friend list using this route
app.use("/chat-app/api/v1/ws", wsRoute); // to take the port to connect with ws server
app.use("/chat-app/api/v1/ws-message", fileMessageRoute);

// Store the users in the map who are online
const onlineUsersList = new Map();

// Socket.IO server
io.on("connection", (socket) => {
  // Parsing userId from the query parameters
  const userID = socket.handshake.query.id?.trim();

  if (userID) {
    onlineUsersList.set(userID, socket);
    console.log(`User with ID: ${userID} is successfully connected to the Socket.IO server!`);

    socket.on("message", (data) => {
      console.log(`Received a message from ${userID}, message is ${data}`);
      socket.emit("response", {
        type: "A-S",
        status: true,
      });

      let parseData;
      try {
        parseData = JSON.parse(data);
      } catch (error) {
        console.log("Error during parsing data into JSON: ", error);
      }

      if (parseData.receiver === "individual") {
        // message-handler-individual-user
        const [senderFriendList, receiverFriendList] = textMessageHandlerForIndi(socket, parseData, onlineUsersList);

        if (onlineUsersList.has(parseData.from)) {
          socket.emit("message", senderFriendList);
        }
        if (onlineUsersList.has(parseData.to)) {
          const socketReceiver = onlineUsersList.get(parseData.to);
          socketReceiver.emit("message", receiverFriendList);
        }
      } else if (parseData.receiver === "group") {
        // message-handler-individual-group
        textMessageHandlerForGroup(socket, parseData, onlineUsersList);
      }
    });

    socket.on("disconnect", () => {
      onlineUsersList.delete(userID);
      console.log(`User disconnected from the server with ID: ${userID}`);
    });
  } else {
    socket.disconnect(true);
    console.log("UserID is required to connect to the server");
  }
});

export { app, server };
