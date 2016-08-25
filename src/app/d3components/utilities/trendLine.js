/*eslint-disable react/no-set-state */
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';

class TrendLine extends React.Component {

  constructor(props) {
    super(props);
    this.componentWillMount = this.componentWillMount.bind(this);
    this.state = {
      width: this.props.width,
      data: []
    };
  }

  componentWillMount() {
    const _self = this;
    window.addEventListener('resize', function() {
      _self.updateSize();
      _self.getEndPoints();
    }, true);
    this.setState({width: this.props.width});
  }

  componentDidMount() {
    this.reloadBarData();
    this.repaintComponent();
  }

  componentWillUnmount() {
    const _self = this;
    window.removeEventListener('resize', function() {
      _self.updateSize();
    });
  }

  repaintComponent() {
    const _self = this;
    const forceResize = function(){
      _self.updateSize();
      _self.getEndPoints();
    };
    function onRepaint(callback){
      setTimeout(function(){
        window.requestAnimationFrame(callback);
      }, 0);
    }
    onRepaint(forceResize);
  }

  reloadBarData() {

  }

  updateSize(){
    let node = ReactDOM.findDOMNode(this);
    let parentWidth = node.offsetWidth;
    if (parentWidth < this.props.width) {
      this.setState({width:parentWidth});
    } else {
      this.setState({width:this.props.width});
    }
  }

  createChart(_self) {

    // Create line
    this.line = d3.svg.line()
      .x(function (d) {
        return this.props.x(d[_self.props.xData]);
      })
      .y(function (d) {
        return this.props.y(d[_self.props.yData]);
      });

    this.dataNest = d3.nest()
        .key(function(d) {return d.type;})
        .entries(this.state.data);
  }

  // returns slope, yIntercept and r-square of the line
  leastSquares(xSeries, ySeries) {
    let ls = {};

    let reduceSumFunc = function(prev, cur) { return prev + cur; };

    let xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
    let yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;

    let ssXX = xSeries.map(function(d) { return Math.pow(d - xBar, 2); })
      .reduce(reduceSumFunc);

    let ssYY = ySeries.map(function(d) { return Math.pow(d - yBar, 2); })
      .reduce(reduceSumFunc);

    let ssXY = xSeries.map(function(d, i) { return (d - xBar) * (ySeries[i] - yBar); })
      .reduce(reduceSumFunc);

    ls['slope'] = ssXY / ssXX;
    ls['yIntercept'] = yBar - (xBar * ls.slope);
    ls['rSquare'] = Math.pow(ssXY, 2) / (ssXX * ssYY);

    return ls;
  }

  getEndPoints() {
    const _self = this;
    let data = this.props.data;

    let xSeries = data.map(function (d) { return d[_self.props.xData]; });
    let ySeries = data.map(function (d) { return d[_self.props.yData]; });

    let leastSquaresCoeff = this.leastSquares(xSeries, ySeries);

    let x1 = d3.min(xSeries, function(d) { return d; });
    if (this.props.xMin) { x1 = this.props.xMin; }
    let y1 = (leastSquaresCoeff.slope * x1) + leastSquaresCoeff.yIntercept;
    let x2 = d3.max(xSeries, function(d) { return d; });
    if (this.props.xMax) { x2 = this.props.xMax; }
    let y2 = (leastSquaresCoeff.slope * x2) + leastSquaresCoeff.yIntercept;

    let trendData = [
      {
        "type": "Trend Line",
        'x':x1,
        'y':y1
      },
      {
        "type": "Trend Line",
        'x':x2,
        'y':y2
      }
    ];

    this.setState({data: trendData});
  }

  render() {

    this.createChart(this);

    const _self = this;

    let line = this.dataNest.map(function(d,i) {
      return (
        <path
          key={i}
          className="trend-line"
          d={_self.line(d.values)}
          stroke="#333333"
          opacity=".5"
          strokeWidth={3}
          strokeLinecap="round" />
      );
    });

    return (
      <g>{line}</g>
    );
  }
}

TrendLine.propTypes = {
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  data: React.PropTypes.array,
  x: React.PropTypes.func,
  y: React.PropTypes.func,
  xData: React.PropTypes.string.isRequired,
  yData: React.PropTypes.string.isRequired,
  xMin: React.PropTypes.number,
  xMax: React.PropTypes.number,
  xAxisLabel: React.PropTypes.string,
  yAxisLabel: React.PropTypes.string,
  margin: React.PropTypes.object,
  yMaxBuffer: React.PropTypes.number
};

TrendLine.defaultProps = {
  width: 1920,
  height: 400,
  xMin: -10,
  xMax: 110,
  margin: {
    top: 10,
    right: 40,
    bottom: 20,
    left: 40
  },
  yMaxBuffer: 100
};

export default TrendLine;
