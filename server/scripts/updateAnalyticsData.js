const path = require('path');
const low = require('lowdb');
const _ = require('lodash');
const FileSync = require('lowdb/adapters/FileSync');
const request = require('request');

const adapter = new FileSync(path.join(__dirname, '../database/db.json'));
const db = low(adapter);

//module.exports.fetchLatestTweetsIntoDB = () => {

//   request('http://code-exercise-api.buffer.com/getTweets?ids=989720051677741057,989479247084388353', function(err, res, body) {
//     console.log(body);
// //    console.log(JSON.stringify(body, undefined, 2));
//
//   });

  //promises all?

  const updates = db
    .get('updates')
    .value();

    // split into smaller chunks to make the API requests (to minimize number of API requests)
    const updateChunks = _.chunk(updates, 4);
//    console.log(updateChunks.length);

  updateChunks.forEach(chunk => {

    getLatestTweetAnalytics(chunk, (errorMessage, results) => {
      if (errorMessage){
         console.log(errorMessage);
       } else {
        console.log('results length', results.analytics.length);

          // results.analytics.forEach(analytic => {
          //
          // })
          chunk.forEach(update => {
            const analyticsUpdate = results.analytics.filter( x => x.id === update.service_update_id)[0];
              
            db
              .get('updates-analytics')
              .find({ update_id: update.id })
              .assign({
                retweets: analyticsUpdate.retweet_count,
                favorites: analyticsUpdate.favorite_count,
                clicks: analyticsUpdate.click_count})
              .value();
          });

          // updates.forEach(update => {
          //   update['statistics'] = db
          //     .get('updates-analytics')
          //     .find({ update_id: update.id })
          //     .value();
          // });
       }
    })
  });


//};

function getLatestTweetAnalytics(chunk, callback) {

  const tweet1 = chunk[0].service_update_id;
  let tweet2, tweet3, tweet4 = null;
  if (chunk[1]) {
    tweet2 = chunk[1].service_update_id;
  }
  if (chunk[2]) {
    tweet3 = chunk[2].service_update_id;
  }
  if (chunk[3]) {
    tweet4 = chunk[3].service_update_id;
  }
//  console.log('request', `http://code-exercise-api.buffer.com/getTweets?ids=${tweet1},${tweet2},${tweet3},${tweet4}`);
  request({
    url: `http://code-exercise-api.buffer.com/getTweets?ids=${tweet1},${tweet2},${tweet3},${tweet4}`,
    json:true
  }, (error, response, body) => {
      if (!error && response.statusCode ===200) {
        callback(undefined,
          {
            analytics: body
          });
      } else {
        callback('Unable to fetch tweets.');
      }
    });
};
