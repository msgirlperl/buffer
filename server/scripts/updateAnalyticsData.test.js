const chai = require('chai');
const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const updateAnalyticsData = require('./updateAnalyticsData');

const request = require('request')

const expect = chai.expect;

const adapter = new FileSync(path.join(__dirname, '../database/db.json'));
const db = low(adapter);

const wipeOutAnalytics = () => {
  db
    .get('updates-analytics')
    .each(item => {
      item.retweets = 0;
      item.favorites = 0;
      item.clicks = 0;
    })
    .write();
};

const verifyZeroedAnalytics = () => {

  return db
    .get('updates-analytics')
    .filter({
      retweets: 0,
      favorites: 0,
      clicks: 0})
    .value()
    .length === 60;
};

describe('updateAnalyticsData', function() {
  describe('fetchLatestTweetsIntoDB', function() {
    it('should fetch and save most recent tweets', async function(done) {

      wipeOutAnalytics();
      if (verifyZeroedAnalytics()){
        console.log('valid testbed');
      } else {
        console.log('***INVALID TESTBED!***');
        expect(0).to.equal(1);
      }

      await updateAnalyticsData.fetchLatestTweetsIntoDB();
      //console.log(tweets);
      expect(verifyZeroedAnalytics()).to.be.false;
      done();
    });
  });
});
