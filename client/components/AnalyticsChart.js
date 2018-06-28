import React, { Component } from 'react';
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  LineSeries,
  DiscreteColorLegend,
} from 'react-vis';

const capFirst = (s) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const monthNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]
const getShortDate = (time) => {
  const date = new Date(time)
  const month = monthNames[date.getMonth()]
  return `${month} ${date.getDate()}`
}

class AnalyticsChart extends Component {
  render() {
    const colors = {
      retweets: '#7F42FB',
      favorites: '#FD684A',
      clicks: '#56E6BF',
    }

    const rawData = this.props.analyticsTimeseries ? this.props.analyticsTimeseries : []
    const timeseries = rawData.map(item => {
      // turn unix timestamp into javascript millisecond timestamp
      item.timestamp = item.timestamp * 1000
      return item
    })
    const timestamps = timeseries.map(d => d.timestamp)
    const retweets = timeseries.map(d => ({ x: d.timestamp, y: d.retweets }))
    const favorites = timeseries.map(d => ({ x: d.timestamp, y: d.favorites }))
    const clicks = timeseries.map(d => ({ x: d.timestamp, y: d.clicks }))

    const labels = Object.keys(colors).map(key => {
      return {
        title: capFirst(key),
        color: colors[key]
      }
    })
    const totalWidth = 930;
    const chartWidth = 800;

    return (
      <div className="analytics-chart">
        <XYPlot
          xType="time"
          width={chartWidth - 20}
          margin={{ right: 20 }}
          height={300}
        >
          <HorizontalGridLines />
          <XAxis
            title="Day"
            position="start"
            tickValues={timestamps}
            tickFormat={getShortDate}
            tickTotal={timestamps.length - 1}
          />
          <YAxis />
          <LineSeries
            className="first-series"
            data={retweets}
            color={colors.retweets}
          />
          <LineSeries
            className="second-series"
            data={favorites}
            color={colors.favorites}
          />
          <LineSeries
            className="third-series"
            data={clicks}
            color={colors.clicks}
          />
        </XYPlot>
        <DiscreteColorLegend
          height={200}
          width={totalWidth - chartWidth}
          items={labels}
        />
    </div>
    )
  }
}

export default AnalyticsChart;
