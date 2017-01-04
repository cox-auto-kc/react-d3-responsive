'use strict';

import React from 'react';

const AxisLabel = ({w, h, axisLabel, axisType}) => {
  const translateLabelX = "translate("+(w/2)+","+(h+40)+")";
  const translateLabelY = "translate(-40,"+(h/2)+") rotate(270)";

  return (
    <text className={axisType + "-axis-label"} textAnchor="middle" transform={axisType === 'y' ? translateLabelY : translateLabelX} >{axisLabel}</text>
  );
};

AxisLabel.propTypes = {
  w:React.PropTypes.number,
  h:React.PropTypes.number,
  axisLabel:React.PropTypes.string,
  axisType:React.PropTypes.oneOf(['x','y'])
};

export default AxisLabel;
