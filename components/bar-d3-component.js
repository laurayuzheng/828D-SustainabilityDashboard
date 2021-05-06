const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const globalWidth = 600;
const globalHeight = 500;


// Bar graph code was adapted from: https://www.d3-graph-gallery.com/graph/barplot_button_data_hard.html
class BarD3Component extends D3Component {
  render;

  initialize(node, props) {
    node.style.height = globalHeight+50;

    var margin = {top: 30, right: 30, bottom: 90, left: 60};
    var width = globalWidth - margin.left - margin.right;
    var height = globalHeight - margin.top - margin.bottom;

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

    this.render = (props) => {
      const xAttr = props.xAttr;
      const yAttr = props.yAttr;
      var data = this.updateData(props.data, props.unit, props.range);

      // Update the X axis
      x.domain(data.map(function(d) { return d.food; }));
      xAxis.transition().duration(500).call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)");

      // Update the Y axis
      y.domain([0, d3.max(data, function(d) { return d.count }) ]);
      yAxis.transition().duration(1000).call(d3.axisLeft(y));

      // Add tooltip
      var tooltip = d3.select("body")
      .append("div")
      .style("visibility", "hidden")
      .style("position", "absolute")
      .style("border-style", "solid")
      .style("border-radius", "25px")
      .style("padding", "20px")
      .style("width", "220px")
      .style("height", "auto")
      .style("background", "white");

      // Create the u variable
      var u = svg.selectAll("rect")
        .data(data);

      var rects = u.enter()
        .append("rect")
        .merge(u);

      rects.transition()
        .duration(1000)
          .attr("x", function(d) { return x(d.food); })
          .attr("y", function(d) { return y(d.count); })
          .attr("width", x.bandwidth())
          .attr("height", function(d) { return height - y(d.count); })
          .attr("fill", "#69b3a2");

      rects.on("mouseover", function(d) {		
          return tooltip.html("Total Number of food: " + d.count)	
            .style("visibility", "visible")
              .style("left", (d3.event.pageX + 20) + "px")		
              .style("top", (d3.event.pageY - 125) + "px");	
          })
        .on("mousemove", function(d){
          return tooltip
            .html("Total Number of food: " + d.count)
            .style("visibility", "visible")
            .style("left",(d3.event.pageX + 20) + "px")
            .style("top", (d3.event.pageY - 125) + "px");
        })					
        .on("mouseout", function(d) {		
          return tooltip.style("visibility", "hidden")
        });

      // If less group in the new dataset, I delete the ones not in use anymore
      u.exit().remove();
    };

    this.render(props);
    
  }

  update(props, oldProps) {
    this.render(props);
  }

  // Unit type can either be 'lbs' or 'kgs'
  updateData(data, unitType, range) {
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
    mapped_foods.forEach((food) => {
      final.push({ food, count: 0 });
    });

    final.forEach((foodElement) => {
      data.forEach((element) => {
        const units = element["What unit of weight do you prefer to answer with? This will be the unit of weight corresponding to the amount of food you purchase per week."];
        var convertedCount = element[foodElement["food"]];
        if (units === "Pounds (lbs)") {
          // Units are in lbs but we want kgs
          if (unitType === "kgs") {
            convertedCount = element[foodElement["food"]] * 0.4536
          }
        } else {
          // Units are in kgs but we want lbs
          if (unitType === "lbs") {
            convertedCount = element[foodElement["food"]] * 2.2046
          } 
        }

        foodElement["count"] += convertedCount;
      });
      foodElement["food"] = foodElement["food"].replace(/\(.*\)/, '');
    });
    final.sort((a,b) => (a.count > b.count) ? -1 : ((b.count > a.count) ? 1 : 0))
    return final.slice(0, range);
  }
    
}

module.exports = BarD3Component;
