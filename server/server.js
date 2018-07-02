const express = require('express');
const serve = require('express-static');
const morgan = require('morgan');
const path = require('path');
const low = require('lowdb');
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

app.get('/api/getAnalyticsTimeseries ', (req, res) => {
  // const updates = db
  //   .get('updates')
  //   .orderBy('sent_at', 'desc')
  //   .slice(0, 10)
  //   .value();

  res.json(updates);
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
