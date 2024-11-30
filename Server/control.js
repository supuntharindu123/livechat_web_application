const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const Multer = require("multer");

const app = express();
const Users = require("./models/users");
const Message = require("./models/Chat");
const multer = require("multer");

const Register = async (req, res) => {
  try {
    const { username, phonenumber, email, password } = req.body;
    if (!username || !email || !password || !phonenumber) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const existsUser = await Users.findOne({ email });
    if (existsUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Users({
      username,
      phonenumber,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(200).send("Registration is successful");
    console.log("hello");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ message: "Please fill all the fields" });
    }

    const user = await Users.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .send({ message: "Email or password is incorrect" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .send({ message: "Email or password is incorrect" });
    }

    const payload = {
      userId: user._id,
      email: user.email,
    };

    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "YOUR_SECRET_KEY";
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "24h" });

    user.token = token;
    await user.save();

    res.status(200).json({
      user: {
        id: user._id,
        Username: user.username,
        Email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const SendMessages = async (req, res) => {
  try {
    const { message, sendername } = req.body;
    const msg = new Message({ message, sendername });
    await msg.save();
    res.status(200).send("Message sent successfully");
  } catch (e) {
    console.error(e);
    res.status(500).send("Internal Server Error");
  }
};

const Getmessages = async (req, res) => {
  const msg = await Message.find();
  const messages = await Promise.all(
    msg.map(async (message) => {
      return {
        mesgId: message._id,
        messages: message.message,
        sendername: message.sendername,
        createdAt: message.createdAt,
        fileType: message.fileType,
      };
    })
  );
  res.status(200).json(messages);
};

const DeleteMessage = async (req, res) => {
  try {
    const id = req.params.Id;
    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).send("Message not found");
    }
    await Message.deleteOne({ _id: id });
    res.status(200).send("Message deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const Editmessage = async (req, res) => {
  try {
    const id = req.params.Id;
    const { message } = req.body;
    const messages = await Message.findById(id);
    if (!messages) {
      return res.status(404).send("Message not found");
    }
    await Message.updateOne({ _id: id }, { message: message });
    res.status(200).send("Message updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const FileSending = async (req, res) => {
  try {
    console.log("file");
    const username = req.body.sendername;
    const filename = req.file ? req.file.originalname : null;
    console.log(filename);
    if (!filename || !username) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    const newFile = await new Message({
      message: filename,
      sendername: username,
      fileType: "file",
    });
    await newFile.save();
    res.status(200).json({ filename: filename });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const getDetails = async (req, res) => {
  const id = req.params.Id;
  try {
    const details = await Message.findById(id);
    console.log("details", details);
    if (!details) {
      return res.status(404).send("Message not found");
    }
    res.status(200).json(details);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  Register,
  Login,
  SendMessages,
  Getmessages,
  DeleteMessage,
  Editmessage,
  FileSending,
  getDetails,
};
