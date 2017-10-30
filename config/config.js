if(process.env.NODE_ENV != 'production'){
  require('dotenv').config();
}

module.exports.BOT_TOKEN = process.env.BOT_TOKEN
module.exports.WEBHOOK_URL = process.env.WEBHOOK_URL
module.exports.HOST = process.env.HOST
module.exports.PORT = process.env.PORT
module.exports.REJECTION_DELAY = process.env.REJECTION_DELAY
module.exports.TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY
module.exports.TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET
module.exports.DATABASE_URL = process.env.DATABASE_URL
module.exports.DATABASE_NAME = process.env.DATABASE_NAME
module.exports.DATABASE_HOST = process.env.DATABASE_HOST