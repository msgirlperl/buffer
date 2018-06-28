import React, { Component } from 'react';

class AnalyticsSummary extends Component {

  getAnalyticsSummaryData(updates = []) {
    return updates.reduce((data, update) => {
      return {
        retweets: data.retweets + (update.statistics ? update.statistics.retweets : 0),
        favorites: data.favorites + (update.statistics ? update.statistics.favorites : 0),
        clicks: data.clicks + (update.statistics ? update.statistics.clicks : 0),
      }
    }, {
      retweets: 0,
      favorites: 0,
      clicks: 0
    })
  }

  render() {
    if (!this.props.updates) {
      return (
        <div className="analytics-summary">
          Loading...
        </div>
      )
    }
    const data = this.getAnalyticsSummaryData(this.props.updates)
    const items = [
      {
        value: this.props.updates.length,
        name: 'Posts'
      },
      {
        value: data.retweets,
        name: 'Retweets'
      },
      {
        value: data.favorites,
        name: 'Favorites'
      },
      {
        value: data.clicks,
        name: 'Clicks'
      },
    ]
    return (
      <div className="analytics-summary">
        {items.map((item, idx) => (
          <div className="analytics-item" key={idx}>
            <div className="analytics-item-value">
              {item.value}
            </div>
            <div className="analytics-item-name">
              {item.name}
            </div>
          </div>
        ))}
      </div>
    )
    return
  }
}

export default AnalyticsSummary;
