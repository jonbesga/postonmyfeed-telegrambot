const knex = require('../config/knex.js');
const bookshelf = require('bookshelf')(knex);

const model = bookshelf.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
});

module.exports = {
  model,
  fetchAll: () => model.fetchAll(),

  fetch: id => model.where('id', id).fetch(),

  save: (id, username, first_name, last_name) => {
    return model.forge({
      id,
      username,
      first_name,
      last_name
    }).save({}, {
      method: 'insert',
    });
  },

  updateTweetCount : (id, tweets_sent) => {
    return model.where('id', id)
    .save({
      tweets_sent,
    },{ patch: true, method: 'update' });
  },

  updateRequestTokens: (id, requestToken, requestTokenSecret) => {
    return model.where('id', id)
    .save({
      request_token: requestToken,
      request_token_secret: requestTokenSecret,
    },{ patch: true, method: 'update' });
  },

  fetchByRequestToken: (requestToken) => {
    return model.where('request_token', requestToken).fetch()
  },

  saveAccessTokens: (id, accessToken, accessTokenSecret) => {
    return model.where('id', id)
    .save({
      access_token: accessToken,
      access_token_secret: accessTokenSecret,
    },{ patch: true, method: 'update' });
  },
}
