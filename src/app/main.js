import React from 'react';
import {LineGraph, BarGraph, AreaGraph, PieChart, ScatterPlot} from './d3components';
// import rd3r from '../../lib-compiled';
// import rd3r from '../../script-compiled';

import ChartData from './d3components/testData/data.js';

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
          xDataKey="day"
          yDataKey="count"
          dateFormat="%m-%d-%Y"
          xToolTipLabel="X-TT "
          yToolTipLabel="Y-TT "
          lineType="linear"
          yMaxBuffer={50}
          data={ChartData.lineGraphData}/>

        <LineGraph
          title="Line Graph - d3 cardinal line"
          xAxisLabel="X Axis Label"
          yAxisLabel="Y Axis Label"
          xDataKey="day"
          yDataKey="count"
          dateFormat="%Y-%m-%dT%H:%M:%S.%LZ"
          lineType="cardinal"
          data={ChartData.lineGraphData4} />
        <LineGraph
          title="Line Graph - d3 cardinal line"
          xAxisLabel="X Axis Label"
          yAxisLabel="Y Axis Label"
          xDataKey="day"
          yDataKey="count"
          lineType="cardinal"
          data={ChartData.lineGraphData} />
        <LineGraph
          title="Multiple Line Graph - Date X axis"
          xDataKey="day"
          yDataKey="count"
          lineType="cardinal"
          strokeColor="#67ff67"
          xFormat="%a"
          data={ChartData.lineGraphData2} />
        <LineGraph
          title="Line Graph - Number X axis"
          xDataKey="x"
          yDataKey="y"
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
          xDataKey="day"
          yDataKey="count"
          dateFormat="%m-%d-%Y"
          xToolTipLabel="X-TT"
          yToolTipLabel="Y-TT"
          lineType="linear"
          yMaxBuffer={50}
          data={ChartData.areaGraphData} />

        <AreaGraph
          title="Area Graph"
          xDataKey="day"
          yDataKey="count"
          lineType="linear"
          fillColor="#53c79f"
          strokeColor="#67ff67"
          data={ChartData.areaGraphData} />
        <AreaGraph
          title="Area Graph - d3 cardinal line"
          xDataKey="day"
          yDataKey="count"
          lineType="cardinal"
          fillColor="#53c79f"
          strokeColor="#67ff67"
          data={ChartData.areaGraphData} />
        <AreaGraph
          title="Multiple Area Graph - d3 cardinal lines"
          xDataKey="day"
          yDataKey="count"
          lineType="cardinal"
          xFormat="%a"
          data={ChartData.areaGraphData2} />

        <ScatterPlot
          title="Scatter Plot - Date X axis"
          xDataKey="day"
          yDataKey="count"
          dataType="date"
          trendLine={true}
          data={ChartData.scatterPlotData} />
        <ScatterPlot
          title="Scatter Plot - data X axis, single trend line"
          xDataKey="x"
          yDataKey="y"
          xAxisLabel="X Axis Label"
          yAxisLabel="Y Axis Label"
          trendLine={true}
          lineNumbers="single"
          data={ChartData.scatterPlotData3}
          dataType="data" />
        <ScatterPlot
          title="Scatter Plot - data X axis, multiple trend line"
          xDataKey="x"
          yDataKey="y"
          xAxisLabel="X Axis Label"
          yAxisLabel="Y Axis Label"
          trendLine={true}
          lineNumbers="multi"
          data={ChartData.scatterPlotData3}
          dataType="data" />

        <BarGraph
          title="Bar Graph"
          xDataKey="label"
          barChartType="side"
          xAxisLabel="X Axis Label"
          yAxisLabel="Y Axis Label"
          keys={['Your Score','Month To Date','Vin Average']}
          legendValues={ChartData.soldRatiosLegend}
          data={ChartData.soldRatios} />
        <BarGraph
          title="Bar Graph"
          xDataKey="month"
          barChartType="side"
          individualSpacing={0}
          yAxisPercent={true}
          keys={['new','old','third','four']}
          legendValues={ChartData.barGraphTestData2.legend}
          data={ChartData.barGraphTestData2.data} />
        <BarGraph
          title="Bar Graph - With Axis Labels"
          xDataKey="month"
          xAxisLabel="X Axis Label"
          yAxisLabel="Y Axis Label"
          yAxisPercent={true}
          colors={["#98abc5", "#7b6888", "#a05d56", "#ff8c00"]}
          keys={['new','old','third','four']}
          legendValues={ChartData.barGraphTestData2.legend}
          data={ChartData.barGraphTestData2.data} />

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
