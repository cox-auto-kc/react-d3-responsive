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

    const _self = this; 
    const legendItems = [];
    let temp;
    
    this.props.data.forEach((d, i) => {
      if (temp != d[_self.props.labelKey]) {
        legendItems.push(
          <span key={i} style={{display: "inline-block"}}>
            <span style={{ color: this.color(i), paddingRight: '5px' }}>&#9679;</span>
            <span style={{ paddingRight: '15px' }}>{d[_self.props.labelKey]}</span>
          </span>
        );
        temp = d[_self.props.labelKey];
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
  data: React.PropTypes.array,
  labelKey: React.PropTypes.string
};

ChartLegend.defaultProps = {
  labelKey: "type"
};

export default ChartLegend;
