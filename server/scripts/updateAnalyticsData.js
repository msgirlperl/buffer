const path = require('path');
const low = require('lowdb');
const _ = require('lodash');
const FileSync = require('lowdb/adapters/FileSync');
const axios = require('axios');

const adapter = new FileSync(path.join(__dirname, '../database/db.json'));
const db = low(adapter);

module.exports.fetchLatestTweetAnalyticsFromAPI = (tweetId) => {

  const url = `http://code-exercise-api.buffer.com/getTweets?ids=${tweetId}`;
  return axios.get(url)
    .then((response) => {
        if (response.data.length===0 || response.data[0] === null){
          throw new Error('Unable to find that tweet.');
        } else {
          return response.data[0];
        }
    }, (error) => {
      if (error.code === 'ENOTFOUND'){
        throw new Error('Unable to connect to API server.');
      } else {
        throw new Error(error.message);
      }
    });
};

// Retrieves the latest tweet analytics from the buffer-code-exercise-api and refreshes
// the updates-analytics collection with them
module.exports.fetchLatestTweetAnalyticsIntoDB = (fetchLatestTweetAnalytics) => {

 const updates = db
   .get('updates')
   .value();

 updates.forEach(update => {
    fetchLatestTweetAnalytics(update.service_update_id)
      .then((analyticsUpdate) => {
          db
            .get('updates-analytics')
            .find({ update_id: update.id })
            .assign({
              retweets: analyticsUpdate.retweet_count,
              favorites: analyticsUpdate.favorite_count,
              clicks: analyticsUpdate.click_count})
            .write();
      }, (error) => {
        console.log(error);
      })
      .catch((error) => {
        console.log(error);
      });
   });
 };
