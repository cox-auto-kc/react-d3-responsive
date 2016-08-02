## React and D3 Charting

Modular ReactJS charts made using [d3](https://d3js.org/) chart utilities.

[![npm version](https://badge.fury.io/js/d3-react-starterkit.svg)](https://badge.fury.io/js/d3-react-starterkit)

## Usage

The latest version of react-d3-responsive requires **React 0.14 or later** and **D3 3.5.17**.

### NPM
Via `npm`:

```
npm install d3-react-starterkit
```

If you havn't installed `react` and `d3` then:

```
npm install react react-dom
npm install d3@3.5.17
```

Import into your ReactJS project one of the following ways:

```js
// es6
import rd3r from 'd3-react-starterkit';

// es5
var rd3r = require('d3-react-starterkit');
```

### Available Charts

```js
const AreaGraph = rd3r.AreaGraph;
const BarGraph = rd3r.BarGraph;
const LineGraph = rd3r.LineGraph;
const PieChart = rd3r.PieChart;
const ScatterPlot = rd3r.ScatterPlot;
```

[For usage.](https://drew-thorson.github.io/d3-react-starterkit/)

### Support
Issues: [react-d3-responsive](https://github.com/cox-auto-kc/react-d3-responsive/issues) on Github

### Background
Inspired by [this blog post](http://www.adeveloperdiary.com/react-js/create-reusable-charts-react-d3-part1/) by Abhisek Jana of [A Developer Diary](http://www.adeveloperdiary.com/)

Also referencing [rd3](https://github.com/yang-wei/rd3) by Yang Wei for structure

### License
MIT

Copyright (c) 2016 Drew Thorson

