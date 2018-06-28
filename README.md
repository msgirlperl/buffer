# buffer-code-exercise

* [Getting started](#getting-started)
* [About this repo](#about-this-repo)
* [The exercise](#the-exercise)

## Getting started

1. Install [Node.js](https://nodejs.org/en/) version 8.x
2. Clone this repo: `git clone git@github.com:bufferapp/buffer-code-exercise.git`
3. Install dependencies: `cd buffer-code-exercise && npm install`
4. Start up the local server in development mode `npm run development`

Now you'll have a local server running! Follow along to the next section
to learn more about how this project is organized.

## About this repo

### Client side code

The client code is located in `/client`. The main entry point or root file
is `client.js`. This is the starting file from which all other modules are
imported and referenced. Files can be imported using [ES2015 style `import` modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)
or the [commonjs style `require` modules](http://www.commonjs.org/specs/modules/1.0/).
The front-end is built using [React.js](https://reactjs.org/docs/hello-world.html) components.

When running the `npm run development` command, [`webpack`](https://webpack.js.org/)
will be started. Webpack is a build tool that will automatically bundle your
code into a single file. This bundled file will be created in `/public`.

All static assets like javascript files, stylesheets, and images should be
placed in the `/public` directory. When the server is started, these files will
all be available at `localhost:8080`.

### Server side code

The server code is located in `/server`. The main entry point is `server.js`.

The server is written using [Express.js](https://expressjs.com/) which is
similar to [Sinatra for Ruby](http://sinatrarb.com/),
[Flask for Python](http://flask.pocoo.org/), or
[Lumen for PHP](https://lumen.laravel.com/) if you are more familiar with
those languages.

The JSON database uses [lowdb](https://github.com/typicode/lowdb)
which leverages the [lodash](https://lodash.com/docs/4.17.10) library for
querying the data in `/server/database/db.json`.

## The exercise

We expect these tasks to take about 4 hours, but they may take less for you. If you have any questions or would like clarification, email dan@buffer.com. Further down here are screenshots of the hopeful project end result!

### How to complete the exercise

As your complete parts of the exercise, please use git to commit your code as you would normally work on a project. This is helpful component to see how you work as well. When you are complete, you can submit your work by zipping your the `buffer-code-exercise` directory then emailing to us. You can use Mac's "create archive" feature, Window's "compressed (zipped) folder," or the zip cli on Linux.

Try to complete the tasks to the best of your ability 😃 Good luck!

### Tasks

1. Add a “Load More” button at the end of the list of updates which loads the next 10 updates each time
2. Append analytics from the "updates-analytics" collection to each update returned in the `/getUpdates` endpoint
3. Write a script in `/server/scripts/updateAnalyticsData.js` to fetch the most recent Tweet analytics from [the API](https://github.com/bufferapp/buffer-code-exercise-api#buffer-code-exercise-api) and update the "updates-analytics" records in the database.
4. Add new `/getAnalyticsTimeseries` endpoint which returns a timeseries of all update analytics aggregated by day that the update was sent: `[{ timestamp: 1526601600, retweets: 1, favorites: 2, clicks: 4 }, ...]`

### Helpful notes & resources

* Your analytics time series chart may look slightly different from the screenshot below due to your local timezone. This is ok 😉
* [The documentation for the API used in Task 3](https://github.com/bufferapp/buffer-code-exercise-api#buffer-code-exercise-api)
* On the update "model," the `service_update_id` is the Twitter tweet `id`
* [lowdb](https://github.com/typicode/lowdb)
* [lowdash](https://lodash.com/docs/4.17.10)

### Screenshots

In addition to the screenshot, here is a video of the "Load More" button working component: [http://hi.buffer.com/3y2V113r0o3F](http://hi.buffer.com/3y2V113r0o3F)

![screenshot of end goal](http://hi.buffer.com/331B0w3f001h/Screen%20Shot%202018-05-21%20at%203.27.13%20PM.png)

### Version

1.0
