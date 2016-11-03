/*eslint-disable react/no-set-state */
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';
import Axis from '../utilities/axis';
import AxisLabel from '../utilities/axisLabel';
import Grid from '../utilities/grid';
import Dots from '../utilities/dataPoints';
import ToolTip from '../utilities/tooltip';
import TrendLine from '../utilities/trendLine';
import Legend from '../utilities/legend';

class ScatterPlot extends React.Component {

  constructor(props) {
    super(props);
    this.showToolTip = this.showToolTip.bind(this);
    this.hideToolTip = this.hideToolTip.bind(this);
    this.updateSize = this.updateSize.bind(this);
    this.state = {
      tooltip: {
        display: false,
        data: {
          key: '',
          value: ''
        },
        originalColor: '',
        pos:{
          x: 0,
          y: 0
        }
      },
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

    // X axis scale
    if(this.props.dataType !== 'date') {
      this.xScale = d3.scale.linear()
        .domain([
          d3.min(this.state.data,function(d){
            return d[_self.props.xDataKey];
          }),
          d3.max(this.state.data,function(d){
            return d[_self.props.xDataKey];
          })
        ])
        .range([0, this.w]);

      if(this.props.dataPercent == 'x') {
        this.xAxis = d3.svg.axis()
          .scale(this.xScale)
          .orient('bottom')
          .tickFormat( function(x) {
            return x + '%';
          });
      } else {
        this.xAxis = d3.svg.axis()
          .scale(this.xScale)
          .orient('bottom')
          .ticks(Math.floor(this.w/100));
      }
    } else {
      this.xScale = d3.time.scale()
        .domain(
          // Find min and max axis value
          d3.extent(this.state.data, function (d) {
            return d[_self.props.xDataKey];
          })
        )
        // Set range from 0 to width of container
        .rangeRound([0, this.w]);

      this.xAxis = d3.svg.axis()
        .scale(this.xScale)
        .orient('bottom')
        .ticks(Math.floor(this.w/100))
        .tickFormat(d3.time.format(this.props.xFormat));
    }

    // Y axis scale
    this.yScale = d3.scale.linear()
      .domain([
        // Find min axis value and subtract buffer
        d3.min(this.state.data,function(d){
          if (typeof _self.props.yMin === "number") {
            return _self.props.yMin;
          } else {
            return d[_self.props.yDataKey]-_self.props.yMaxBuffer;
          }
        }),
        // Find max axis value and add buffer
        d3.max(this.state.data,function(d){
          if (typeof _self.props.yMax === "number") {
            return _self.props.yMax;
          } else {
            return d[_self.props.yDataKey]+_self.props.yMaxBuffer;
          }
        })
      ])
      // Set range from height of container to 0
      .range([this.h, 0]);

    this.dataNest = d3.nest()
        .key(function(d) { return d[_self.props.labelKey]; })
        .entries(this.state.data);

    if(this.props.dataPercent == 'y') {
      this.yAxis = d3.svg.axis()
        .scale(this.yScale)
        .orient('left')
        .ticks(5)
        .tickFormat( function(x) {
          return x + '%';
        });
    } else {
      this.yAxis = d3.svg.axis()
        .scale(this.yScale)
        .orient('left')
        .ticks(5);
    }

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

    // Format date for d3 to use
    const parseDate = d3.time.format(this.props.dateFormat).parse;

    data.forEach((value, i) => {
      let d = data[i];
      if(this.props.dataType == 'date') {
        if (typeof d[this.props.xDataKey] === "string") {
          d[this.props.xDataKey] = parseDate(d[this.props.xDataKey]);
        }
        data[i] = d;
      }
    });

    this.setState({data:data});
  }

  showToolTip(e){
    this.setState({
      tooltip: {
        display: true,
        data: {
          key: e.target.getAttribute('data-key'),
          value: e.target.getAttribute('data-value')
        },
        originalColor: e.target.getAttribute('fill'),
        pos:{
          x: e.target.getAttribute('cx'),
          y: e.target.getAttribute('cy')
        }
      }
    });
    e.target.setAttribute('fill', '#6f8679');
  }

  hideToolTip(e){
    e.target.setAttribute('fill', this.state.tooltip.originalColor);
    this.setState({
      tooltip: {
        display: false,
        data: {
          key: '',
          value: ''
        },
        originalColor: '',
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
    let dataPoints;

    dataPoints = this.dataNest.map(function (d,i) {

      let trendLine = [];

      if (_self.props.trendLine) {
        trendLine.push(<TrendLine
            key={i}
            data={d.values}
            width={_self.state.width}
            x={_self.xScale}
            y={_self.yScale}
            lineStroke={_self.color(i)}
            lineExtend={_self.state.data}
            lineNumbers={_self.props.lineNumbers}
            xDataKey={_self.props.xDataKey}
            yDataKey={_self.props.yDataKey} />);
      }

      return (
        <g key={i}>
          {trendLine}
          <Dots
            data={d.values}
            x={_self.xScale}
            y={_self.yScale}
            fill={_self.color(i)}
            showToolTip={_self.showToolTip}
            hideToolTip={_self.hideToolTip}
            xDataKey={_self.props.xDataKey}
            yDataKey={_self.props.yDataKey} />
          <ToolTip
            tooltip={_self.state.tooltip}
            xValue={_self.props.xToolTipLabel}
            yValue={_self.props.yToolTipLabel} />
        </g>
      );
    });

    let customClassName = "";

    if (this.props.chartClassName) {
      customClassName = " " + this.props.chartClassName;
    }

    return (
      <div>
        {this.props.title && <h3>{this.props.title}</h3>}
        <svg className={"rd3r-chart rd3r-scatter-plot" + customClassName} id={this.props.chartId} width={this.state.width} height={this.props.height}>
          <g transform={this.transform}>
            <Grid h={this.h} grid={this.yGrid} gridType="y" />
            <Axis h={this.h} axis={this.yAxis} axisType="y" />
            <Axis h={this.h} axis={this.xAxis} axisType="x" />
            {this.props.xAxisLabel && <AxisLabel key={0} h={this.h} w={this.w} axisLabel={this.props.xAxisLabel} axisType="x" />}
            {this.props.yAxisLabel && <AxisLabel key={1} h={this.h} w={this.w} axisLabel={this.props.yAxisLabel} axisType="y" />}
            {dataPoints}
          </g>
        </svg>
        {this.props.legend && <Legend data={this.state.data} labelKey={this.props.labelKey} colors={this.color} />}
      </div>
    );
  }

}

ScatterPlot.propTypes = {
  title: React.PropTypes.string,
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  chartId: React.PropTypes.string,
  chartClassName: React.PropTypes.string,
  colors: React.PropTypes.array,
  data: React.PropTypes.array.isRequired,
  labelKey: React.PropTypes.string,
  dateFormat: React.PropTypes.string,
  dataType: React.PropTypes.string,
  dataPercent: React.PropTypes.string,
  xDataKey: React.PropTypes.string.isRequired,
  yDataKey: React.PropTypes.string.isRequired,
  xFormat: React.PropTypes.string,
  xAxisLabel: React.PropTypes.string,
  yAxisLabel: React.PropTypes.string,
  xToolTipLabel: React.PropTypes.string,
  yToolTipLabel: React.PropTypes.string,
  legend: React.PropTypes.bool,
  trendLine: React.PropTypes.bool,
  lineNumbers: React.PropTypes.oneOf(['single','multi']),
  margin: React.PropTypes.object,
  yMax: React.PropTypes.number,
  yMin: React.PropTypes.number,
  yMaxBuffer: React.PropTypes.number
};

ScatterPlot.defaultProps = {
  width: 1920,
  height: 400,
  labelKey: "label",
  dateFormat:'%m-%d-%Y',
  dataType:'date',
  xFormat:'%a %e',
  xToolTipLabel: 'x',
  yToolTipLabel: 'y',
  legend: true,
  trendLine: false,
  margin: {
    top: 10,
    right: 40,
    bottom: 20,
    left: 40
  },
  yMaxBuffer: 100
};

export default ScatterPlot;
