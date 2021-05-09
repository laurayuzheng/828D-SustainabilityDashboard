const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const size = 600;
const globalWidth = 600;
const globalHeight = 500;

const divisions = 3;

const carColor = "#4287f5";
const transitColor = "#f54257";
const bikeColor = "#f59c42";
const carpoolColor = "#8a42f5";
const deliveryColor = "#45d7f5";
const walkingColor = "#76e825";
const allColor = "#69b3a2";
var colorToUse = allColor;

const transportString = "What method of transportation do you primarily use to buy groceries?"
const milesString = "On average, how many miles do you travel per week to do grocery shopping?"
const carpoolString = "What percent (%) of the time do you carpool when you get groceries? Please exclude the percentage sign in your answer."

class HistogramComponent extends D3Component {
  render;

  initialize(node, props) {
    var margin = {top: 30, right: 30, bottom: 90, left: 40};
    var width = globalWidth - margin.left - margin.right;
    var height = globalHeight - margin.top - margin.bottom;


    const svg = d3.select(node)
    .append('svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

    this.render = (props) => {
      svg.selectAll("*").remove();
      let data = props.data

      let loopStr = "";
      let transportMethod = props.method;
      let miles = [];
      if (transportMethod == "All") {
        loopStr = "All"
        colorToUse = allColor
      } else if (transportMethod == "Public Transportation") {
        loopStr = "Public transportation (bus, train, etc...)" // Actual string is longer for extracting data
        colorToUse = transitColor
      } else if (transportMethod == "Bike") {
        loopStr = transportMethod 
        colorToUse = bikeColor
      } else if (transportMethod == "Car") {
        loopStr = transportMethod 
        colorToUse = carColor
      } else if (transportMethod == "Carpool") {
        loopStr = transportMethod 
        colorToUse = carpoolColor
      } else if (transportMethod == "Delivery") {
        loopStr = transportMethod 
        colorToUse = deliveryColor
      } else { // Walking
        loopStr = transportMethod
        colorToUse = walkingColor
      }

      console.log(props.method)
      data.forEach((element) => {
        if (loopStr == element[transportString] || loopStr == "All") {
          if (element[milesString] == "<1 mi") { // maybe bad fix; revise later
            miles.push(0.5)
          } else {
            miles.push(element[milesString])
          }
        }
      });
      console.log(miles)
      // X axis: scale and draw:
      var x = d3.scaleLinear()
          .domain([0, Math.max(...miles)])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
          .range([0, width]);
      svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x)
            .ticks(divisions));

      var histogram = d3.histogram()
        .value(function(d) { return d; })   // How to extract data
        .domain(x.domain())  // Domain of the graphic
        .thresholds(x.ticks(divisions)); // Numbers of bins

      var bins = histogram(miles); // Calculate the bins

      // Y axis: scale and draw:
      var y = d3.scaleLinear()
          .range([height, 0]);
      y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
      svg.append("g")
          .call(d3.axisLeft(y));

        // Add X axis label
      var xLabel = svg.append("text")
      .attr("class", "axis-label")
      .attr("text-anchor", "end")
      .attr("x", width/2+75)
      .attr("y", height+30)
      .attr("font-size", "12px")
      .text("Distance Traveled (miles)");

      // Add Y axis label
      var yLabel = svg.append("text")
      .attr("class", "axis-label")
      .attr("text-anchor", "end")
      .attr("x", -height/2+50)
      .attr("dy", "-2.5em")
      .attr("transform", `rotate(-90)`)
      .attr("font-size", "12px")
      .text("Number of Shoppers");

      // Add histogram title
      svg.append("text")
      .attr("x", (width / 2))             
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")  
      .style("font-size", "16px") 
      .style("font-weight", "bold")  
      .text("Distance Traveled to Buy Groceries");

      // Bold axes labels
      svg.selectAll('.axis-label').style("font-weight", "bold");

      // Draw rectangles for the bins of histogram
      svg.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
          .attr("x", 1)
          .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
          .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
          .attr("height", function(d) { return height - y(d.length); })
          .style("fill", colorToUse)
    };
    this.render(props)
  }

  update(props, oldProps) {
     this.render(props);
  }
}

module.exports = HistogramComponent;
