/*eslint-disable react/no-set-state */
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';
import Axis from '../utilities/axis';
import Grid from '../utilities/grid';
import Dots from '../utilities/dataPoints';
import ToolTip from '../utilities/tooltip';

class ScatterPlot extends React.Component {

  constructor(props) {
    super(props);
    this.showToolTip = this.showToolTip.bind(this);
    this.hideToolTip = this.hideToolTip.bind(this);
    this.state = {
      tooltip: {
        display: false,
        data: {
          key: '',
          value: ''
        },
        pos:{
          x: 0,
          y: 0
        }
      },
      width: this.props.width,
      data: []
    };
  }

  componentWillMount(){
    const _self = this;
    window.addEventListener('resize', function(e) {
      _self.updateSize();
    }, true);
    _self.setState({width: _self.props.width});
  }

  componentDidMount() {
    this.updateSize();
    this.reloadBarData();
  }

  componentWillUnmount() {
    window.removeEventListener('resize');
  }

  createChart(_self) {

    this.color = d3.scale.category10();

    // Width of graph
    this.w = this.state.width - (this.props.margin.left + this.props.margin.right);
    // Height of graph
    this.h = this.props.height - (this.props.margin.top + this.props.margin.bottom);

    // X axis scale
    this.xScale = d3.time.scale()
      .domain(
        // Find min and max axis value
        d3.extent(this.state.data, function (d) {
          return d.day;
        })
      )
      // Set range from 0 to width of container
      .rangeRound([0, this.w]);

    // Y axis scale
    this.yScale = d3.scale.linear()
      .domain([
        // Find min axis value and subtract buffer
        d3.min(this.state.data,function(d){
          return d[_self.props.yData]-_self.props.yMaxBuffer;
        }),
        // Find max axis value and add buffer
        d3.max(this.state.data,function(d){
          return d[_self.props.yData]+_self.props.yMaxBuffer;
        })
      ])
      // Set range from height of container to 0
      .range([this.h, 0]);

    // Create line
    this.line = d3.svg.line()
      .x(function (d) {
        return this.xScale(d[_self.props.xData]);
      })
      .y(function (d) {
        return this.yScale(d[_self.props.yData]);
      })
      .interpolate(this.props.lineType);

    this.dataNest = d3.nest()
        .key(function(d) {return d.type;})
        .entries(this.state.data);

    this.yAxis = d3.svg.axis()
      .scale(this.yScale)
      .orient('left')
      .ticks(5);

    this.xAxis = d3.svg.axis()
      .scale(this.xScale)
      .orient('bottom')
      .ticks(Math.floor(this.w/100))
      .tickFormat(d3.time.format(this.props.xFormat));

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

    // Format date for d3 to use
    const parseDate = d3.time.format(this.props.dateFormat).parse;

    for(let i=0;i<data.length;++i) {
        let d = data[i];
        d.day = parseDate(d.day);
        data[i] = d;
    }

    this.setState({data:data});
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

  showToolTip(e){
    e.target.setAttribute('fill', '#6f8679');
    this.setState({
      tooltip: {
        display: true,
        data: {
          key: e.target.getAttribute('data-key'),
          value: e.target.getAttribute('data-value')
        },
        pos:{
          x: e.target.getAttribute('cx'),
          y: e.target.getAttribute('cy')
        }
      }
    });
  }

  hideToolTip(e){
    e.target.setAttribute('fill', '#b1bfb7');
    this.setState({
      tooltip: {
        display: false,
        data: {
          key: '',
          value: ''
        },
        pos:{
          x: 0,
          y: 0
        }
      }
    });
  }

  render(){

    this.createChart(this);

    const _self = this;
    let data = this.state.data;
    let lines;

    lines = this.dataNest.map(function (d,i) {
      return (
        <g key={i}>
          <Dots
            data={d.values}
            x={_self.xScale}
            y={_self.yScale}
            fill={_self.color(i)}
            showToolTip={_self.showToolTip}
            hideToolTip={_self.hideToolTip}
            removeFirstAndLast={false}
            xData="day"
            yData="count"
            r={5} />
          <ToolTip
            tooltip={_self.state.tooltip}
            xValue="Xtest"
            yValue="Ytest" />
        </g>
      );
    });

    return (
      <div>
        <h3>{this.props.title}</h3>
        <svg id={this.props.chartId} width={this.state.width} height={this.props.height}>
          <g transform={this.transform}>
            <Grid h={this.h} grid={this.yGrid} gridType="y" />
            <Axis h={this.h} axis={this.yAxis} axisType="y" />
            <Axis h={this.h} axis={this.xAxis} axisType="x" />
            {lines}
          </g>
        </svg>
      </div>
    );
  }

}

ScatterPlot.propTypes = {
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  chartId: React.PropTypes.string,
  title: React.PropTypes.string,
  dateFormat: React.PropTypes.string,
  xFormat: React.PropTypes.string,
  data: React.PropTypes.array.isRequired,
  xData: React.PropTypes.string.isRequired,
  yData: React.PropTypes.string.isRequired,
  lineType: React.PropTypes.string,
  strokeColor: React.PropTypes.string,
  margin: React.PropTypes.object,
  yMaxBuffer: React.PropTypes.number
};

ScatterPlot.defaultProps = {
  width: 1920,
  height: 300,
  chartId: 'chart_id',
  dateFormat:'%m-%d-%Y',
  xFormat:'%a %e',
  xData:'day',
  yData:'count',
  lineType:'linear',
  strokeColor: '#0082a1',
  margin: {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
  },
  yMaxBuffer: 100
};

export default ScatterPlot;
