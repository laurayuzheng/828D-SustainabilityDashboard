const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const globalWidth = 600;

class StackedBarD3Component extends D3Component {
  render;

  initialize(node, props) {
    node.style.height = "500px";
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 20, left: 50},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    const svg = (this.svg = d3.select(node)
    .append('svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")"));

    var data = props.data;

    this.render(props.xAttr, props.yAttr);
    
  }

  update(props, oldProps) {
    this.render(props.xAttr, props.yAttr);
  }
    
}

module.exports = StackedD3Component;

// // List of subgroups = header of the csv files = soil condition here
// var subgroups = data.columns.slice(1)

// // List of groups = species here = value of the first column called group -> I show them on the X axis
// var groups = d3.map(data, function(d){return(d.group)}).keys()

// // Add X axis
// var x = d3.scaleBand()
//   .domain(groups)
//   .range([0, width])
//   .padding([0.2])
// svg.append("g")
// .attr("transform", "translate(0," + height + ")")
// .call(d3.axisBottom(x).tickSizeOuter(0));

// // Add Y axis
// var y = d3.scaleLinear()
// .domain([0, 120])
// .range([ height, 0 ]);
// svg.append("g")
// .call(d3.axisLeft(y));

// // color palette = one color per subgroup
// var color = d3.scaleOrdinal()
// .domain(subgroups)
// .range(d3.schemeSet2);

// //stack the data? --> stack per subgroup
// var stackedData = d3.stack()
// .keys(subgroups)
// (data)




// // ----------------
// // Highlight a specific subgroup when hovered
// // ----------------

// // What happens when user hover a bar
// var mouseover = function(d) {
// // what subgroup are we hovering?
// var subgroupName = d3.select(this.parentNode).datum().key; // This was the tricky part
// var subgroupValue = d.data[subgroupName];
// // Reduce opacity of all rect to 0.2
// d3.selectAll(".myRect").style("opacity", 0.2)
// // Highlight all rects of this subgroup with opacity 0.8. It is possible to select them since they have a specific class = their name.
// d3.selectAll("."+subgroupName)
//   .style("opacity", 1)
// }

// // When user do not hover anymore
// var mouseleave = function(d) {
// // Back to normal opacity: 0.8
// d3.selectAll(".myRect")
//   .style("opacity",0.8)
// }

// // Show the bars
// svg.append("g")
// .selectAll("g")
// // Enter in the stack data = loop key per key = group per group
// .data(stackedData)
// .enter().append("g")
//   .attr("fill", function(d) { return color(d.key); })
//   .attr("class", function(d){ return "myRect " + d.key }) // Add a class to each subgroup: their name
//   .selectAll("rect")
//   // enter a second time = loop subgroup per subgroup to add all rectangles
//   .data(function(d) { return d; })
//   .enter().append("rect")
//     .attr("x", function(d) { return x(d.data.group); })
//     .attr("y", function(d) { return y(d[1]); })
//     .attr("height", function(d) { return y(d[0]) - y(d[1]); })
//     .attr("width",x.bandwidth())
//     .attr("stroke", "grey")
//   .on("mouseover", mouseover)
//   .on("mouseleave", mouseleave)