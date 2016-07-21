## React and D3 Charting

Modular ReactJS charts made using [d3](https://d3js.org/) chart utilities.

[![npm version](https://badge.fury.io/js/d3-react-starterkit.svg)](https://badge.fury.io/js/d3-react-starterkit)

## Usage

The latest version of d3-react-starterkit requires **React 0.14 or later**.

### NPM
Via `npm`:

```
npm install d3-react-starterkit
```

If you havn't installed `react` and `d3` then:

```
npm install react react-dom
npm install d3
```

Import into your ReactJS project one of the following ways:

```js
// es6
import d3r from 'd3-react-starterkit';

// es5
var d3r = require('d3-react-starterkit');

```
### Available Charts

```js
const LineGraph = d3r.LineGraph;
const AreaGraph = d3r.AreaGraph;
const BarGraph = d3r.BarGraph;
const PieChart = d3r.PieChart;
```

[For usage.](https://drew-thorson.github.io/d3-react-starterkit/)

### Support
Issues: [d3-react-starterkit](https://github.com/drew-thorson/d3-react-starterkit/issues) on Github

### Background
Inspired by [this blog post](http://www.adeveloperdiary.com/react-js/create-reusable-charts-react-d3-part1/) by Abhisek Jana of [A Developer Diary](http://www.adeveloperdiary.com/)

Also referencing [rd3](https://github.com/yang-wei/rd3) by Yang Wei for structure

### License
MIT

Copyright (c) 2016 Drew Thorson

