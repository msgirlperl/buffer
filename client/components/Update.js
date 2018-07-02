import React, { Component } from 'react';

class Update extends Component {

  renderImage(media) {
    if (!media || !media.thumbnail) {
      return '';
    }
    return (
      <img
        className="update-image"
        src={media.thumbnail}
      />
    )
  }

  render() {

    return (
      <div className="update">
        <div className="update-contents">
          <p className="update-text" dangerouslySetInnerHTML={{ __html: this.props.text_formatted }}></p>
          {this.renderImage(this.props.media)}
        </div>
        <div className="update-analytics">
          <span className="update-analytics-metric">
            <span className="update-analytics-metric-icon bi-retweet"></span>
            {(this.props.statistics && this.props.statistics.retweets) || '0'}
          </span>
          <span className="update-analytics-metric">
            <span className="update-analytics-metric-icon bi-like"></span>
            {(this.props.statistics && this.props.statistics.favorites) || '0'}
          </span>
          <span className="update-analytics-metric">
            <span className="update-analytics-metric-icon bi-click"></span>
            {(this.props.statistics && this.props.statistics.clicks) || '0'}
          </span>
        </div>
        <div className="update-info">
          <div className="update-time">{this.props.day} at {this.props.due_time}</div>
          <div className="update-user">Added by {this.props.user.name}</div>
        </div>
      </div>
    );
  }

}

export default Update;
