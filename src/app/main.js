import React from 'react';
import rd3r from './d3components';
// import rd3r from '../../lib-compiled';
// import rd3r from '../../script-compiled';

const LineGraph = rd3r.LineGraph;
const AreaGraph = rd3r.AreaGraph;
const BarGraph = rd3r.BarGraph;
const PieChart = rd3r.PieChart;
const ScatterPlot = rd3r.ScatterPlot;

import ChartData from './d3components/testData/data.json';

class Main extends React.Component {
  render() {
    return (
      <div>

        <LineGraph
          title="Line Graph - 700px max width"
          width={700}
          height={500}
          chartId="custom-ID"
          chartClassName="custom-CLASS"
          xAxisLabel="X Axis Label"
          yAxisLabel="Y Axis Label"
          xData="day"
          yData="count"
          dateFormat="%m-%d-%Y"
          xToolTipLabel="X-TT"
          yToolTipLabel="Y-TT"
          lineType="linear"
          yMaxBuffer={50}
          data={ChartData.lineGraphData} />

        <LineGraph
          title="Line Graph - d3 cardinal line"
          xAxisLabel="X Axis Label"
          yAxisLabel="Y Axis Label"
          xData="day"
          yData="count"
          lineType="cardinal"
          data={ChartData.lineGraphData} />
        <LineGraph
          title="Multiple Line Graph - Date X axis"
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
          data={ChartData.lineGraphData3} />

        <AreaGraph
          title="Area Graph - 700px max width"
          width={700}
          height={500}
          chartId="custom-ID"
          chartClassName="custom-CLASS"
          xAxisLabel="X Axis Label"
          yAxisLabel="Y Axis Label"
          xData="day"
          yData="count"
          dateFormat="%m-%d-%Y"
          xToolTipLabel="X-TT"
          yToolTipLabel="Y-TT"
          lineType="linear"
          yMaxBuffer={50}
          data={ChartData.areaGraphData} />

        <AreaGraph
          title="Area Graph"
          xData="day"
          yData="count"
          lineType="linear"
          fillColor="#53c79f"
          strokeColor="#67ff67"
          data={ChartData.areaGraphData} />
        <AreaGraph
          title="Area Graph - d3 cardinal line"
          xData="day"
          yData="count"
          lineType="cardinal"
          fillColor="#53c79f"
          strokeColor="#67ff67"
          data={ChartData.areaGraphData} />
        <AreaGraph
          title="Multiple Area Graph - d3 cardinal lines"
          xData="day"
          yData="count"
          lineType="cardinal"
          xFormat="%a"
          data={ChartData.areaGraphData2} />

        <ScatterPlot
          title="Scatter Plot - Date X axis"
          xData="day"
          yData="count"
          dataType="date"
          trendLine={true}
          data={ChartData.scatterPlotData} />
        <ScatterPlot
          title="Scatter Plot - data X axis, single trend line"
          xData="x"
          yData="y"
          xAxisLabel="X Axis Label"
          yAxisLabel="Y Axis Label"
          trendLine={true}
          lineNumbers="single"
          data={ChartData.scatterPlotData3}
          dataType="data" />
        <ScatterPlot
          title="Scatter Plot - data X axis, multiple trend line"
          xData="x"
          yData="y"
          xAxisLabel="X Axis Label"
          yAxisLabel="Y Axis Label"
          trendLine={true}
          lineNumbers="multi"
          data={ChartData.scatterPlotData3}
          dataType="data" />

        <BarGraph
          title="Bar Graph"
          xData="month"
          keys={['new','old','third','four']}
          data={ChartData.barGraphTestData} />
        <BarGraph
          title="Bar Graph - With Axis Labels"
          xData="month"
          xAxisLabel="X Axis Label"
          yAxisLabel="Y Axis Label"
          keys={['new','old','third','four']}
          data={ChartData.barGraphTestData} />

        <PieChart
          title="Pie Chart"
          chartId="piechart"
          data={ChartData.pieTestData}
          innerRadiusRatio={0}
          labelOffset={1}
          startAngle={0}
          endAngle={360} />
        <PieChart
          title="Pie Chart - Different Start and End Angles"
          chartId="piechart"
          data={ChartData.pieTestData}
          innerRadiusRatio={.8}
          labelOffset={1}
          showLabel={false}
          legend={false}
          startAngle={-50}
          endAngle={154} />
      </div>
    );
  }
}

export default Main;
