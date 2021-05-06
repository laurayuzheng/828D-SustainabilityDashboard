const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const globalWidth = 600;
const globalHeight = 500;


// Bar graph code was adapted from: https://www.d3-graph-gallery.com/graph/barplot_button_data_hard.html
class BoxplotD3Component extends D3Component {
  render;

  initialize(node, props) {
    console.log(props.data);
    // node.style.height = globalHeight+50;
    const data = this.updateData(props.data, "kgs");
    console.log(data);

    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = globalWidth - margin.left - margin.right,
    height = globalHeight - margin.top - margin.bottom;

    const svg = (this.svg = d3.select(node)
    .append('svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")"));

     // Show the X scale
     var x = d3.scaleBand()
     .range([ 0, width ])
     .domain(data.map(function(d) { return d.food; }))
     .paddingInner(1)
     .paddingOuter(.5)
     svg.append("g")
     .attr("transform", "translate(0," + height + ")")
     .call(d3.axisBottom(x))

     // Show the Y scale
     var y = d3.scaleLinear()
     .domain([-1,1])
     .range([height, 0])
     svg.append("g").call(d3.axisLeft(y))

    this.render = (props) => {
      
        // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
        var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
        .key(function(d) { return d.food;})
        .rollup(function(d) {
        var q1 = d3.quantile(d.map(function(g) { return g.count;}).sort(d3.ascending),.25)
        var median = d3.quantile(d.map(function(g) { return g.count;}).sort(d3.ascending),.5)
        var q3 = d3.quantile(d.map(function(g) { return g.count;}).sort(d3.ascending),.75)
        var interQuantileRange = q3 - q1
        var min = q1 - 1.5 * interQuantileRange
        var max = q3 + 1.5 * interQuantileRange
        return({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
        })
        .entries(data)

        // Show the main vertical line
        svg
        .selectAll("vertLines")
        .data(sumstat)
        .enter()
        .append("line")
        .attr("x1", function(d){return(x(d.key))})
        .attr("x2", function(d){return(x(d.key))})
        .attr("y1", function(d){return(y(d.value.min))})
        .attr("y2", function(d){return(y(d.value.max))})
        .attr("stroke", "black")
        .style("width", 40)

        // rectangle for the main box
        var boxWidth = 10
        svg
        .selectAll("boxes")
        .data(sumstat)
        .enter()
        .append("rect")
            .attr("x", function(d){return(x(d.key)-boxWidth/2)})
            .attr("y", function(d){return(y(d.value.q3))})
            .attr("height", function(d){return(y(d.value.q1)-y(d.value.q3))})
            .attr("width", boxWidth )
            .attr("stroke", "black")
            .style("fill", "#69b3a2")

        // Show the median
        svg
        .selectAll("medianLines")
        .data(sumstat)
        .enter()
        .append("line")
        .attr("x1", function(d){return(x(d.key)-boxWidth/2) })
        .attr("x2", function(d){return(x(d.key)+boxWidth/2) })
        .attr("y1", function(d){return(y(d.value.median))})
        .attr("y2", function(d){return(y(d.value.median))})
        .attr("stroke", "black")
        .style("width", 80)

        // Add individual points with jitter
        var jitterWidth = 50
        svg
        .selectAll("indPoints")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d){return(x(d.food) - jitterWidth/2 + Math.random()*jitterWidth )})
        .attr("cy", function(d){return(y(d.count))})
        .attr("r", 1)
        .style("fill", "white")
        .attr("stroke", "black")

    };

    this.render(props);
    
  }

  update(props, oldProps) {
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
    data.forEach((element) => {
        const units = element["What unit of weight do you prefer to answer with? This will be the unit of weight corresponding to the amount of food you purchase per week."];
        mapped_foods.forEach((foodName) => {
            var convertedCount = element[foodName];
            if (units === "Pounds (lbs)") {
                // Units are in lbs but we want kgs
                if (unitType === "kgs") {
                    convertedCount *= 0.4536
                }
            } else {
                // Units are in kgs but we want lbs
                if (unitType === "lbs") {
                    convertedCount *= 2.2046
                } 
            }
            foodName = foodName.replace(/\(.*\)/, '');
            final.push({food: foodName, count: convertedCount});
        });
    });
    // final.sort((a,b) => (a.count > b.count) ? -1 : ((b.count > a.count) ? 1 : 0))
    return final;
  }
    
}

module.exports = BoxplotD3Component;
