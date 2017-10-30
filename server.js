const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config/config')

const bot = require('./routes/bot');
const twitter = require('./routes/twitter');

const User = require('./models/User')
const path = require('path')

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'))

// For development purposes
// app.get(`/api/users`, async (req, res) => {
//   const response = await User.fetchAll()
//   res.json(response)
// });

app.use(`/bot${config.BOT_TOKEN}`, bot)
app.use('/twitter', twitter)

app.listen(config.PORT, config.HOST, () => {
  console.log(`Express server is listening on http://${config.HOST}:${config.PORT}`);
});