'use strict';

import React from 'react';

const ToolTip = ({tooltip, bgStyle, chartWidth, margin, xAxis, xValue, yValue}) => {
  let displayType = "none";
  let transform = "";
  let x = 0;
  let xOffset = 0;
  let yOffset = 0;
  let y = 0;
  let itemWidth = 0;
  const xAxisPadding = xAxis ? 0 : 15;
  const width = 150;
  const height = 70;
  const transformText = 'translate('+width/2+','+(height/2-5)+')';
  let transformArrow = "";

  if (tooltip.display === true) {
    x = tooltip.pos.x;
    y = tooltip.pos.y;
    itemWidth = tooltip.pos.width;
    displayType = "block";

    if(margin) {
      const xPointLocation = tooltip.pos.x + (width/2) + margin.right + margin.left;
      if (xPointLocation > chartWidth) {
        xOffset = xPointLocation - chartWidth - xAxisPadding;
      } else if (tooltip.pos.x < width/2) {
        xOffset = -(width/2 - tooltip.pos.x - 15);
      }
    }

    if(tooltip.orientation === 'horizontal') {
      if (y <= height/2) yOffset = 20;
      if (x > width) {
        transform = 'translate(' + (x-width-13) + ',' + (y-height/2+yOffset) + ')';
        transformArrow = 'translate('+(width)+','+(height/2+10)+') rotate(-90,0,0)';
      } else if (x <= width) {
        transform = 'translate(' + (x+itemWidth+13) + ',' + (y-height/2+yOffset) + ')';
        transformArrow = 'translate('+(0)+','+(height/2-10)+') rotate(90,0,0)';
      }
    } else {
      if (y > height) {
        transform = 'translate(' + (x-width/2-xOffset) + ',' + (y-height-20) + ')';
        transformArrow = 'translate('+(width/2-10+xOffset)+','+(height-1)+')';
      } else if (y <= height) {
        transform = 'translate(' + (x-width/2-xOffset) + ',' + (Math.round(y)+20) + ')';
        transformArrow = 'translate('+(width/2-10+xOffset)+','+0+') rotate(180,10,0)';
      }
    }
  }

  return (
    <g transform={transform} style={{display: displayType}}>
      <rect className="shadow" width={width} height={height} rx="5" ry="5" fill={bgStyle} opacity=".9"/>
      <polygon className="shadow" points="0,0  20,0  10,10" transform={transformArrow} fill={bgStyle} opacity=".9"/>
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
  chartWidth: React.PropTypes.number,
  margin: React.PropTypes.object,
  xAxis: React.PropTypes.bool,
  xValue: React.PropTypes.string,
  yValue: React.PropTypes.string
};

ToolTip.defaultProps = {
  bgStyle: "#000000"
};

export default ToolTip;
