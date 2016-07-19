/*eslint-disable react/no-set-state */
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';

class PieChart extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      width: this.props.width,
      data: []
    };
  }

  componentWillMount(){
    const _self = this;
    window.addEventListener('resize', function(e) {
      _self.updateSize();
    }, true);
    _self.setState({width: _self.props.width});
  }

  componentDidMount() {
    this.updateSize();
    this.reloadBarData();
  }

  componentWillUnmount() {
    this.serverRequest.abort();
    window.removeEventListener('resize');
  }

  createChart(_self) {

    this.color = d3.scale.category20();

    let pieHeight = _self.state.height;
    let pieWidth;
    if (_self.props.width < _self.state.width) {
      pieWidth = _self.props.width;
    } else {
      pieWidth = _self.state.width;
    }

    let diameter;
    if (pieHeight < pieWidth) {
      diameter = pieHeight;
    } else {
      diameter = pieWidth;
    }
    let radius = diameter/2;

    let outerRadius = radius;
    let innerRadius = _self.props.innerRadiusRatio ? radius/_self.props.innerRadiusRatio : 0;
    let startAngle = _self.degreesToRadians(_self.props.startAngle);
    let endAngle = _self.degreesToRadians(_self.props.endAngle);

    this.arc = d3.svg.arc()
      .outerRadius(outerRadius)
      .innerRadius(innerRadius);

    this.pie = d3.layout.pie()
      .startAngle(startAngle)
      .endAngle(endAngle)
      .value(function (d) { return d; });

    this.transform = 'translate(' + radius + ',' + radius + ')';

  }

  degreesToRadians(d) {
    return (Math.PI/180)*d;
  }

  reloadBarData() {

    let data = this.props.data;

    // Random Data
    // let dataWedges = Math.ceil((Math.random() * 5) + 2);

    // for(let i=0;i<dataWedges;++i){
    //   let d = Math.floor((Math.random() * 200));
    //   data[i] = d;
    // }

    this.setState({data:data});

  }

  updateSize(){
    let node = ReactDOM.findDOMNode(this);
    let parentWidth = node.offsetWidth;
    if (parentWidth < this.props.width) {
      this.setState({width: parentWidth});
    } else {
      this.setState({width: this.props.width});
    }
  }

  render() {
    this.createChart(this);

    const _self = this;
    let data = this.state.data;

    let wedge = _self.pie(data).map(function(d,i) {
      let fill = _self.color(i);
      let centroid = _self.arc.centroid(d);
      let labelOffset = _self.props.labelOffset;
      let label = "translate(" + centroid[0]*labelOffset +"," + centroid[1]*labelOffset + ")";

      return (
        <g key={i}>
          <path
            fill={fill}
            d={_self.arc(d)}>
          </path>
          <text
            transform={label}
            textAnchor="middle">
            {d.data}
          </text>
        </g>
      );

    });

    return(
      <div>
        <h3>{this.props.title}</h3>
        <svg id={this.props.chartId} width={this.state.width} height={this.props.height}>
          <g transform={this.transform}>
            {wedge}
          </g>
        </svg>
      </div>
    );
  }

}

PieChart.propTypes = {
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  chartId: React.PropTypes.string,
  title: React.PropTypes.string,
  data: React.PropTypes.array,
  labelOffset: React.PropTypes.number,
  startAngle: React.PropTypes.number,
  endAngle: React.PropTypes.number,
  innerRadiusRatio: React.PropTypes.number
};

PieChart.defaultProps = {
  width: 300,
  height: 300,
  data: [],
  labelOffset: 1,
  startAngle: 0,
  endAngle: 360,
  margin: {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
  }
};

export default PieChart;
