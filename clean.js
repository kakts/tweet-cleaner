const Twitter = require('twitter');

const config = require('./conf/credential');

console.error("hello--", config);

// Create twitter client instance.
const client = new Twitter(config);

const params = {
  user_id: 'pupjnky'
};

client.get('statuses/user_timeline', params, (error, tweets, response) => {
  if (error) {
    console.error(error);
  }
  console.log(tweets);
});
