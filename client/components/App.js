import React, { Component } from 'react';
import UpdateList from './UpdateList';
import AnalyticsChart from './AnalyticsChart';
import AnalyticsSummary from './AnalyticsSummary';
import LoadMore from './LoadMore';

class App extends Component {
  render() {
    return (
      <div className="app">
        <img
          src="/logo-buffer.svg"
          alt="Buffer"
          className="logo"
        />
        <h2>Analytics</h2>
        <AnalyticsChart
          analyticsTimeseries={this.props.analyticsTimeseries}
        />
        <h2>Recent posts</h2>
        <div className="main-container">
          <div>
            <UpdateList
              updatesLoadedAll={this.props.updatesLoadedAll}
              updates={this.props.updates}
              dispatch={this.props.dispatch}
            />
            <div className="update-list-load-more">
              <LoadMore
                currentCount={this.props.updates ? this.props.updates.length : 0} totalCount={this.props.totalCount}
                dispatch={this.props.dispatch}/>
            </div>
          </div>
          <AnalyticsSummary
            updates={this.props.updates}
          />
        </div>
      </div>
    );
  }
}

export default App;
