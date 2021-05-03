const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const globalWidth = 600;

class BarD3Component extends D3Component {
  render;

  initialize(node, props) {
    node.style.height = "500px";

    var margin = {top: 30, right: 30, bottom: 70, left: 60};
    var width = globalWidth - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    const svg = (this.svg = d3.select(node)
    .append('svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")"));

    // Initialize the X axis
    var x = d3.scaleBand()
    .range([ 0, width ])
    .padding(0.2);
    var xAxis = svg.append("g")
    .attr("transform", "translate(0," + height + ")");

    // Initialize the Y axis
    var y = d3.scaleLinear()
    .range([ height, 0]);
    var yAxis = svg.append("g")
    .attr("class", "myYaxis");

    console.log(props.data);
    var data = props.data;

    this.render = (xAttr, yAttr) => {
      // X axis
      x.domain(data.map(function(d) { return d.Timestamp; }))
      xAxis.transition().duration(1000).call(d3.axisBottom(x))

      // Add Y axis
      y.domain([0, d3.max(data, function(d) { return +d[yAttr] }) ]);
      yAxis.transition().duration(1000).call(d3.axisLeft(y));

      // variable u: map data to existing bars
      var u = svg.selectAll("rect")
        .data(data)

      // update bars
      u.enter()
        .append("rect")
        .merge(u)
        .transition()
        .duration(1000)
          .attr("x", function(d) { return x(d[xAttr]); })
          .attr("y", function(d) { return y(d[yAttr]); })
          .attr("width", x.bandwidth())
          .attr("height", function(d) { return height - y(d[yAttr]); })
          .attr("fill", "#69b3a2")
    };

    this.render(props.xAttr, props.yAttr);
    
  }

  update(props, oldProps) {
    this.render(props.xAttr, props.yAttr);
  }
    
}

module.exports = BarD3Component;
