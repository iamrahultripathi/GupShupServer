const express = require('express');
const roomController = require('./roomController');
const router = express.Router();

router.post('/create-room', roomController.createRoom);
router.get('/public-rooms', roomController.publicRooms);
router.get('/private-rooms/:userId', roomController.privateRoom);

module.exports = router;
