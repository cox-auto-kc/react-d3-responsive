/*eslint-disable react/no-set-state */
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';

class TrendLine extends React.Component {

  constructor(props) {
    super(props);
    this.updateSize = this.updateSize.bind(this);
    this.minMaxing = this.minMaxing.bind(this);
    this.getEndPoints = this.getEndPoints.bind(this);
    this.state = {
      width: this.props.width,
      data: []
    };
  }

  componentWillMount() {
    window.addEventListener('resize', function() {
      this.minMaxing;
      this.updateSize;
      this.getEndPoints;
    }, false);
    this.setState({width: this.props.width});
  }

  componentDidMount() {
    this.repaintComponent();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', function() {
      this.minMaxing;
      this.updateSize;
      this.getEndPoints;
    }, false);
  }

  updateSize() {
    let node = ReactDOM.findDOMNode(this);
    let parentWidth = node.offsetWidth;
    (parentWidth < this.props.width) ? 
      this.setState({width:parentWidth}) :
      this.setState({width:this.props.width});
  }

  repaintComponent() {
    const _self = this;
    const forceResize = function() {
      _self.minMaxing();
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

  // extends trend line the full width of the graph
  minMaxing() {
    const _self = this;

    let minMax = {};
    let lineData = this.props.lineExtend;
    minMax['xMin'] = d3.min(lineData.map(function (d) { return d[_self.props.xData]; }));
    minMax['xMax'] = d3.max(lineData.map(function (d) { return d[_self.props.xData]; }));

    return minMax;
  }

  // Makes the two points needed for the trend line to graph
  getEndPoints() {
    const _self = this;
    let data;

    if(this.props.lineNumbers == 'single') {
      data = this.props.lineExtend;
    } else {
      data = this.props.data;
    }

    let xSeries = data.map(function (d) { return d[_self.props.xData]; });
    let ySeries = data.map(function (d) { return d[_self.props.yData]; });

    let leastSquaresCoeff = this.leastSquares(xSeries, ySeries);
    let trendExtend = this.minMaxing();

    let x1 = trendExtend.xMin;
    let y1 = (leastSquaresCoeff.slope * x1) + leastSquaresCoeff.yIntercept;
    let x2 = trendExtend.xMax;
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
          stroke={_self.props.lineStroke}
          opacity=".4"
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
  lineStroke: React.PropTypes.string,
  lineExtend: React.PropTypes.array,
  lineNumbers: React.PropTypes.oneOf(['single','multi']),
  x: React.PropTypes.func,
  y: React.PropTypes.func,
  xData: React.PropTypes.string.isRequired,
  yData: React.PropTypes.string.isRequired,
  xAxisLabel: React.PropTypes.string,
  yAxisLabel: React.PropTypes.string,
  margin: React.PropTypes.object,
  yMaxBuffer: React.PropTypes.number
};

TrendLine.defaultProps = {
  width: 1920,
  height: 400,
  lineNumbers: 'multi',
  margin: {
    top: 10,
    right: 40,
    bottom: 20,
    left: 40
  },
  yMaxBuffer: 100
};

export default TrendLine;
