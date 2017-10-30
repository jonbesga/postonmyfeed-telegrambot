const express = require('express');
const router = express.Router();
const bot = require('../controllers/bot');

router.post('/', (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

module.exports = router