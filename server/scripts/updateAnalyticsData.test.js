const chai = require('chai');
const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const updateAnalyticsData = require('./updateAnalyticsData');

const request = require('request')

const expect = chai.expect;

const adapter = new FileSync(path.join(__dirname, '../database/db.json'));
const db = low(adapter);

describe('updateAnalyticsData', function() {
  describe('fetchLatestTweetsIntoDB', function() {
    it('should fetch and save most recent tweets', function(done) {
      // confirm valid baseline:
      // db
      //   .get('updates-analytics')
      //   .find({id: })
      //           .value();
      //

      request('https://jsonplaceholder.typicode.com/users', { json: true }, (err, res, body) => {
  if (err) { return console.log(err); }
  console.log(res);
  console.log(body);
});


  //    const tweets = updateAnalyticsData.fetchLatestTweetsIntoDB();
      //console.log(tweets);

      done();
    });
  });
});
