
exports.up = function (knex, Promise) {
  return knex.schema
    .createTable('users', (table) => {
      table.text('id').primary();
      table.text('username');
      table.text('first_name');
      table.text('last_name');
      table.text('request_token');
      table.text('request_token_secret');
      table.text('access_token');
      table.text('access_token_secret');
      table.integer('tweets_sent').defaultTo(0);
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at');
    })
};

exports.down = function (knex, Promise) {
  return knex.schema
    .dropTable('users')
};
