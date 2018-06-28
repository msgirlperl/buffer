/**
 * getDayStartFromUnixTimestamp
 *
 * Given a unix timestamp, return the unix timestamp of the 00:00 hour
 * of that same day.
 */
module.exports.getDayStartFromUnixTimestamp = function (timestamp) {
  const dayInSeconds = 24 * 60 * 60
  return Math.floor(timestamp / dayInSeconds) * dayInSeconds
}

/**
 * getTimestampSeriesArray
 *
 * Given start and end unix timestamps, return an array of timestamps
 * with timestamps 24 hours apart from the start to the end.
 * ex.
 *   getDateSeries(1526601600, 1527033600)
 *   [1526601600, 1526688000, 1526774400, 1526860800, 1526947200, 1527033600]
 */
module.exports.getTimestampSeriesArray = function (startTimestamp, endTimestamp) {
  const days = [startTimestamp];
  while (days[days.length - 1] < endTimestamp) {
    days.push(days[days.length - 1] + 24 * 60 * 60);
  }
  return days;
}
