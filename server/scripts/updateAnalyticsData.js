const path = require('path');
const low = require('lowdb');
const _ = require('lodash');
const FileSync = require('lowdb/adapters/FileSync');
//const rp = require('request-promise');
const axios = require('axios');

const adapter = new FileSync(path.join(__dirname, '../database/db.json'));
const db = low(adapter);

module.exports.fetchLatestTweetsIntoDB = async () => {

 const updates = db
   .get('updates')
   .value();


 updates.forEach(update => {

   const url = `http://code-exercise-api.buffer.com/getTweets?ids=${update.service_update_id}`;
   axios.get(url).then((response) => {

     const analyticsUpdate = response.data[0];

       if (response.data.status === 'ZERO_RESULTS'){
         throw new Error ('Unable to find that tweet.');
       }

       db
         .get('updates-analytics')
         .find({ update_id: update.id })
         .assign({
           retweets: analyticsUpdate.retweet_count,
           favorites: analyticsUpdate.favorite_count,
           clicks: analyticsUpdate.click_count})
         .write();         
   })
   // .then((response) => {
   //   // var temperature = response.data.currently.temperature;
   //   // var apparentTemperature = response.data.currently.apparentTemperature;
   //   // console.log(`It's currently ${temperature}.  It feels like ${apparentTemperature}`);
   //   console.log('response', response);
   // })
   .catch((e) => {
     if (e.code === 'ENOTFOUND'){
       console.log('Unable to connect to API servers.');
     } else {
       console.log(e.message);
     }
   });
 });
};
