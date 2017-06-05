const Twitter = require('twitter');
const _ = require('lodash');
const async = require('neo-async');
const config = require('./conf/credential');

console.error("hello--", config);

// Create twitter client instance.
const client = new Twitter(config);

const params = {
  screen_name: 'YOUR_ACCOUNT'
};

let tweetsCount;
async.series([
  (next) => {
    client.get('users/show', params, (err, userStatus, response) => {
      if (err) {
        console.error(err);
        return next(err);
      }
      console.error("----tweets", userStatus);
      tweetsCount = userStatus && userStatus.statuses_count;
      return next();
    });
  },
  (next) => {
    next();
  }
], (err) => {
  console.error('------err', err)
});
