const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    sendername: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
    },
  },
  { timestamps: { currentTime: () => Date.now() + 5.5 * 60 * 60 * 1000 } }
);
const Message = mongoose.model("Chat", schema);
module.exports = Message;
