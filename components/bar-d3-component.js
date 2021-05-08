const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const globalWidth = 600;
const globalHeight = 500;


// Bar graph code was adapted from: https://www.d3-graph-gallery.com/graph/barplot_button_data_hard.html
class BarD3Component extends D3Component {
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
    .text(`Total ${props.unit} of Food`);

    // Bold axes labels
    svg.selectAll('.axis-label').style("font-weight", "bold");

    // Add bar graph title
    svg.append("text")
    .attr("x", (width / 2))             
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")  
    .style("font-size", "16px") 
    .style("font-weight", "bold")  
    .text("Total Food Consumption by Category vs Food");

    var idleTimeout
    var idled = () => { idleTimeout = null; }

    // var updateChart = () => {
    //   var extent = d3.event.selection
    //   console.log(extent)
    //   // If no selection, back to initial coordinate. Otherwise, update X axis domain
    //   if(!extent){
    //     if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
    //     x.domain(props.data.map(function(d) { return d.food }))
    //   }else{
    //     x.domain(props.data.map(function(d) { return d.food }))
    //     // svg.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
    //   }
  
    //   // Update axis and circle position
    //   xAxis.transition().duration(1000).call(d3.axisBottom(x))
    //   // Update the Y axis
    //   y.domain([0, d3.max(props.data, function(d) { return d.count }) ]);
    //   yAxis.transition().duration(1000).call(d3.axisLeft(y));

    //   var u = svg.selectAll("rect")
    //   .data(props.data);

    //   var rects = u.enter()
    //     .append("rect")
    //     .merge(u);

    //   rects.transition()
    //     .duration(1000)
    //       .attr("x", function(d) { return x(d.food); })
    //       .attr("y", function(d) { return y(d.count); })
    //       .attr("width", x.bandwidth())
    //       .attr("height", function(d) { return height - y(d.count); })
    //       .attr("fill", "#5F9EA0");
    // };

    this.render = (props) => {
      var data = this.updateData(props);

      // Update Y label if there is a change of units
      yLabel.transition().duration(400).text(`Total ${props.unit} of Food`);

      // Update the X axis
      x.domain(data.map(function(d) { return d.food }));

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
          .attr("fill", "#5F9EA0");

      rects.on("mouseover", function(d) {		
          return tooltip.html(`${d.food}: ~` + d.count.toFixed(3) + ` ${props.unit}`)	
            .style("visibility", "visible")
              .style("left", (d3.event.pageX + 20) + "px")		
              .style("top", (d3.event.pageY - 125) + "px");	
          })
        .on("mousemove", function(d){
          return tooltip
            .html(`${d.food}: ~` + d.count.toFixed(3) + ` ${props.unit}`)
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
        if (arr[1] != null && arr[1] !== '/') {
          final += (" " + arr[1])
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

    // // Add brushing
    // var brush = d3.brushX()                     // Add the brush feature using the d3.brush function
    // .extent([[0,75], [width,height]])
    // .on("end", updateChart);       // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
  
    // d3.select("#main_graph")
    // .call(brush);
    
  }

  update(props, oldProps) {
    this.render(props);
  }

  // Unit type can either be 'lbs' or 'kgs'
  updateData(props) {
    const data = props.data
    const sortby = props.sortby;
    const orderby = props.orderby;
    const unit = props.unit;
    const range = props.range;
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
    var re = new RegExp('^' + props.search + '.*$');
    mapped_foods.forEach((food) => {
      if (food.match(re)) {
        final.push({ food, count: 0 });
      }
    });

    final.forEach((foodElement) => {
      data.forEach((element) => {
        const units = element["What unit of weight do you prefer to answer with? This will be the unit of weight corresponding to the amount of food you purchase per week."];
        var convertedCount = element[foodElement["food"]];
        if (units === "Pounds (lbs)") {
          // Units are in lbs but we want kgs
          if (unit === "kgs") {
            convertedCount = element[foodElement["food"]] * 0.4536
          }
        } else {
          // Units are in kgs but we want lbs
          if (unit === "lbs") {
            convertedCount = element[foodElement["food"]] * 2.2046
          } 
        }

        foodElement["count"] += convertedCount;
      });
      foodElement["food"] = foodElement["food"].replace(/\(.*\)/, '');
    });

    if (orderby === "ascending") {
      final.sort((a,b) => (a[sortby] > b[sortby]) ? 1 : ((b[sortby] > a[sortby]) ? -1 : 0))
    } else {
      final.sort((a,b) => (a[sortby] > b[sortby]) ? -1 : ((b[sortby] > a[sortby]) ? 1 : 0))
    }
    return final.slice(0, range);
  }
    
}

module.exports = BarD3Component;
