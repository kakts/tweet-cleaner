const Twitter = require('twitter');
const _ = require('lodash');
const async = require('neo-async');
const config = require('./conf/credential');
const csv = require('csvtojson');

// Create twitter client instance.
const client = new Twitter(config);

// Please set you latest date what you want to delete.
// This script delete user tweets as descending-date-order
// It can delete max 3200 tweets one time.
const finalDate = "2017-04-01";
const finalTimestamp = Date.parse(finalDate);

const MAX_API_REQUEST_COUNT = 3200;

let list = [];
let deleteCount = 0;

console.log('------Start deleting.-----');
csv()
  .fromFile('./tweets.csv')
  .on('json',(jsonObj)=>{
    const tweetTimestamp = Date.parse(jsonObj.timestamp);
    if (finalTimestamp > tweetTimestamp) {
      list.push(jsonObj.tweet_id);
    }
  })
  .on('done',(error)=>{
    async.eachSeries(list, (tweetId, next) => {
      // If the deleteCount exceeds MAX_API_REQUEST_COUNT, it will be skipped.
      if (deleteCount > MAX_API_REQUEST_COUNT) {
        return next();
      }
      // Delete specified tweets.
      client.post('statuses/destroy/' + tweetId, (err, result, response) => {
        if (err) {
          return next(err);
        }
        deleteCount++;
        console.log('success: tweetId: ', tweetId, deleteCount);
        next();
      });
    }, (err, res) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('finish. The last delete tweetId: ' + tweetId + '\n');
    });
  });
