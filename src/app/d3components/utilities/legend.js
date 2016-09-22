'use strict';

import React from 'react';
import d3 from 'd3';

class ChartLegend extends React.Component {

  constructor(props) {
    super(props);
  }

  createChart(_self) {

    _self.color = d3.scale.category10();

  }

  render(){

    this.createChart(this);

    const legendItems = [];
    let temp;

    this.props.data.forEach((d, i) => {
      if (temp != d.type) {
        legendItems.push(
          <span key={i}>
            <span style={{ color: this.color(i), paddingRight: '5px' }}>&#9679;</span>
            <span style={{ paddingRight: '15px' }}>{d.type}</span>
          </span>
        );
        temp = d.type;
      }
    });

    return (
      <div className="chart-legend">
        {legendItems}
      </div>
    );
  }
}

ChartLegend.propTypes = {
  data: React.PropTypes.array
};

ChartLegend.defaultProps = {
};

export default ChartLegend;
