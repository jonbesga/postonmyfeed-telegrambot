const TelegramBot = require('node-telegram-bot-api');
const config = require('../config/config')

const User = require('../models/User')
const twitter = require('./twitter')
const utils = require('../utils/')

let removalDelay;

const bot = new TelegramBot(config.BOT_TOKEN);

bot.setWebHook(`${config.WEBHOOK_URL}/bot${config.BOT_TOKEN}`);

bot.on('callback_query', query => {
  // If the user clicking the action is the same who made the message
  if(query.from.id === query.message.reply_to_message.from.id){
    clearInterval(removalDelay)

    if(query.data === 'publish_update'){
      twitter.postOnTwitterFeed(query.message.reply_to_message.from.id, query.message.reply_to_message.text)
      bot.answerCallbackQuery({
        callback_query_id: query.id
      })
    }

    bot.deleteMessage(query.message.chat.id, query.message.message_id)
  }
});

bot.on('message', async (msg) => {
  if(msg.text === '/start'){
    const helpMessage = `
*Post On My Feed Bot (@PostOnMyFeedBot)*
Hi, do you post more content on Telegram than you post on Twitter? I'm a bot that will help you to post on Twitter all the links you share in a Telegram group

*How do I help*
1. Invite me to a group
2. /grant me access to your Twitter account so I can publish on your behalf. Don't worry, I will never tweet without your permission!
3. Speak normally in the group you invited me to. Any time you share a link. I will suggest you to publish it on Twitter. Press the button that will appear, and done!

*Feedback and problems*
Contact my maker @heyjon
`
    bot.sendMessage(msg.from.id, helpMessage, {
      parse_mode: 'Markdown'
    })
  }
  else if(msg.text === '/grant'){
    try{
      const authUrl = await twitter.generateAuthUrl(msg.from.id, msg.from.username, msg.from.first_name, msg.from.last_name)
      bot.sendMessage(msg.from.id, "Hi, I need permissions to publish tweets on your behalf. Don't worry, I will never publish anything if you don't let me.", {
        reply_markup: {
          inline_keyboard: [[{
            text: 'Grant permissions',
            url: authUrl
          }]]
        }
      })
    }
    catch(error){
      console.log('ERROR', error)
    } 
  }
  else{
    const user = await User.fetch(msg.from.id);
    
    if(user && utils.messageHasURL(msg.text)){
      
      const message = await bot.sendMessage(msg.chat.id, "URL detected. Do you want me to publish this on your Twitter feed? This message will dissapear in 5 seconds", {
        reply_to_message_id: msg.message_id,
        reply_markup: {
          inline_keyboard: [[{
            text: 'Yes',
            callback_data: 'publish_update'
          }]]
        }
      })

      removalDelay = setInterval(() => {
        bot.deleteMessage(message.chat.id, message.message_id)
        clearInterval(removalDelay)
      }, config.REJECTION_DELAY)
      
    }
  }
});

module.exports = bot