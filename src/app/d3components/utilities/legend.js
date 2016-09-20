'use strict';

import React from 'react';
import d3 from 'd3';

class ChartLegend extends React.Component {

  constructor(props) {
    super(props);
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
    this.w = this.props.width - (this.props.margin.left + this.props.margin.right + yLabelWidthOffset);

    // Height of graph
    this.h = this.props.height - (this.props.margin.top + this.props.margin.bottom + xLabelHeightOffset);

    // Height of graph
    this.h = this.props.height;

    this.transform = 'translate(0,' + this.h + ')';

  }

  render(){

    this.createChart(this);

    const legendItems = [];
    let temp;

    this.props.data.forEach((d, i) => {
      if (temp != d.type) {
        legendItems.push(
          <g key={i}>
            <circle r="5" fill="green"/>
            <text>{d.type}</text>
          </g>
        );
        temp = d.type;
      }
    });

    return (
      <g className="chart-legend" transform={this.transform}>
        {legendItems}
      </g>
    );
  }
}

ChartLegend.propTypes = {
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  data: React.PropTypes.array,
  xAxisLabel: React.PropTypes.string,
  yAxisLabel: React.PropTypes.string,
  margin: React.PropTypes.object
};

ChartLegend.defaultProps = {
  width: 1920,
  height: 400,
  margin: {
    top: 10,
    right: 40,
    bottom: 20,
    left: 40
  }
};

export default ChartLegend;
