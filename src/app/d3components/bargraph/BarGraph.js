'use strict';

import React from 'react';
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

    let xLabelHeightOffset = 0;
    let yLabelWidthOffset = 0;

    {this.props.xAxisLabel ? xLabelHeightOffset = 30 : null;}
    {this.props.yAxisLabel ? yLabelWidthOffset = 20 : null;}

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
        data: {
          key: e.target.getAttribute('data-key'),
          value: e.target.getAttribute('data-value')
        },
        pos:{
          x: parseInt(e.target.getAttribute('x'),10) + (parseInt(e.target.getAttribute("width"),10)/2),
          y: parseInt(e.target.getAttribute('y'),10)
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
              <ToolTip
                tooltip={_self.state.tooltip}
                bgStyle={_self.props.tooltipBgStyle}
                chartWidth={_self.state.width}
                margin={_self.props.margin}
                xAxis={_self.props.xAxisLabel ? true : false}
                xValue={_self.props.xToolTipLabel}
                yValue={_self.props.yToolTipLabel} />
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
              <ToolTip
                tooltip={_self.state.tooltip}
                bgStyle={_self.props.tooltipBgStyle}
                chartWidth={_self.state.width}
                margin={_self.props.margin}
                xAxis={_self.props.xAxisLabel ? true : false}
                xValue={_self.props.xToolTipLabel}
                yValue={_self.props.yToolTipLabel} />                
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
          </g>
        </svg>
        {this.props.legend && <Legend data={legend} labelKey={this.props.labelKey} colors={this.color} />}
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
  yAxisPercent: React.PropTypes.bool,
  xToolTipLabel: React.PropTypes.string,
  yToolTipLabel: React.PropTypes.string,
  tooltipBgStyle: React.PropTypes.string,  
  legend: React.PropTypes.bool,
  keys: React.PropTypes.array.isRequired,
  legendValues: React.PropTypes.array,
  margin: React.PropTypes.object,
  yMax: React.PropTypes.number
};

BarGraph.defaultProps = {
  width: 1920,
  height: 400,
  barChartType: "stack",
  groupSpacing: .3,
  individualSpacing: .5,
  xToolTipLabel: 'x',
  yToolTipLabel: 'y',  
  legend: true,
  labelKey: "label",
  margin: {
    top: 10,
    right: 40,
    bottom: 30,
    left: 40
  }
};

export default BarGraph;
