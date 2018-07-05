const path = require('path');
const low = require('lowdb');
const _ = require('lodash');
const FileSync = require('lowdb/adapters/FileSync');
//const rp = require('request-promise');
const axios = require('axios');

const adapter = new FileSync(path.join(__dirname, '../database/db.json'));
const db = low(adapter);

//process.on('unhandledRejection', (reason, p) => { throw reason });

module.exports.fetchLatestTweetAnalyticsFromAPI = (tweetId, callback) => {

  const url = `http://code-exercise-api.buffer.com/getTweets?ids=${tweetId}`;
  axios.get(url)
    .then((response) => {
        if (response.data.length===0){
          callback('Unable to find that tweet.');
        } else {
          callback(undefined, response.data[0]);
//          return response.data[0];
        }
    })
    .catch((e) => {
      if (e.code === 'ENOTFOUND'){
        callback('Unable to connect to API server.');
      } else {
        callback(e.message);
      }
    });

  return;
};

// Retrieves the latest tweet analytics from the buffer-code-exercise-api and refreshes
// the updates-analytics collection with them
module.exports.fetchLatestTweetAnalyticsIntoDB = (fetchLatestTweetAnalytics) => {

 const updates = db
   .get('updates')
   .value();

 updates.forEach(update => {

    // const analyticsUpdate = fetchLatestTweetAnalytics(update.service_update_id);
    // console.log(analyticsUpdate);
    //  return db
    //    .get('updates-analytics')
    //    .find({ update_id: update.id })
    //    .assign({
    //      retweets: analyticsUpdate.retweet_count,
    //      favorites: analyticsUpdate.favorite_count,
    //      clicks: analyticsUpdate.click_count})
    //    .write();

    fetchLatestTweetAnalytics(update.service_update_id, (error, analyticsUpdate) => {
      if (error){
        console.log(error);
      } else {
        console.log(analyticsUpdate);
         return db
           .get('updates-analytics')
           .find({ update_id: update.id })
           .assign({
             retweets: analyticsUpdate.retweet_count,
             favorites: analyticsUpdate.favorite_count,
             clicks: analyticsUpdate.click_count})
           .write();
      }
    });

   });
 };
