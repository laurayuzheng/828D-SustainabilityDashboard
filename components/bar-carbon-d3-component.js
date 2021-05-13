const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const globalWidth = 600;
const globalHeight = 500;


// Bar graph code was adapted from: https://www.d3-graph-gallery.com/graph/barplot_button_data_hard.html
class BarCarbonD3Component extends D3Component {
  mapped_foods = [
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

  render;

  initialize(node, props) {
    var margin = {top: 30, right: 30, bottom: 90, left: 40};
    var width = globalWidth - margin.left - margin.right;
    var height = globalHeight - margin.top - margin.bottom;

    const svg = d3.select(node)
    .append('svg')
    .attr('id', 'main_graph')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

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

    // Add X axis label
    var xLabel = svg.append("text")
    .attr("class", "axis-label")
    .attr("text-anchor", "end")
    .attr("x", width/2+15)
    .attr("y", height + 75)
    .attr("font-size", "12px")
    .text("Food");

    // Add Y axis label
    var yLabel = svg.append("text")
    .attr("class", "axis-label")
    .attr("text-anchor", "end")
    .attr("x", -height/2+50)
    .attr("dy", "-2.5em")
    .attr("transform", `rotate(-90)`)
    .attr("font-size", "12px")
    .transition()
    .duration(400)
    .text("Total CO2 Emissions in Tonnes");

    // Bold axes labels
    svg.selectAll('.axis-label').style("font-weight", "bold");

    // Add bar graph title
    svg.append("text")
    .attr("x", (width / 2))             
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")  
    .style("font-size", "16px") 
    .style("font-weight", "bold")  
    .text("Total Carbon Emissions vs Food");

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

    this.render = (props) => {
      // Remove tooltip if necessary
      tooltip.style("visibility", "hidden")

      var data = this.updateCarbonData(props);

      // Update the X axis
      x.domain(data.map(function(d) { return d.food }));

      // Update the Y axis
      y.domain([0, d3.max(data, function(d) { return d.count }) ]);
      yAxis.transition().duration(1000).call(d3.axisLeft(y));

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
          .attr("fill", "#2a6592");

      rects.on("mouseover", function(d) {		
          return tooltip.html(`${d.food}: ~` + d.count + " Tonnes")	
            .style("visibility", "visible")
              .style("left", (d3.event.pageX + 20) + "px")		
              .style("top", (d3.event.pageY - 125) + "px");	
          })
        .on("mousemove", function(d){
          return tooltip
            .html(`${d.food}: ~` + (d.count > 0.0001 ? d.count.toFixed(3) : d.count.toFixed(6)) + " Tonnes")
            .style("visibility", "visible")
            .style("left",(d3.event.pageX + 20) + "px")
            .style("top", (d3.event.pageY - 125) + "px");
        })					
        .on("mouseout", function(d) {		
          return tooltip.style("visibility", "hidden")
        });

      // Reformat domain labels
      x.domain(data.map(function(d) {
        var arr = d.food.split(" ");
        var final = arr[0]
        if (arr[1] != null) {
          if (arr[1] !== '/') {
            final += (" " + arr[1])
          } else {
            final += "..."
          }
        }
        return final;
      }));
      xAxis.transition().duration(500).call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)");

      // If less group in the new dataset, I delete the ones not in use anymore
      u.exit().remove();
    };

    this.render(props);
    
  }

  update(props, oldProps) {
    this.render(props);
  }

  updateCarbonData(props) {
    const data = props.data
    const sortby = props.sortby;
    const orderby = props.orderby;
    const range = props.range;
    const carbon_foods = {
      "Beef / buffalo": "Metric 2 + 4:Total Annual Food Related Carbon Costs:(tonnes CO2):Food:Beef & buffalo meat",
      "Lamb / goat": "Metric 2 + 4:Total Annual Food Related Carbon Costs:(tonnes CO2):Food:Lamb/mutton & goat meat",
      "Pork": "Metric 2 + 4:Total Annual Food Related Carbon Costs:(tonnes CO2):Food:Pork (pig meat)",
      "Poultry (chicken, turkey, or any other bird meats)": "Metric 2 + 4:Total Annual Food Related Carbon Costs:(tonnes CO2):Food:Poultry (chicken, turkey)",
      "Fish (finfish)": "Metric 2 + 4:Total Annual Food Related Carbon Costs:(tonnes CO2):Food:Fish (finfish)",
      "Crustaceans (e.g., shrimp, prawns, crabs, lobster)": "Metric 2 + 4:Total Annual Food Related Carbon Costs:(tonnes CO2):Food:Crustaceans (shrimp/prawns)",
      "Mollusks (e.g., clams, oysters, squid, octopus)": "Metric 2 + 4:Total Annual Food Related Carbon Costs:(tonnes CO2):Food:Mollusks",
      "Butter": "Metric 2 + 4:Total Annual Food Related Carbon Costs:(tonnes CO2):Food:Butter",
      "Cheese": "Metric 2 + 4:Total Annual Food Related Carbon Costs:(tonnes CO2):Food:Cheese",
      "Ice Cream": "Metric 2 + 4:Total Annual Food Related Carbon Costs:(tonnes CO2):Food:Ice cream",
      "Cream": "Metric 2 + 4:Total Annual Food Related Carbon Costs:(tonnes CO2):Food:Cream",
      "Milk (cow's milk)": "Metric 2 + 4:Total Annual Food Related Carbon Costs:(tonnes CO2):Food:Milk (cow's milk)",
      "Yogurt": "Metric 2 + 4:Total Annual Food Related Carbon Costs:(tonnes CO2):Food:Yogurt",
      "Eggs": "Metric 2 + 4:Total Annual Food Related Carbon Costs:(tonnes CO2):Food:Eggs",
      "Potatoes": "Metric 2 + 4:Total Annual Food Related Carbon Costs:(tonnes CO2):Food:Potatoes",
      "Cassava / Other roots": "Metric 2 + 4:Total Annual Food Related Carbon Costs:(tonnes CO2):Food:Cassava and Other Roots",
      "Soybean oil": "Metric 2 + 4:Total Annual Food Related Carbon Costs:(tonnes CO2):Food:Soybeans (Oil)",
      "Palm oil": "Metric 2 + 4:Total Annual Food Related Carbon Costs:(tonnes CO2):Food:Palm (Oil)",
      "Sunflower oil": "Metric 2 + 4:Total Annual Food Related Carbon Costs:(tonnes CO2):Food:Sunflower (Oil)",
      "Rapeseed / canola oil": "Metric 2 + 4:Total Annual Food Related Carbon Costs:(tonnes CO2):Food:Rapeseed/canola (Oil)",
      "Olive oil": "Metric 2 + 4:Total Annual Food Related Carbon Costs:(tonnes CO2):Food:Olives (Oil)",
      "Beer": "Metric 2 + 4:Total Annual Food Related Carbon Costs:(tonnes CO2):Food:Barley (Beer)",
      "Wine": "Metric 2 + 4:Total Annual Food Related Carbon Costs:(tonnes CO2):Food:Wine Grapes (Wine)",
      "Sugar": "Metric 2 + 4:Total Annual Food Related Carbon Costs:(tonnes CO2):Food:Sugars and sweeteners",
      "Coffee (Ground or whole bean)": "Metric 2 + 4:Total Annual Food Related Carbon Costs:(tonnes CO2):Food:Coffee"
    };
    var final = [];
    var re = new RegExp('^' + props.search.toLowerCase() + '.*$');
    this.mapped_foods.forEach((food) => {
      if (food.toLowerCase().match(re)) {
        final.push({ food, count: 0 });
      }
    });

    final.forEach((foodElement) => {
      data.forEach((element) => {
        const carbonName = carbon_foods[foodElement['food']];
        foodElement["count"] += element[carbonName];
      });
      foodElement["food"] = foodElement["food"].replace(/\(.*\)/, '');
    });

    final = final.filter((element) => (element["count"] >= props.lowerBound && element["count"] <= props.upperBound) );

    if (orderby === "ascending") {
      final.sort((a,b) => (a[sortby] > b[sortby]) ? 1 : ((b[sortby] > a[sortby]) ? -1 : 0))
    } else {
      final.sort((a,b) => (a[sortby] > b[sortby]) ? -1 : ((b[sortby] > a[sortby]) ? 1 : 0))
    }
    return final.slice(0, range);
  }
    
}

module.exports = BarCarbonD3Component;
