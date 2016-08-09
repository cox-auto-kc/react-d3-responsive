'use strict';

import React from 'react';
import d3 from 'd3';

class TrendLine extends React.Component {

  constructor(props) {
    super(props);
  }

  createChart(_self) {
    // Create line
    this.line = d3.svg.line()
      .x(function (d) {
        return this.xScale(d[_self.props.xData]);
      })
      .y(function (d) {
        return this.yScale(d[_self.props.yData]);
      })
      .interpolate(this.props.lineType);
  }

  // returns slope, intercept and r-square of the line
  leastSquares(xSeries, ySeries) {
    let reduceSumFunc = function(prev, cur) { return prev + cur; };

    let xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
    let yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;

    let ssXX = xSeries.map(function(d) { return Math.pow(d - xBar, 2); })
      .reduce(reduceSumFunc);

    let ssYY = ySeries.map(function(d) { return Math.pow(d - yBar, 2); })
      .reduce(reduceSumFunc);

    let ssXY = xSeries.map(function(d, i) { return (d - xBar) * (ySeries[i] - yBar); })
      .reduce(reduceSumFunc);

    let slope = ssXY / ssXX;
    let intercept = yBar - (xBar * slope);
    let rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);

    return [slope, intercept, rSquare];
  }

  render() {

    this.createChart(this);

    const _self = this;
    let data = this.props.data;

    let xSeries = data.map(function (d) { return d[_self.props.xData]; });
    let ySeries = data.map(function (d) { return d[_self.props.yData]; });

    let leastSquaresCoeff = this.leastSquares(xSeries, ySeries);

    let x1 = d3.min(xSeries, function(d) { return d; });
    let y1 = leastSquaresCoeff[0] + leastSquaresCoeff[1];
    let x2 = d3.max(xSeries, function(d) { return d; });
    let y2 = leastSquaresCoeff[0] * xSeries.length + leastSquaresCoeff[1];

    let trendData = [
      {'x':x1, 'y':y1},
      {'x':x2, 'y':y2}
    ];

    let line = trendData.map(function(d,i) {
      console.log(d);
      return (
        <g className="trend-line" key={i} >
          <path
            d={_self.line(d)}
            opacity=".9"
            strokeWidth={3}
            strokeLinecap="round" />
        </g>
      );
    });

    return (
      <g>{line}</g>
    );
  }
}

TrendLine.propTypes = {
  data: React.PropTypes.array,
  x: React.PropTypes.func,
  y: React.PropTypes.func,
  xData: React.PropTypes.string.isRequired,
  yData: React.PropTypes.string.isRequired
};

export default TrendLine;
