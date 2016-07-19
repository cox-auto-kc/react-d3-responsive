import React from 'react';
import d3r from './d3components';
// import d3r from '../../lib-compiled';
// import d3r from '../../script-compiled';

const LineGraph = d3r.LineGraph;
const AreaGraph = d3r.AreaGraph;
const BarGraph = d3r.BarGraph;
const PieChart = d3r.PieChart;
const ScatterPlot = d3r.ScatterPlot;

import ChartData from './d3components/testData/data.json';

class Main extends React.Component {
  render() {
    return (
      <div>
        <LineGraph
          title="Line Graph"
          lineType="linear"
          data={ChartData.lineGraphData} />
        <LineGraph
          title="Multiple Line Graph"
          lineType="cardinal"
          strokeColor="#67ff67"
          xFormat="%a"
          data={ChartData.lineGraphData2} />
        <AreaGraph
          title="Area Graph"
          lineType="linear"
          fillColor="#53c79f"
          strokeColor="#67ff67"
          data={ChartData.areaGraphData2} />
        <AreaGraph
          title="Area Graph"
          lineType="cardinal"
          data={ChartData.areaGraphData} />
        <ScatterPlot
          title="Scatter Plot"
          lineType="cardinal"
          data={ChartData.scatterPlotData} />
        <BarGraph
          lineType="linear"
          keys={['new','old','third','four']} />
        <PieChart
          chartId="piechart"
          title="PieChart"
          data={ChartData.pieTestData}
          innerRadiusRatio={2}
          labelOffset={1}
          startAngle={0}
          endAngle={360} />
      </div>
    );
  }
}

export default Main;
