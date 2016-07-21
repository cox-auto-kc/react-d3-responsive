'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';

class Grid extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.renderGrid();
  }

  componentDidUpdate() {
    this.renderGrid();
  }

  renderGrid() {
    const node = ReactDOM.findDOMNode(this);
    d3.select(node)
      .call(this.props.grid);
  }

  render(){
    let translate = "translate(0,"+(this.props.h)+")";
    return (
      <g className="y-grid" stroke={this.props.lineColor} strokeWidth={this.props.strokeWidth} transform={this.props.gridType === 'x' ? translate : ""}></g>
    );
  }
}

Grid.propTypes = {
  lineColor:React.PropTypes.string,
  strokeWidth:React.PropTypes.number,
  h:React.PropTypes.number,
  grid:React.PropTypes.func,
  gridType:React.PropTypes.oneOf(['x','y'])
};

Grid.defaultProps = {
  lineColor: '#ccc',
  strokeWidth: 1
};

export default Grid;
