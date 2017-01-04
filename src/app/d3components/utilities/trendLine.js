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
    const node = ReactDOM.findDOMNode(this);
    const parentWidth = node.offsetWidth;
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
        return this.props.x(d[_self.props.xDataKey]);
      })
      .y(function (d) {
        return this.props.y(d[_self.props.yDataKey]);
      });

    this.dataNest = d3.nest()
        .key(function(d) {return d.label;})
        .entries(this.state.data);
  }

  // returns slope, yIntercept and r-square of the line
  leastSquares(xSeries, ySeries) {
    const ls = {};

    const reduceSumFunc = function(prev, cur) { return prev + cur; };

    const xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
    const yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;

    const ssXX = xSeries.map(function(d) { return Math.pow(d - xBar, 2); })
      .reduce(reduceSumFunc);

    const ssYY = ySeries.map(function(d) { return Math.pow(d - yBar, 2); })
      .reduce(reduceSumFunc);

    const ssXY = xSeries.map(function(d, i) { return (d - xBar) * (ySeries[i] - yBar); })
      .reduce(reduceSumFunc);

    ls['slope'] = ssXY / ssXX;
    ls['yIntercept'] = yBar - (xBar * ls.slope);
    ls['rSquare'] = Math.pow(ssXY, 2) / (ssXX * ssYY);

    return ls;
  }

  // extends trend line the full width of the graph
  minMaxing() {
    const _self = this;

    const minMax = {};
    const lineData = this.props.lineExtend;
    minMax['xMin'] = d3.min(lineData.map(function (d) { return d[_self.props.xDataKey]; }));
    minMax['xMax'] = d3.max(lineData.map(function (d) { return d[_self.props.xDataKey]; }));

    return minMax;
  }

  // Makes the two points needed for the trend line to graph
  getEndPoints() {
    const _self = this;
    let data;

    if(this.props.lineNumbers === 'single') {
      data = this.props.lineExtend;
    } else {
      data = this.props.data;
    }

    const xSeries = data.map(function (d) { return d[_self.props.xDataKey]; });
    const ySeries = data.map(function (d) { return d[_self.props.yDataKey]; });

    const leastSquaresCoeff = this.leastSquares(xSeries, ySeries);
    const trendExtend = this.minMaxing();

    const x1 = trendExtend.xMin;
    const y1 = (leastSquaresCoeff.slope * x1) + leastSquaresCoeff.yIntercept;
    const x2 = trendExtend.xMax;
    const y2 = (leastSquaresCoeff.slope * x2) + leastSquaresCoeff.yIntercept;

    const trendData = [
      {
        "label": "Trend Line",
        'x':x1,
        'y':y1
      },
      {
        "label": "Trend Line",
        'x':x2,
        'y':y2
      }
    ];

    this.setState({data: trendData});
  }

  render() {
    this.createChart(this);

    const _self = this;

    const line = this.dataNest.map(function(d,i) {
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
  xDataKey: React.PropTypes.string.isRequired,
  yDataKey: React.PropTypes.string.isRequired,
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
