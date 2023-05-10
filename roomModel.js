const mongoose = require('mongoose');

const roomModel = mongoose.Schema(
  {
    roomid: {
      type: String,
      required: [true, 'A room must have a roomid'],
    },
    type: {
      type: String,
      enum: ['public', 'private'],
    },
    name: {
      type: String,
      required: [true, 'A room must have a name'],
    },
    owner: {
      type: String,
      required: [true, 'A room must have an owner'],
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model('Chatzzz', roomModel);

module.exports = Room;
