'use strict';

import React from 'react';

const ToolTip = ({tooltip, bgStyle, xValue, yValue}) => {
  let opacity = 0;
  let transform = "";
  let x = 0;
  let y = 0;
  const width = 150;
  const height = 70;
  const transformText = 'translate('+width/2+','+(height/2-5)+')';
  let transformArrow = "";

  if (tooltip.display === true) {
    const position = tooltip.pos;

    x = position.x;
    y = position.y;
    opacity = 1;

    if (y > height) {
      transform = 'translate(' + (x-width/2) + ',' + (y-height-20) + ')';
      transformArrow = 'translate('+(width/2-20)+','+(height-1)+')';
    } else if (y < height) {
      transform = 'translate(' + (x-width/2) + ',' + (Math.round(y)+20) + ')';
      transformArrow = 'translate('+(width/2-20)+','+0+') rotate(180,20,0)';
    }
  }

  return (
    <g transform={transform} opacity={opacity}>
      <rect className="shadow" width={width} height={height} rx="5" ry="5" fill={bgStyle} opacity=".9"/>
      <polygon className="shadow" points="10,0  30,0  20,10" transform={transformArrow} fill={bgStyle} opacity=".9"/>
      <text transform={transformText}>
        <tspan x="0" textAnchor="middle" fontSize="15px" fill="#ffffff">{xValue + tooltip.data.key}</tspan>
        <tspan x="0" textAnchor="middle" dy="25" fontSize="20px" fill="#ffffff">{yValue + tooltip.data.value}</tspan>
      </text>
    </g>
  );
};

ToolTip.propTypes = {
  tooltip: React.PropTypes.object,
  bgStyle: React.PropTypes.string,
  // textStyle1: React.PropTypes.string,
  // textStyle2: React.PropTypes.string,
  xValue: React.PropTypes.string,
  yValue: React.PropTypes.string
};

ToolTip.defaultProps = {
  bgStyle: "#000000"
};

export default ToolTip;
