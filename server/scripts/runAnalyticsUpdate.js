/*
  Use this to execute the scripts for Task#3
*/
const updateAnalyticsData = require('./updateAnalyticsData');

updateAnalyticsData.fetchLatestTweetAnalyticsIntoDB(
  updateAnalyticsData.fetchLatestTweetAnalyticsFromAPI
);
