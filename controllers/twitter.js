const twitterAPI = require('node-twitter-api');
const config = require('../config/config')
const User = require('../models/User');

const twitter = new twitterAPI({
  consumerKey: config.TWITTER_CONSUMER_KEY,
  consumerSecret: config.TWITTER_CONSUMER_SECRET ,
  callback: `${config.WEBHOOK_URL}/twitter/auth`
});

module.exports = {
  generateAuthUrl: (userId, username, firstName, lastName) => {
    return new Promise((resolve, reject) => {
      callbackGetRequestToken = async (error, requestToken, requestTokenSecret, results) => {
        if (error) { reject("Error getting OAuth request token : " + error) }
        else {
          let u = await User.fetch(userId)
          if(!u){
            u = await User.save(userId, username, firstName, lastName)
          }
          await User.updateRequestTokens(u.attributes.id, requestToken, requestTokenSecret)
          resolve(twitter.getAuthUrl(requestToken))
        }
      }
      twitter.getRequestToken(callbackGetRequestToken)
    })
  },

  postOnTwitterFeed: async (userId, status) => {
    const u = await User.fetch(userId)
    if(u){
      const {access_token, access_token_secret } = u.attributes
      twitter.statuses("update", {
          status,
        },
        access_token,
        access_token_secret,
        async function(error, data, response) {
          if (error) {
            console.log(error)
          } else {
            await User.updateTweetCount(u.attributes.id, u.attributes.tweets_sent + 1)
            console.log('Tweet send successfully')
          }
        }
      );
    }
  },

  generateAccessTokens: (oauth_token, oauth_verifier) => {
    return new Promise(async (resolve, reject) => {
      const user = await User.fetchByRequestToken(oauth_token)
      twitter.getAccessToken(user.attributes.request_token, user.attributes.request_token_secret, oauth_verifier,
        async function(error, accessToken, accessTokenSecret, results) {
          if (error) { reject(error) }
          else {
            const response = await User.saveAccessTokens(user.attributes.id, accessToken, accessTokenSecret)
            resolve(response);
          }
        }
      )
    })
  },
}