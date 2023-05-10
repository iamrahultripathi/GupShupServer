const Room = require('./roomModel');

exports.createRoom = async (req, res, next) => {
  try {
    const { roomid, name, type, owner, image } = req.body;
    const room = await Room.create({
      name,
      roomid,
      type,
      owner,
      image,
    });
    res.status(201).json({
      room,
    });
  } catch (err) {
    next(err);
  }
};

exports.publicRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find({
      type: 'public',
    });
    res.status(200).json({
      rooms,
    });
  } catch (err) {
    next(err);
  }
};

exports.privateRoom = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const rooms = await Room.find({
      owner: userId,
    });
    res.status(200).json({
      rooms,
    });
  } catch (err) {
    next(err);
  }
};
