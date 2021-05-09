const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const globalWidth = 600;
const globalHeight = 500;


// Bubble plot: https://www.d3-graph-gallery.com/graph/bubble_tooltip.html
class ScatterplotD3Component extends D3Component {
  render;

  initialize(node, props) {
    node.style.height = globalHeight+50;

    var margin = {top: 30, right: 30, bottom: 90, left: 60};
    var width = globalWidth - margin.left - margin.right;
    var height = globalHeight - margin.top - margin.bottom;

    const svg = (this.svg = d3.select(node)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")"));

    // // Add X axis
    var x = d3.scaleLinear()
        .domain([0, 12000])
        .range([ 0, width ]);
    var xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // // Add Y axis
    var y = d3.scaleLinear()
        .domain([35, 90])
        .range([ height, 0]);
    var yAxis = svg.append("g")
        .call(d3.axisLeft(y));

    // // Add a scale for bubble size
    var z = d3.scaleLinear()
        .domain([200000, 1310000000])
        .range([ 4, 40]);

    // // Add a scale for bubble color
    var myColor = d3.scaleOrdinal()
        .domain(["Graduate", "Undergraduate"])
        // .range(d3.schemeSet2);
        .range(["gold", "blue", "green", "yellow", "black", "grey", "darkgreen", "pink", "brown", "slateblue", "grey1", "orange"]);

    // // -1- Create a tooltip div that is hidden by default:
    var tooltip = d3.select(node)
        .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "black")
            .style("border-radius", "5px")
            .style("padding", "10px")
            .style("color", "white");

    var showTooltip = function(d) {
      tooltip
        .transition()
        .duration(200)
      tooltip
        .style("opacity", 1)
        .html("Carbon Cost: " + d["Metric 2 + 4:Total Annual Food Related Carbon Costs:(tonnes CO2):Food:Total"])
        .style("left", (d3.mouse(this)[0]+30) + "px")
        .style("top", (d3.mouse(this)[1]+30) + "px")
    };

    var moveTooltip = function(d) {
      tooltip
        .style("left", (d3.mouse(this)[0]+30) + "px")
        .style("top", (d3.mouse(this)[1]+30) + "px")
    };

    var hideTooltip = function(d) {
      tooltip
        .transition()
        .duration(200)
        .style("opacity", 0)
    };

    this.render = (props) => {
      const xAttr = props.xAttr;
      const yAttr = props.yAttr;
    //   // var data = props.data;
      var data = this.updateData(props.data, props.unit);
      // console.log(d3.max(data.map(function(d) {return d.Pork})));

      // Update the X axis
    //   x.domain(data.map(function(d) { return d.food; }));
      x.domain([0, d3.max(data.map(function(d) {return d.Pork}))]);
      // console.log(data.Pork);
      xAxis.transition().duration(500).call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)");

      // Update the Y axis
      y.domain([0, d3.max(data.map(function(d) {return d.Potatoes}))]);
      yAxis.transition().duration(1000).call(d3.axisLeft(y));

      z.domain(myColor);

      var u = svg.append('g')
        .attr("class", "dotClass")
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "bubbles")
        .attr("cx", function (d) { return x(d.Pork); } )
        // .attr("cx", function (d) { return x(0.1); } )
        .attr("cy", function (d) { return y(d.Potatoes); } )
        // .attr("cy", function (d) { return y(0.1); } )
        // .attr("r", function (d) { return z(d["Metric 2 + 4:Total Annual Food Related Carbon Costs:(tonnes CO2):Food:Total"]); } )
        .attr("r", function (d) { return d["Metric 2 + 4:Total Annual Food Related Carbon Costs:(tonnes CO2):Food:Total"] * 70; } )
        .style("fill", function (d) { return myColor(d["Are you an undergraduate or graduate student?"]); } )
        // -3- Trigger the functions
        .on("mouseover", showTooltip )
        .on("mousemove", moveTooltip )
        .on("mouseleave", hideTooltip )
      
    };

    this.svg.selectAll("g.dotClass").remove();
    this.render(props);
    
  }

  update(props, oldProps) {
    this.svg.selectAll("g.dotClass").remove();
    this.render(props);
  }

  // Unit type can either be 'lbs' or 'kgs'
  updateData(data, unitType) {
    const mapped_foods = [
      "Beef / buffalo",
      "Lamb / goat",
      "Pork",
      "Poultry (chicken, turkey, or any other bird meats)", 
      "Fish (finfish)", 
      "Crustaceans (e.g., shrimp, prawns, crabs, lobster)", 
      "Mollusks (e.g., clams, oysters, squid, octopus)", 
      "Butter",
      "Cheese",
      "Ice cream", 
      "Cream", 
      "Milk (cow's milk)",
      "Yogurt", 
      "Eggs",
      "Potatoes",
      "Cassava / Other roots", 
      "Soybean oil", 
      "Palm oil", 
      "Sunflower oil",
      "Rapeseed / canola oil", 
      "Olive oil", 
      "Beer", 
      "Wine", 
      "Coffee (Ground or whole bean)", 
      "Sugar" 
    ];

    var final = [];
    // mapped_foods.forEach((food) => {
    //   final.push({ food, count: 0 });
    // });

    // console.log(data);
    
      // console.log(foodElement);
    data.forEach((element) => {
      mapped_foods.forEach((foodElement) => {
        const units = element["What unit of weight do you prefer to answer with? This will be the unit of weight corresponding to the amount of food you purchase per week."];
        // console.log(element[foodElement]);
        // var convertedCount = element[foodElement["food"]];
        if (units === "Pounds (lbs)") {
          // Units are in lbs but we want kgs
          if (unitType === "kgs") {
            element[foodElement] = element[foodElement] * 0.4536;
          }
        } else {
          // Units are in kgs but we want lbs
          if (unitType === "lbs") {
            element[foodElement] = element[foodElement] * 2.2046;
          } 
        }
      });
      final.push(element);
      // element[foodElement] = element[foodElement].replace(/\(.*\)/, '');
    });
    
    // console.log(final["Pork"]);
    return final;
  }
    
}

module.exports = ScatterplotD3Component;
// const rd3 = require('react-d3-library');

// const data = {}
// data.width = 500;
// data.height = 750;

// data.dataset = [
//     {y_value: 5.1, x_value: 3.5, type: 'type 1'},
//   {y_value : 4.9, x_value: 3.0, type: 'type 1'},
//   {y_value: 4.7, x_value: 3.2, type: 'type 2'},
//   {y_value: 4.6, x_value: 3.1, type: 'type 2'},
//   {y_value: 5.0, x_value: 3.6, type: 'type 3'},
//   {y_value: 5.4, x_value: 3.9, type: 'type 4'},
// ]

// data.margins = {top: 20, right: 10, bottom: 0, left: 10}
// data.x_axis_class = 'x';
// data.x_axis_class = 'x axis';
// data.y_axis_class = 'y';
// data.y_axis_class = 'y axis';
// data.legend = 'legend';
// data.dot_class = 'dot';
// data.label = 'label';



// // Display names to run along x and y axis
// data.x_display_name = 'X VALUE';
// data.y_display_name = 'Y VALUE';