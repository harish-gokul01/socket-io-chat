const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require('cors')
const io = require("socket.io")(server, { cors: { origin: "*" } });
const bodyParser = require("body-parser");
const { Rooms, Users } = require("./chat");

const port = process.env.PORT || 3000;

const userHandler = new Users();
const roomHandler = new Rooms();

app.use(cors())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());

app.get("/", function (_, res) {
  res.json({ message: "Hello Mbappe" });
});

app.post("/createRoom", function (req, res) {
  const { roomName } = req.body;
  roomHandler.createRoom(roomName);
  res.status(200).json({ 
    message: `Created room ${roomName}`,
    rooms: roomHandler.rooms
  });
});

app.post("/createUser", function (req, res) {
  const { userName } = req.body;
  userHandler.createUser(userName);
  res.status(200).json({ 
    message: `Created User ${userName}`,
    users: userHandler.users
  });
});

io.on("connection", (socket) => {
  
  socket.on("test",(eventBody)=>{
    console.log(eventBody)
  })

  socket.on("create-user",(eventBody)=>{
    const { userName } = eventBody;
    userHandler.createUser(userName);
    io.emit("listen-create-user",{users: userHandler.users})
  })

  socket.on("create-room",(eventBody)=>{
    const { roomName } = eventBody;
    roomHandler.createRoom(roomName);
    io.emit("listen-create-room",{rooms: roomHandler.rooms})
  })

  socket.on("join-server",(eventBody)=>{
    const { userName } = eventBody
    userHandler.addSessionId(userName,socket.id);
    console.log(`Joined Server ${userName}`)
  })

  socket.on("join-room", (eventBody, callback) => {
    const { roomName, userName } = eventBody;
    socket.join(roomName);
    io.to(roomName).emit("user-joined", {
      message: `${userName} has Joined ${roomName}`,
    });
  });

  socket.on("send-message",(eventBody)=>{
    const { to , userName , payload , type } = eventBody;
    let reciever = to
    if(type === "non_channel"){
        reciever = userHandler.getUser(to)
        reciever = reciever?.socketId
    }
    const messagePayload = {
        message: payload,
        sender:userName,
        sentAt: new Date()
    }
    io.to(to).emit("listen-room",messagePayload)
  })

});

server.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

