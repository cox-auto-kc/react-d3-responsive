/*eslint-disable react/no-set-state */
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';
import Legend from '../utilities/legend';

class PieChart extends React.Component {

  constructor(props) {
    super(props);
    this.updateSize = this.updateSize.bind(this);
    this.state = {
      width: this.props.width,
      height: this.props.height,
      data: []
    };
  }

  componentWillMount() {
    window.addEventListener('resize', this.updateSize, false);
    this.setState({
      width: this.props.width,
      height: this.props.height
    });
  }

  componentDidMount() {
    this.reloadBarData();
    this.repaintComponent();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateSize, false);
  }

  updateSize() {
    let node = ReactDOM.findDOMNode(this);
    let parentWidth = node.offsetWidth;
    (parentWidth < this.props.width) ? 
      this.setState({
        width: parentWidth,
        height: parentWidth
      }) :
      this.setState({
        width: this.props.width,
        height: this.props.height
      });
  }

  repaintComponent() {
    const forceResize = this.updateSize;
    function onRepaint(callback){
      setTimeout(function(){
        window.requestAnimationFrame(callback);
      }, 0);
    }
    onRepaint(forceResize);
  }

  createChart(_self) {

    this.color = d3.scale.category10();

    let pieHeight = _self.state.height;
    let pieWidth;
    if (_self.props.width < _self.state.width) {
      pieWidth = _self.props.width;
    } else {
      pieWidth = _self.state.width;
      pieHeight = _self.props.width;
    }

    let diameter;
    if (pieHeight < pieWidth) {
      diameter = pieHeight;
    } else {
      diameter = pieWidth;
    }
    let radius = diameter/2;

    let outerRadius = radius;
    let innerRadius = _self.props.innerRadiusRatio ? radius*_self.props.innerRadiusRatio : 0;
    let startAngle = _self.degreesToRadians(_self.props.startAngle);
    let endAngle = _self.degreesToRadians(_self.props.endAngle);

    this.arc = d3.svg.arc()
      .outerRadius(outerRadius)
      .innerRadius(innerRadius);

    this.pie = d3.layout.pie()
      .startAngle(startAngle)
      .endAngle(endAngle)
      .value(function (d) { return d[_self.props.valueKey]; });

    this.transform = 'translate(' + radius + ',' + radius + ')';

  }

  degreesToRadians(d) {
    return (Math.PI/180)*d;
  }

  reloadBarData() {
    let data = this.props.data;
    this.setState({data:data});
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
          {_self.props.showLabel ? 
          <text
            transform={label}
            textAnchor="middle">
            {d.data[_self.props.valueKey]}
          </text>
          : null}
        </g>
      );
    });

    return(
      <div>
        {_self.props.title ? 
        <h3>{_self.props.title}</h3>
        : null}
        <svg id={this.props.chartId} width={this.state.width} height={this.state.height}>
          <g transform={this.transform}>
            {wedge}
          </g>
        </svg>
        {_self.props.legend ? 
        <div>
          <Legend data={_self.state.data} labelKey={_self.props.labelKey} />
        </div>
        : null}
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
  valueKey: React.PropTypes.string,
  labelKey: React.PropTypes.string,
  showLabel: React.PropTypes.bool,
  labelOffset: React.PropTypes.number,
  startAngle: React.PropTypes.number,
  endAngle: React.PropTypes.number,
  innerRadiusRatio: React.PropTypes.number,
  legend: React.PropTypes.bool
};

PieChart.defaultProps = {
  width: 300,
  height: 300,
  data: [],
  valueKey: "value",
  labelKey: "label",
  showLabel: true,
  labelOffset: 1,
  startAngle: 0,
  endAngle: 360,
  margin: {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
  },
  legend: true
};

export default PieChart;
