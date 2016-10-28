'use strict';

import React from 'react';

class ChartLegend extends React.Component {

  constructor(props) {
    super(props);
  }

  render(){
    const _self = this; 
    const legendItems = [];
    const legend = [];
    
    this.props.data.forEach((d, i) => {
      if (legend.indexOf(d[_self.props.labelKey]) < 0) {
        legendItems.push(
          <span key={i} style={{display: "inline-block"}}>
            <span style={{ color: _self.props.colors(legend.length), paddingRight: '5px' }}>&#9679;</span>
            <span style={{ paddingRight: '15px' }}>{d[_self.props.labelKey]}</span>
          </span>
        );
        legend.push(d[_self.props.labelKey]);
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
  labelKey: React.PropTypes.string,
  colors: React.PropTypes.func
};

ChartLegend.defaultProps = {
  labelKey: "label"
};

export default ChartLegend;
