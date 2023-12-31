const express = require("express");
const connectDb = require("./database");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const notFound = require("./middlewares/notFoundHandler");
const errorHandler = require("./middlewares/errorHandler");
const userRoutes = require("./api/user/routes");
const chatRoutes = require("./api/chat/routes");
const placeRoutes = require("./api/place/routes");
const moodRoutes = require("./api/mood/routes");
const amenityRoutes = require("./api/amenity/routes");
const meetUpRoutes = require("./api/meetUp/routes");

const config = require("./config/keys");
const passport = require("passport");
const { localStrategy, jwtStrategy } = require("./middlewares/passport");
const path = require("path");
//
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: { origin: "*" },
});
//
app.use(cors());
connectDb();
app.use(express.json());
app.use(morgan("dev"));

app.use(passport.initialize());
passport.use("local", localStrategy);
passport.use(jwtStrategy);

app.use("/media", express.static(path.join(__dirname, "media")));
app.use("/auth", userRoutes);
app.use("/chat", chatRoutes);
app.use("/place", placeRoutes);
app.use("/mood", moodRoutes);
app.use("/amenity", amenityRoutes);
app.use("/meet-up", meetUpRoutes);

app.use(notFound);
app.use(errorHandler);

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("chat", (data) => {
    socket.broadcast.emit("recieve", data);
  });

  socket.on("joinPublicChat", (chatId) => {
    socket.join(chatId);
  });

  socket.on("publicChatSend", (data) => {
    io.to(data.chatId).emit("publicChatReceive", data);
  });
});

server.listen(config.PORT, () => {
  console.log(`The application is running on ${config.PORT}`);
});
