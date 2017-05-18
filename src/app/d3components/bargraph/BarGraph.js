'use strict';

import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';
import Axis from '../utilities/axis';
import AxisLabel from '../utilities/axisLabel';
import Grid from '../utilities/grid';
import ToolTip from '../utilities/tooltip';
import Legend from '../utilities/legend';

class BarGraph extends React.Component {

  constructor(props) {
    super(props);
    this.updateSize = this.updateSize.bind(this);
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
        },
      },
      width: this.props.width,
      height: this.props.height,
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

  updateSize = () => {
    const node = ReactDOM.findDOMNode(this);
    const parentWidth = node.offsetWidth;
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
    const tempArray = [];
    if (typeof this.props.yMax === "number") {
      tempArray.push(this.props.yMax);
    } else {
      const d = this.stacked;
      for (const i in d) {
        for (const j in d[i]) {
          if (this.props.barChartType === "side") {
            tempArray.push(d[i][j].y);
          } else {
            tempArray.push(d[i][j].y + d[i][j].y0);
          }
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

    let xLabelHeightOffset = this.props.xAxisLabel ? 30 : 0;
    let yLabelWidthOffset = this.props.yAxisLabel ? 20 : 0;

    {this.props.yAxisPercent ? yLabelWidthOffset = yLabelWidthOffset + 10 : null;}

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

    if(this.props.yAxisPercent) {
      this.yAxis = d3.svg.axis()
        .scale(this.yScale)
        .orient('left')
        .tickFormat( function(x) {
          return x + '%';
        })
        .ticks(5);
    } else {
      this.yAxis = d3.svg.axis()
        .scale(this.yScale)
        .orient('left')
        .ticks(5);
    }

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
    const data = this.props.data;
    this.setState({data:data});
  }

  showToolTip = (e) => {
    const pointColor = e.target.getAttribute('fill');
    e.target.setAttribute('fill', '#6f8679');
    this.setState({
      tooltip: {
        display: true,
        orientation: 'horizontal',
        data: {
          key: e.target.getAttribute('data-key'),
          value: e.target.getAttribute('data-value')
        },
        pos:{
          x: parseInt(e.target.getAttribute('x'),10),
          y: parseInt(e.target.getAttribute('y'),10),
          width: parseInt(e.target.getAttribute("width"),10)
        }
      },
      dataPointColor: pointColor
    });
  };

  hideToolTip = (e) => {
    e.target.setAttribute('fill', this.state.dataPointColor);
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
        },
      },
      dataPointColor: ''
    });
  };  

  render(){
    this.createChart(this);

    const _self = this;

    const bars = this.stacked.map(function(data,i) {
      let rects;
      if (_self.props.barChartType === "side") {
        rects = data.map(function(d,j) {
          return (
            <g key={j}>
              <rect
                x={_self.x0Scale(d.x)+(i*(_self.x0Scale.rangeBand() / (_self.stacked.length)))}
                y={_self.h - (_self.yScale(d.y0) - _self.yScale(d.y + d.y0))}
                fill={_self.color(i)}
                onMouseOver={_self.showToolTip}
                onMouseOut={_self.hideToolTip}
                height={_self.yScale(d.y0) - _self.yScale(d.y + d.y0)}
                width={_self.x1Scale.rangeBand()}
                data-key={_self.props.legendValues[i]}
                data-value={d.y} />
            </g>
          );
        });
      } else {
        rects = data.map(function(d,j) {
          return (
            <g key={j}>
              <rect
                x={_self.x0Scale(d.x)}
                y={_self.yScale(d.y + d.y0)}
                fill={_self.color(i)}
                onMouseOver={_self.showToolTip}
                onMouseOut={_self.hideToolTip}                
                height={_self.yScale(d.y0) - _self.yScale(d.y + d.y0)}
                width={_self.x0Scale.rangeBand()}
                data-key={_self.props.legendValues[i]}
                data-value={d.y} />           
            </g>
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
    const legendType = this.props.legendValues ? this.props.legendValues : this.props.keys;

    if(this.props.legend) {
      legendType.forEach((value, i) => {
        const legendObj = {};
        legendObj[_self.props.labelKey] = value;
        legend[i] = legendObj;
      });
    }

    return (
      <div>
        {this.props.title && <h3>{this.props.title}</h3>}
        <svg className={"rd3r-chart rd3r-bar-graph" + customClassName} id={this.props.chartId} width={this.state.width} height={this.props.height}>
          <g transform={this.transform}>
            <Grid h={this.h} grid={this.yGrid} gridType="y" />
            <Axis h={this.h} axis={this.yAxis} axisType="y" />
            <Axis h={this.h} axis={this.xAxis} axisType="x" />
            {this.props.xAxisLabel && <AxisLabel key={0} h={this.h} w={this.w} axisLabel={this.props.xAxisLabel} axisType="x" />}
            {this.props.yAxisLabel && <AxisLabel key={1} h={this.h} w={this.w} axisLabel={this.props.yAxisLabel} axisType="y" padding={this.props.yAxisPercent ? 15 : 0} />}
            {bars}
            <ToolTip
              tooltip={_self.state.tooltip}
              bgStyle={_self.props.tooltipBgStyle}
              chartWidth={_self.state.width}
              chartHeight={_self.state.height}
              margin={_self.props.margin}
              xAxis={_self.props.xAxisLabel ? true : false}
              xValue={_self.props.xToolTipLabel}
              yValue={_self.props.yToolTipLabel} />              
          </g>
        </svg>
        {this.props.legend && <Legend data={legend} labelKey={this.props.labelKey} colors={this.color} />}
      </div>
    );
  }

}

BarGraph.propTypes = {
  /** Graph title */
  title: PropTypes.string,

  /** Graph max-width */
  width: PropTypes.number,

  /** Graph height */
  height: PropTypes.number,

  /** Chart ID */
  chartId: PropTypes.string,

  /** Class name for chart */
  chartClassName: PropTypes.string,

  /** Rectangle fill colors */
  colors: PropTypes.array,

  /** Chart type (stack or side) */
  barChartType: PropTypes.oneOf(['stack','side']),

  /** Space between groups of bars */
  groupSpacing: PropTypes.number,

  /** Space between individual bars */
  individualSpacing: PropTypes.number,

  /** Data to be graphed */
  data: PropTypes.array.isRequired,

  /** Label key */
  labelKey: PropTypes.string,
  
  /** X Axis data key */
  xDataKey: PropTypes.string.isRequired,

  /** X Axis label */
  xAxisLabel: PropTypes.string,

  /** Y Axis label */
  yAxisLabel: PropTypes.string,

  /** Display Y Axis as percentage */
  yAxisPercent: PropTypes.bool,

  /** Display legend */
  legend: PropTypes.bool,

  /** Keys for values to be graphed */
  keys: PropTypes.array.isRequired,

  /** Values for legend */
  legendValues: PropTypes.array,

  /** Margin for graph */
  margin: PropTypes.object,

  /** Set Y maximum value */
  yMax: PropTypes.number
};

BarGraph.defaultProps = {
  width: 1920,
  height: 400,
  barChartType: "stack",
  groupSpacing: .3,
  individualSpacing: .5,
  xToolTipLabel: '',
  yToolTipLabel: '',  
  legend: true,
  labelKey: "label",
  legendValues: [],
  margin: {
    top: 10,
    right: 40,
    bottom: 30,
    left: 40
  }
};

export default BarGraph;
