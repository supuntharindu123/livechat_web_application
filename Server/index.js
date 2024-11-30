const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Multer = require("multer");
const {
  Register,
  Login,
  SendMessages,
  Getmessages,
  DeleteMessage,
  Editmessage,
  FileSending,
  getDetails,
} = require("./control");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
app.use("/", express.static("files"));
app.use(express.json());
app.use(cors());

mongoose
  .connect(
    "mongodb+srv://supuntharindu123:supun123@cluster0.oqhko.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log(`DB Connected`);
  })
  .catch((error) => {
    console.log(error);
  });

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("send_msg", (data1, data2, data3) => {
    io.emit("receive_msg", data1, data2, data3);
  });

  socket.on("deletemsg", (data1) => {
    io.emit("deleted_msg", data1);
  });

  socket.on("editMessage", (data1, data2) => {
    io.emit("edited_msg", data1, data2);
  });

  socket.on("filesend", (data1, data2, data3) => {
    io.emit("receive_msg", data1, data2, data3);
  });
  // socket.on("disconnect", () => {
  //   console.log("user disconnected");
  // });
});

const storage = Multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./files");
  },
  filename: (req, file, cb) => {
    const uniqueserfex = Date.now();
    cb(null, uniqueserfex + "-" + file.originalname);
  },
});

const upload = Multer({ storage: storage });

app.post("/register", Register);
app.post("/login", Login);
app.post("/message", SendMessages);
app.get("/getmsgs", Getmessages);
app.delete("/deleteMessages/:Id", DeleteMessage);
app.put("/editMessage/:Id", Editmessage);
app.post("/filesend", upload.single("file"), FileSending);
app.get("/details/:Id", getDetails);

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
