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
          title="Line Graph - Date X axis"
          xAxisLabel="X Axis Label"
          yAxisLabel="Y Axis Label"
          xData="day"
          yData="count"
          xToolTipLabel="X-TT"
          yToolTipLabel="Y-TT"
          lineType="linear"
          data={ChartData.lineGraphData} />
        <LineGraph
          title="Line Graph - Date X axis"
          xAxisLabel="X Axis Label"
          yAxisLabel="Y Axis Label"
          xData="day"
          yData="count"
          lineType="cardinal"
          data={ChartData.lineGraphData} />
        <LineGraph
          title="Multiple Line Graph"
          xData="day"
          yData="count"
          lineType="cardinal"
          strokeColor="#67ff67"
          xFormat="%a"
          data={ChartData.lineGraphData2} />
        <LineGraph
          title="Line Graph - Number X axis"
          xData="x"
          yData="y"
          lineType="linear"
          dataType="data"
          dataPercent=""
          data={ChartData.lineGraphData3} />

        <AreaGraph
          title="Area Graph"
          lineType="linear"
          fillColor="#53c79f"
          strokeColor="#67ff67"
          data={ChartData.areaGraphData} />
        <AreaGraph
          title="Area Graph"
          lineType="cardinal"
          fillColor="#53c79f"
          strokeColor="#67ff67"
          data={ChartData.areaGraphData} />
        <AreaGraph
          title="Multiple Area Graph"
          lineType="cardinal"
          xFormat="%a"
          data={ChartData.areaGraphData2} />
        <ScatterPlot
          title="Scatter Plot - Date X axis"
          dataType="date"
          data={ChartData.scatterPlotData} />
        <ScatterPlot
          title="Scatter Plot - Date X axis"
          dataType="date"
          data={ChartData.scatterPlotData} />
        <ScatterPlot
          title="Scatter Plot - Number X axis"
          dataType="data"
          xData="x"
          yData="y"
          data={ChartData.scatterPlotData2} />
        <BarGraph
          title="Bar Graph"
          keys={['new','old','third','four']}
          data={ChartData.barGraphTestData} />
        <BarGraph
          title="Bar Graph"
          keys={['new','old','third','four']}
          data={ChartData.barGraphTestData} />
        <PieChart
          chartId="piechart"
          title="Pie Chart"
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
