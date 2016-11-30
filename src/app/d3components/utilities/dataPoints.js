'use strict';

import React from 'react';
import d3 from 'd3';

class Dots extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      stroke: this.props.stroke
    };
  }

  render(){

    const _self = this;

    let data=[];

    if (this.props.removeFirstAndLast) {
        for(let i=1;i<_self.props.data.length-1;++i){
            data[i-1] = _self.props.data[i];
        }
    } else {
        data = _self.props.data;
    }

    let circles = data.map(function(d,i) {

      let xDataKeys = d[_self.props.xDataKey];

      if (xDataKeys instanceof Date) {
        xDataKeys = d3.time.format(_self.props.format)(d[_self.props.xDataKey]);
      }

      return (
        <circle
          className="data-plot-point"
          r={_self.props.r}
          cx={_self.props.x(d[_self.props.xDataKey])}
          cy={_self.props.y(d[_self.props.yDataKey])}
          fill={_self.props.fill}
          stroke={_self.props.stroke}
          strokeWidth={_self.props.strokeWidth}
          key={i}
          onMouseOver={_self.props.showToolTip}
          onMouseOut={_self.props.hideToolTip}
          data-key={xDataKeys}
          data-value={d[_self.props.yDataKey]} />
      );
    });

    return (
      <g>{circles}</g>
    );
  }
}

Dots.propTypes = {
  data: React.PropTypes.array,
  x: React.PropTypes.func,
  y: React.PropTypes.func,
  fill: React.PropTypes.string,
  stroke: React.PropTypes.string,
  strokeWidth: React.PropTypes.number,
  r: React.PropTypes.number,
  xDataKey: React.PropTypes.string.isRequired,
  yDataKey: React.PropTypes.string.isRequired,
  format: React.PropTypes.string,
  removeFirstAndLast: React.PropTypes.bool
};

Dots.defaultProps = {
  fill: "#b1bfb7",
  strokeWidth: 2,
  r: 5,
  format: '%e %b %Y'
};

export default Dots;
