const chai = require('chai');
const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const updateAnalyticsData = require('./updateAnalyticsData');

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

      const tweets = updateAnalyticsData.fetchLatestTweetsIntoDB();
      // const updates = JSON.parse(res.text);
      // //expect(updates.length).to.equal(10);
      // expect(updates).length(10);
      // expect(updates[0].id).to.equal('5ae55aaa3eae5117214f8cb0');
      // expect(updates[9].id).to.equal('5adc50d93146d15c33ee7fbf');
      done();
    });
  });
});
