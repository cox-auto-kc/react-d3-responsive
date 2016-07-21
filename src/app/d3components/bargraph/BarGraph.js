/*eslint-disable react/no-set-state */
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';
import Axis from '../utilities/axis';
import AxisLabel from '../utilities/axisLabel';
import Grid from '../utilities/grid';

class BarGraph extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      width: this.props.width,
      data: []
    };
  }

  componentWillMount() {
    const _self = this;
    window.addEventListener('resize', function() {
      _self.updateSize();
    }, true);
    _self.setState({width: _self.props.width});
  }

  componentDidMount() {
    this.reloadBarData();
    this.repaintComponent();
  }

  componentWillUnmount() {
    window.removeEventListener('resize');
  }

  repaintComponent() {
    const _self = this;
    const forceResize = function(){
        _self.updateSize();
    };
    function onRepaint(callback){
      setTimeout(function(){
        window.requestAnimationFrame(callback);
      }, 0);
    }
    onRepaint(forceResize);
  }

  createChart(_self) {

    this.color = d3.scale.category20();

    // Width of graph
    this.w = this.state.width - (this.props.margin.left + this.props.margin.right);
    // Height of graph
    this.h = this.props.height - (this.props.margin.top + this.props.margin.bottom);

    this.stacked = d3.layout.stack()(_self.props.keys.map(function(key){
      return _self.state.data.map(function(d){
        return {x: d[_self.props.xData], y: d[key] };
      });
    }));

    // X axis scale
    this.xScale = d3.scale.ordinal()
        .rangeRoundBands([0, this.w], .3)
        .domain(this.stacked[0].map(function(d) { return d.x; }));

    // Y axis scale
    this.yScale = d3.scale.linear()
        .rangeRound([this.h, 0])
        .domain([0, d3.max(this.stacked[this.stacked.length - 1], function(d) { return d.y0 + d.y; })])
        .nice();

    this.yAxis = d3.svg.axis()
      .scale(this.yScale)
      .orient('left')
      .ticks(5);

    this.xAxis = d3.svg.axis()
      .scale(this.xScale)
      .orient('bottom')
      .ticks(this.state.data.length);

    this.yGrid = d3.svg.axis()
      .scale(this.yScale)
      .orient('left')
      .ticks(5)
      .tickSize(-this.w, 0, 0)
      .tickFormat("");

    this.transform = 'translate(' + this.props.margin.left + ',' + this.props.margin.top + ')';
  }

  reloadBarData() {

    let data = this.props.data;

    this.setState({data:data});

  }

  updateSize(){
    let node = ReactDOM.findDOMNode(this);
    let parentWidth = node.offsetWidth;
    if (parentWidth < this.props.width) {
      this.setState({width: parentWidth});
    } else {
      this.setState({width: this.props.width});
    }
  }

  render(){

    this.createChart(this);

    const _self = this;
    let title;

    let bars = _self.stacked.map(function(data,i) {
      let rects = data.map(function(d,j) {

        let fill = _self.color(i);

        // if (i > 0) {
        //   fill = "#e8e8e9";
        // }

        return (<rect
          x={_self.xScale(d.x)}
          y={_self.yScale(d.y + d.y0)}
          fill={fill}
          height={_self.yScale(d.y0) - _self.yScale(d.y + d.y0)}
          width={_self.xScale.rangeBand()}
          key={j}/>
        );
      });

      return (<g key={i}>
          {rects}
        </g>
      );
    });

    if (this.props.title) {
      title = <h3>{this.props.title}</h3>;
    } else {
      title = "";
    }

    return (
      <div>
        {title}
        <svg id={this.props.chartId} width={this.state.width} height={this.props.height}>
          <g transform={this.transform}>
            <Grid h={this.h} grid={this.yGrid} gridType="y" />
            <Axis h={this.h} axis={this.yAxis} axisType="y" />
            <Axis h={this.h} axis={this.xAxis} axisType="x" />
            {bars}
            <AxisLabel h={this.h} axisLabel="Visitors" axisType="y" />
          </g>
        </svg>
      </div>
    );
  }

}

BarGraph.propTypes = {
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  chartId: React.PropTypes.string,
  title: React.PropTypes.string,
  data: React.PropTypes.array.isRequired,
  xData: React.PropTypes.string.isRequired,
  keys: React.PropTypes.array.isRequired,
  margin: React.PropTypes.object
};

BarGraph.defaultProps = {
  width: 1920,
  height: 300,
  chartId: 'chart_id',
  xData:'month',
  margin: {
    top: 10,
    right: 10,
    bottom: 20,
    left: 60
  }
};

export default BarGraph;
