# buffer-code-exercise


### Discussion of Requirements

#### Task1
* 1. Add a “Load More” button at the end of the list of updates which loads the next 10 updates each time

This is accomplished by passing a query string param along indicating where the next 10 records should start.

The first time the endpoint is called, the total number of records is retrieved and returned in the response, which is then saved in the store.  If the client has all the records, the "Load More" button is not rendered.

Clicking the "Load More" button triggers a new action, LOAD_MORE_UPDATES to be dispatched which updates the store with the next 10 records.

#### Task2
* 2. Append analytics from the "updates-analytics" collection to each update returned in the `/getUpdates` endpoint

After the 10 records have been retrieved from the db, we accomplish this task by iterating over each one and doing a lookup in the updates-analytics collection to grab the corresponding analytics.  The complexity of this is O(n).

#### Task3
* 3. Write a script in `/server/scripts/updateAnalyticsData.js` to fetch the most recent Tweet analytics from [the API](https://github.com/bufferapp/buffer-code-exercise-api#buffer-code-exercise-api) and update the "updates-analytics" records in the database.

To verify this task, there's a script called runAnalyticsUpdate.js under server/scripts.  It invokes a function, fetchLatestTweetAnalyticsIntoDB, which takes another function to call to retrieve the latest analytics from the API.  This allows for cleaner code, as well as more testable code.  The tests for this method (server/scriptsupdateAnalyticsData.test.js) use a mocked method to return a few of the expected analytics.

It appeared to me that the db.json file was already up-to-date with the values coming back from the API so I reset the analytics in db.json to 0 before running my scripts.

I'm not sure what the best way to address task#3 is.  I considered sending multiple tweetIds to the API to minimize the number of calls but with the small size of our db.json file (and it being static), I opted to make a separate call for each one to achieve a simpler algorithm.

The complexity of this algorithm is also linear.

** Please note that I am assuming that the db.json file would not have records without a corresponding updates-analytics record, but in a production system, some better error-handling would be included ;-)

#### Task4
* 4. Add new `/getAnalyticsTimeseries` endpoint which returns a timeseries of all update analytics aggregated by day that the update was sent: `[{ timestamp: 1526601600, retweets: 1, favorites: 2, clicks: 4 }, ...]`

For this task, we get all the db updates into an array, as well as the updates-analytics.  I considered calling the other endpoint that merges them (or moving the code into a common function) but decided that it didn't really buy us anything it wouldn't reduce the complexity of the algorithm and the code to merge them wasn't complicated.

Next, we determine the start and end timestamps, and then generate the timestampSeriesArray.  Instead of merely storing the timestamps, we modify this array to store objects that include the timestamps and the (currently zeroed-out) analytics.

Next, we iterate over each update, retrieve its corresponding updates-analytics, generate its timestamp, and finally, update the  timestampSeriesArray with values from this update.

Lastly, we multiply each timestamp in the array by 1000 before returning the array.  Note that this used to be done on the client but this produced a bug when the "Load More" button was clicked, since it continued to multiply by 1000 each time.

#### Final Note:
Sorry for the inconsistencies with the semi-colons!  I realize the original code didn't have them and my formatter was inserting them.  It got a little messy to try to go through each file and fix it and I figured it was a low priority.  
