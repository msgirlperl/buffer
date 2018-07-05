const chai = require('chai');
const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const request = require('request')
const expect = chai.expect;
const updateAnalyticsData = require('./updateAnalyticsData');

const adapter = new FileSync(path.join(__dirname, '../database/db.json'));
const db = low(adapter);

const wipeOutAnalytics = () => {
  return new Promise((resolve, reject) => {
    db
      .get('updates-analytics')
      .each(item => {
        item.retweets = 0;
        item.favorites = 0;
        item.clicks = 0;
      })
      .write();
    resolve();
  });
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

const fetchTweetsMock = (tweetId) => {

  return new Promise((resolve, reject) => {
    switch(tweetId) {
      case '989176218183401473':
        resolve({
          id: "989176218183401473",
          screen_name: "buffer",
          text: "Q2: How could Snapchat fit into a social media marketing strategy? #bufferchat",
          retweet_count: 3,
          favorite_count: 16,
          click_count: 8
        });
      case '988976810892382208':
        resolve({
          "id": "988976810892382208",
          "screen_name": "buffer",
          "text": "Want to travel the world? 7 bucket-list trips you can take without draining your bank account ✈️🌍",
          "retweet_count": 7,
          "favorite_count": 20,
          "click_count": 1
        });
      default:
        resolve({
          "id": tweetId,
          "screen_name": "buffer",
          "text": "",
          "retweet_count": 0,
          "favorite_count": 0,
          "click_count": 0
        });
    }
  });
};

describe('updateAnalyticsData', function() {
  describe('fetchLatestTweetAnalyticsIntoDB', function() {
    it('should fetch and save most recent tweets', function(done) {

      //wipeOutAnalytics();
      updateAnalyticsData.fetchLatestTweetAnalyticsIntoDB(fetchTweetsMock);

      // update_id: 5addbf19ae6b58330e375aef
      // service_update_id: 989176218183401473
      const test1 = db
        .get('updates-analytics')
        .find({_id: '5afef19c8bc4439870ed982f'})
        .value();

      // update_id: 5add1cc33eae51317fcd7603
      // service_update_id: 988976810892382208
      const test2 = db
        .get('updates-analytics')
        .find({_id: '5afef19c8bc4439870ed9844'})
        .value();

      expect(test1.favorites).to.equal(16);
      expect(test1.clicks).to.equal(8);
      expect(test1.retweets).to.equal(3);

      expect(test2.favorites).to.equal(20);
      expect(test2.clicks).to.equal(1);
      expect(test2.retweets).to.equal(7);
      done();
    });
  });
});
