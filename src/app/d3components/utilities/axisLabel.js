'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';

class AxisLabel extends React.Component {

  constructor(props) {
    super(props);
  }

  render(){
    let translateLabelX = "translate("+(this.props.w/2)+","+(this.props.h-20)+")";
    let translateLabelY = "translate(-40,"+(this.props.h/2)+") rotate(270)";
    return (
      <text className="axis-label" textAnchor="middle" transform={this.props.axisType === 'y' ? translateLabelY : translateLabelX} >{this.props.axisLabel}</text>
    );
  }
}

AxisLabel.propTypes = {
  xm:React.PropTypes.number,
  w:React.PropTypes.number,
  h:React.PropTypes.number,
  axisLabel:React.PropTypes.string,
  axisType:React.PropTypes.oneOf(['x','y'])
};

export default AxisLabel;
