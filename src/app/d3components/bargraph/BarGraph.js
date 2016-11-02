/*eslint-disable react/no-set-state */
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';
import Axis from '../utilities/axis';
import AxisLabel from '../utilities/axisLabel';
import Grid from '../utilities/grid';
import Legend from '../utilities/legend';

class BarGraph extends React.Component {

  constructor(props) {
    super(props);
    this.updateSize = this.updateSize.bind(this);
    this.state = {
      width: this.props.width,
      data: []
    };
  }

  componentWillMount() {
    window.addEventListener('resize', this.updateSize, false);
    this.setState({width: this.props.width});
  }

  componentDidMount() {
    this.reloadBarData();
    this.repaintComponent();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateSize, false);
  }

  updateSize() {
    let node = ReactDOM.findDOMNode(this);
    let parentWidth = node.offsetWidth;
    (parentWidth < this.props.width) ? 
      this.setState({width:parentWidth}) :
      this.setState({width:this.props.width});
  }

  repaintComponent() {
    const forceResize = this.updateSize;
    function onRepaint(callback){
      setTimeout(function(){
        window.requestAnimationFrame(callback);
      }, 0);
    }
    onRepaint(forceResize);
  }

  stackType() {
    let tempArray = [];
    for (let i in this.stacked) {
      for (let j in this.stacked[i]) {
        if (this.props.barChartType === "side") {
          tempArray.push(this.stacked[i][j].y);
        } else {
          tempArray.push(this.stacked[i][j].y + this.stacked[i][j].y0);
        }
      }
    }
    return tempArray;
  }

  createChart(_self) {

    if (this.props.colors) {
      this.color = d3.scale.ordinal()
      .range(this.props.colors);
    } else {
      this.color = d3.scale.category10();
    }

    let xLabelHeightOffset = 0;
    let yLabelWidthOffset = 0;

    {this.props.xAxisLabel ? xLabelHeightOffset = 30 : null;}
    {this.props.yAxisLabel ? yLabelWidthOffset = 20 : null;}

    // Width of graph
    this.w = this.state.width - (this.props.margin.left + this.props.margin.right + yLabelWidthOffset);

    // Height of graph
    this.h = this.props.height - (this.props.margin.top + this.props.margin.bottom + xLabelHeightOffset);

    this.stacked = d3.layout.stack()(_self.props.keys.map(function(key){
      return _self.state.data.map(function(d){
        return {x: d[_self.props.xDataKey], y: d[key] };
      });
    }));

    // X0 axis scale
    this.x0Scale = d3.scale.ordinal()
        .rangeRoundBands([0, this.w], this.props.groupSpacing)
        .domain(this.stacked[0].map(function(d) { return d.x; }));

    // X1 axis scale
    this.x1Scale = d3.scale.ordinal()
        .rangeRoundBands([0, this.x0Scale.rangeBand()], this.props.individualSpacing)
        .domain(this.props.keys.map(function(d) { return d; }));

    // Y axis scale
    this.yScale = d3.scale.linear()
        .rangeRound([this.h, 0])
        .domain([0, d3.max(this.stackType())])
        .nice();

    this.yAxis = d3.svg.axis()
      .scale(this.yScale)
      .orient('left')
      .ticks(5);

    this.xAxis = d3.svg.axis()
      .scale(this.x0Scale)
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

  render(){

    this.createChart(this);

    const _self = this;

    let bars = this.stacked.map(function(data,i) {
      let rects;
      if (_self.props.barChartType === "side") {
        rects = data.map(function(d,j) {
          return (<rect
            x={_self.x0Scale(d.x)+(i*(_self.x0Scale.rangeBand() / (_self.stacked.length)))}
            y={_self.h - (_self.yScale(d.y0) - _self.yScale(d.y + d.y0))}
            fill={_self.color(i)}
            height={_self.yScale(d.y0) - _self.yScale(d.y + d.y0)}
            width={_self.x1Scale.rangeBand()}
            key={j}/>
          );
        });
      } else {
        rects = data.map(function(d,j) {
          return (<rect
            x={_self.x0Scale(d.x)}
            y={_self.yScale(d.y + d.y0)}
            fill={_self.color(i)}
            height={_self.yScale(d.y0) - _self.yScale(d.y + d.y0)}
            width={_self.x0Scale.rangeBand()}
            key={j}/>
          );
        });
      }

      return (<g key={i}>{rects}</g>);
    });

    let customClassName = "";

    if(this.props.chartClassName){
      customClassName = " " + this.props.chartClassName;
    }

    const legend = [];

    this.props.keys.forEach((value, i) => {
      const legendObj = {};
      legendObj[_self.props.labelKey] = value;
      legend[i] = legendObj;
    });

    return (
      <div>
        {this.props.title ? <h3>{this.props.title}</h3> : null}
        <svg className={"rd3r-chart rd3r-bar-graph" + customClassName} id={this.props.chartId} width={this.state.width} height={this.props.height}>
          <g transform={this.transform}>
            <Grid h={this.h} grid={this.yGrid} gridType="y" />
            <Axis h={this.h} axis={this.yAxis} axisType="y" />
            <Axis h={this.h} axis={this.xAxis} axisType="x" />
            {this.props.xAxisLabel ?
              <AxisLabel key={0} h={this.h} w={this.w} axisLabel={this.props.xAxisLabel} axisType="x" />
            : null}
            {this.props.yAxisLabel ?
              <AxisLabel key={1} h={this.h} w={this.w} axisLabel={this.props.yAxisLabel} axisType="y" />
            : null}
            {bars}
          </g>
        </svg>
        {this.props.legend ?
        <div>
          <Legend data={legend} labelKey={_self.props.labelKey} colors={_self.color} />
        </div>
        : null}
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
  colors: React.PropTypes.array,
  barChartType: React.PropTypes.oneOf(['stack','side']),
  groupSpacing: React.PropTypes.number,
  individualSpacing: React.PropTypes.number,
  data: React.PropTypes.array.isRequired,
  labelKey: React.PropTypes.string,
  xDataKey: React.PropTypes.string.isRequired,
  xAxisLabel: React.PropTypes.string,
  yAxisLabel: React.PropTypes.string,
  legend: React.PropTypes.bool,
  keys: React.PropTypes.array.isRequired,
  margin: React.PropTypes.object
};

BarGraph.defaultProps = {
  width: 1920,
  height: 400,
  barChartType: "side",
  groupSpacing: .3,
  individualSpacing: .5,
  legend: true,
  labelKey: "label",
  margin: {
    top: 10,
    right: 40,
    bottom: 20,
    left: 40
  }
};

export default BarGraph;