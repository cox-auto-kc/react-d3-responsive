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

  linearRegression(y,x){
    var lr = {};
    var n = y.length;
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_xx = 0;
    var sum_yy = 0;

    for (var i = 0; i < y.length; i++) {
      sum_x += x[i];
      sum_y += y[i];
      sum_xy += (x[i]*y[i]);
      sum_xx += (x[i]*x[i]);
      sum_yy += (y[i]*y[i]);
    }

    lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
    lr['intercept'] = (sum_y - lr.slope * sum_x)/n;
    lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);

    return lr;
  }

  getEndPoints() {
    const _self = this;
    let data = this.props.data;

    let xSeries = data.map(function (d) { return d[_self.props.xData]; });
    let ySeries = data.map(function (d) { return d[_self.props.yData]; });

    // let leastSquaresCoeff = this.linearRegression(ySeries, xSeries);

    let leastSquaresCoeff = this.leastSquares(xSeries, ySeries);

    console.log(leastSquaresCoeff);

    // let x1 = d3.min(xSeries, function(d) { return d; });
    // let y1 = leastSquaresCoeff.slope + leastSquaresCoeff.intercept;
    // let x2 = d3.max(xSeries, function(d) { return d; });
    // let y2 = (leastSquaresCoeff.slope * xSeries.length) + leastSquaresCoeff.intercept;

    let x1 = d3.min(xSeries, function(d) { return d; });
    let y1 = leastSquaresCoeff[0] + leastSquaresCoeff[1];
    let x2 = d3.max(xSeries, function(d) { return d; });
    let y2 = (leastSquaresCoeff[0] * xSeries.length) + leastSquaresCoeff[1];

    console.log('x1: ' + x1 + ' y1:' + y1);
    console.log('x2: ' + x2 + ' y2:' + y2);

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
      console.log(d);
      return (
        <g className="trend-line" key={i} >
          <path
            d={_self.line(d.values)}
            stroke="#333333"
            opacity=".5"
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
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  data: React.PropTypes.array,
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
  margin: {
    top: 10,
    right: 40,
    bottom: 20,
    left: 40
  },
  yMaxBuffer: 100
};

export default TrendLine;
