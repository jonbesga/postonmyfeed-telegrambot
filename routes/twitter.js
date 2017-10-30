const express = require('express');
const router = express.Router();
const path = require('path');
const twitter = require('../controllers/twitter')

router.get('/auth', (req, res) => {
  twitter.generateAccessTokens(req.query.oauth_token, req.query.oauth_verifier)
  res.sendFile(path.join(__dirname, '../public/auth.html'))
})

module.exports = router