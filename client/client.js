import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Store from './Store'
import actions from './actions'
import App from './components/App'

const store = new Store();

const render = (store) => {
  const props = store.getState()

  ReactDOM.render(
    <App
      {...props}
      dispatch={store.dispatch.bind(store)}
    />,
    document.getElementById('root')
  )
};

render(store);

// Listen to state changes
store.onChange(() => render(store))

// Load initial data
store.dispatch({ type: actions.LOAD_UPDATES })
store.dispatch({ type: actions.LOAD_ANALYTICS })
