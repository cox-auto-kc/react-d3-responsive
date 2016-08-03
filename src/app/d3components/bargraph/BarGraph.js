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
    };
    function onRepaint(callback){
      setTimeout(function(){
        window.requestAnimationFrame(callback);
      }, 0);
    }
    onRepaint(forceResize);
  }

  createChart(_self) {

    this.color = d3.scale.category10();

    let xLabelHeightOffset = 0;
    let yLabelWidthOffset = 0;

    if (this.props.xAxisLabel) {
      xLabelHeightOffset = 30;
    }

    if (this.props.yAxisLabel) {
      yLabelWidthOffset = 20;
    }

    // Width of graph
    this.w = this.state.width - (this.props.margin.left + this.props.margin.right + yLabelWidthOffset);

    // Height of graph
    this.h = this.props.height - (this.props.margin.top + this.props.margin.bottom + xLabelHeightOffset);

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

    this.transform = 'translate(' + (this.props.margin.left + yLabelWidthOffset) + ',' + this.props.margin.top + ')';
  }

  reloadBarData() {

    let data = this.props.data;

    this.setState({data:data});

  }

  updateSize() {
    let node = ReactDOM.findDOMNode(this);
    let parentWidth = node.offsetWidth;
    if (parentWidth < this.props.width) {
      this.setState({width:parentWidth});
    } else {
      this.setState({width:this.props.width});
    }
  }

  render(){

    this.createChart(this);

    const _self = this;

    let bars = _self.stacked.map(function(data,i) {
      let rects = data.map(function(d,j) {
        return (<rect
          x={_self.xScale(d.x)}
          y={_self.yScale(d.y + d.y0)}
          fill={_self.color(i)}
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

    let title;

    if (this.props.title) {
      title = <h3>{this.props.title}</h3>;
    }

    let axisLabels = [];

    if (this.props.xAxisLabel) {
      axisLabels.push(<AxisLabel key={0} h={this.h} w={this.w} axisLabel={this.props.yAxisLabel} axisType="y" />);
    }

    if (this.props.yAxisLabel) {
      axisLabels.push(<AxisLabel key={1} h={this.h} w={this.w} axisLabel={this.props.xAxisLabel} axisType="x" />);
    }

    let customClassName = "";

    if(this.props.chartClassName){
      customClassName = " " + this.props.chartClassName;
    }

    return (
      <div>
        {title}
        <svg className={"rd3r-chart rd3r-bar-graph" + customClassName} id={this.props.chartId} width={this.state.width} height={this.props.height}>
          <g transform={this.transform}>
            <Grid h={this.h} grid={this.yGrid} gridType="y" />
            <Axis h={this.h} axis={this.yAxis} axisType="y" />
            <Axis h={this.h} axis={this.xAxis} axisType="x" />
            {axisLabels}
            {bars}
          </g>
        </svg>
      </div>
    );
  }

}

BarGraph.propTypes = {
  title: React.PropTypes.string,
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  chartId: React.PropTypes.string,
  chartClassName: React.PropTypes.string,
  data: React.PropTypes.array.isRequired,
  xData: React.PropTypes.string.isRequired,
  xAxisLabel: React.PropTypes.string,
  yAxisLabel: React.PropTypes.string,
  keys: React.PropTypes.array.isRequired,
  margin: React.PropTypes.object
};

BarGraph.defaultProps = {
  width: 1920,
  height: 400,
  margin: {
    top: 10,
    right: 40,
    bottom: 20,
    left: 40
  }
};

export default BarGraph;
