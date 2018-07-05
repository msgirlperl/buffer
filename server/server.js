const express = require('express');
const serve = require('express-static');
const morgan = require('morgan');
const path = require('path');
const low = require('lowdb');
const _ = require('lodash');
const FileSync = require('lowdb/adapters/FileSync');
const {
  getDayStartFromUnixTimestamp,
  getTimestampSeriesArray
} = require('./lib/dates');
const constants = require('./constants');

const app = express();
const PORT = 8080;

const adapter = new FileSync(path.join(__dirname, './database/db.json'));
const db = low(adapter);

// Logger
app.use(morgan('dev'));

// Disable caching for API endpoints
app.use('/api', (req, res, next) => {
  res.header('Cache-Control', 'no-cache');
  next();
});

// Gets updates and update analytics, in increments of 10 records starting at startIndex, sorted
// by most recent sent_at date
app.get('/api/getUpdates/:startIndex', (req, res) => {
  let numRecords;
  const paramStartIndex = req.params.startIndex;
  let startIndex;

  if (!paramStartIndex || paramStartIndex==='0') {
    startIndex = 0;
    const records = db.get('updates').value();
    numRecords = records.length;
  } else {
     startIndex = parseInt(paramStartIndex);
  }

  let updates = db
    .get('updates')
    .orderBy('sent_at', 'desc')
    .slice(startIndex, startIndex + 10)
    .value();

  updates.forEach(update => {
    update['statistics'] = db
      .get('updates-analytics')
      .find({ update_id: update.id })
      .value();
  });

  const reply = {
    total: numRecords,
    updates
  };

  if (updates.length===0) {
    reply['message'] = constants.NO_MORE_UPDATES;
  }

  res.json(reply);
});

// Returns a timeseries of all updates aggregated by day that the update was sent
app.get('/api/getAnalyticsTimeseries', (req, res) => {

  /*
      1. Get all updates and update-analytics
      2. Get first and last update's "dayStart",
      3. Get getTimestampSeriesArray, passing in these bounds and create the
          stubbed-out array to return
      4. Iterate over each update, look up it's analytics, and append them to
          the corresponding object's counts in the seriesTS array
  */

  const allUpdates = db
    .get('updates')
    .orderBy('sent_at', 'asc')
    .value();

  const allAnalytics = db
    .get('updates-analytics')
    .value();

  const startTS = getDayStartFromUnixTimestamp(allUpdates[0].sent_at);
  const endTS = getDayStartFromUnixTimestamp(allUpdates[allUpdates.length-1].sent_at);

  const seriesTS = getTimestampSeriesArray(startTS, endTS)
    .map( ts => {
      return {
        timestamp : ts,
        retweets: 0,
        favorites: 0,
        clicks: 0
     }
   });

  allUpdates.forEach(update => {

    const analytics = allAnalytics.find(x => x.update_id === update.id);

    const ts = getDayStartFromUnixTimestamp(update.sent_at);
    const index = _.findIndex(seriesTS, (x) => x.timestamp === ts);

    seriesTS[index].retweets += analytics.retweets;
    seriesTS[index].favorites += analytics.favorites;
    seriesTS[index].clicks += analytics.clicks;

  });

  res.json(
    seriesTS.map(item => {
        // turn unix timestamp into javascript millisecond timestamp
        item.timestamp = item.timestamp * 1000
        return item
      })
  );
});

// Serve static assets in the /public directory
app.use(
  serve(path.join(__dirname, '../public'), {
    cacheControl: 'no-cache'
  })
);

app.use((err, req, res, next) => {
  // Handle missing file in public dir as a 404
  if (err.code === 'ENOENT') {
    return res.status(404).send('404 - Page not found');
  }
  console.log(err);
  res.status(500).send(err);
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = app;
