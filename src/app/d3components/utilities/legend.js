'use strict';

import React from 'react';

const ChartLegend = ({data, labelKey, colors}) => {
  const legendItems = [];
  const legend = [];

  data.forEach((d, i) => {
    if (legend.indexOf(d[labelKey]) < 0) {
      legendItems.push(
        <span key={i} style={{display: "inline-block"}}>
          <span style={{ color: colors(legend.length), paddingRight: '5px' }}>&#9679;</span>
          <span style={{ paddingRight: '15px' }}>{d[labelKey]}</span>
        </span>
      );
      legend.push(d[labelKey]);
    }
  });

  return (
    <div className="chart-legend">
      {legendItems}
    </div>
  );
};

ChartLegend.propTypes = {
  data: React.PropTypes.array,
  labelKey: React.PropTypes.string,
  colors: React.PropTypes.func
};

ChartLegend.defaultProps = {
  labelKey: "label"
};

export default ChartLegend;
