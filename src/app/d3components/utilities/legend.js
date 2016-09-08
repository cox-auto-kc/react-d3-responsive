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
    this.w = this.state.width - (this.props.margin.left + this.props.margin.right + yLabelWidthOffset);

    // Height of graph
    this.h = this.props.height - (this.props.margin.top + this.props.margin.bottom + xLabelHeightOffset);

    this.legend = d3.svg;
  }

  render(){
    return (
      <g className="chart-legend"></g>
    );
  }
}

ChartLegend.propTypes = {
  width: React.PropTypes.number,
  height: React.PropTypes.number,
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
