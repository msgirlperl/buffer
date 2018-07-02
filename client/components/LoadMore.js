import React, { Component } from 'react';
import actions from '../actions'

//import Button from '@bufferapp/components/Button';

class LoadMore extends Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick (event) {
    this.props.dispatch({ type: actions.LOAD_MORE_UPDATES });
  }

  render() {

    if (this.props.currentCount < this.props.totalCount) {
      return (
        <button
          type="button"
          onClick={this.handleClick}
        >
          Load More
        </button>
      );
    }
    return null;
  }
}

export default LoadMore;
