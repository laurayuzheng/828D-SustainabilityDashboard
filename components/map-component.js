const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const size = 600;
const globalWidth = 800;
const globalHeight = 500;

const marketStr = "What stores/markets, if any, do you typically visit to buy groceries?";

class MapComponent extends D3Component {

  initialize(node, props) {
    var margin = {top: 30, right: 30, bottom: 90, left: 40};
    var width = globalWidth ;
    var height = globalHeight;

    const svg = d3.select(node)
    .append('svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

    var projection = d3.geoMercator()
      .center([-77.2, 39.1])                // GPS of location to zoom on
      .scale(85000)                       // This is like the zoom
      .translate([ 0, 0 ])

    let data = props.data

    var shopDict = {}
    data.forEach((element) => {
        var stringOfShops = element[marketStr]
        var listOfShops = stringOfShops.split(",")
        // populate dictionary with number of shoppers per shop
        var i;
        for (i = 0; i < listOfShops.length; i++) {
          var shop = listOfShops[i]
          shop = shop.trim() // remove whitespace at ends
          if (shop == "H Mart") { // edge case
            shop = "H-mart"
          }
          shop = shop.toLowerCase() // capitalize first letter of each word
                  .split(' ')
                  .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                  .join(' ');
          var count = 0; // Store counts of # shoppers in a dictionary
            if (shop in shopDict) {
              count = shopDict[shop] + 1
              shopDict[shop] = count
            } else {
              shopDict[shop] = 1
            }
        }
      });
    for (const shop in shopDict) {
        console.log("shop: " + shop + ", count: " + shopDict[shop])
    }
    // Create data for circles:
    var markers = [
      {long: -76.94, lat: 38.98, name: "UMD Campus", size: "0", type: "Home"}, // UMD
      {long: -76.93, lat: 38.99, name: "Lidl", size: shopDict["Lidl"], type: "Shop"}, // Lidl
      {long: -76.91, lat: 39.02, name: "Aldi", size: shopDict["Aldi"], type: "Shop"}, // Aldi
      {long: -77.05, lat: 39.06, name: "H-Mart", size: shopDict["H-mart"], type: "Shop"}, // H-Mart
      {long: -77.07, lat: 39.09, name: "Lotte", size: shopDict["Lotte"], type: "Shop"}, // Lotte
      {long: -76.91, lat: 39.03, name: "Costco", size: shopDict["Costco"], type: "Shop"}, // Costco
      {long: -76.85, lat: 38.92, name: "Wegmans", size: shopDict["Wegmans"], type: "Shop"}, // Wegmans
      {long: -76.91, lat: 38.94, name: "Walmart", size: shopDict["Walmart"], type: "Shop"}, // Walmart
      {long: -76.93, lat: 38.98, name: "Target", size: shopDict["Target"], type: "Shop"}, // Target
      {long: -76.94, lat: 38.97, name: "Whole Foods", size: shopDict["Whole Foods"], type: "Shop"}, // Whole Foods
      {long: -76.91, lat: 39.00, name: "Giant", size: shopDict["Giant"], type: "Shop"}, // Giant
      {long: -76.95, lat: 38.96, name: "Safeway", size: shopDict["Safeway"], type: "Shop"}, // Safeway
      {long: -76.92, lat: 39.01, name: "Shoppers", size: shopDict["Shoppers"], type: "Shop"} // Shoppers
    ];  

    // Create a color scale
    var color = d3.scaleOrdinal()
      .domain(["Home", "Shop" ])
      .range([ "#402D54", "#8FD175"])
    // Add a scale for bubble size
    var size = d3.scaleLinear()
      .domain([-1,25])  // What's in the data
      .range([4, 50])  // Size in pixel

    // tooltip setup
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

    var mouseover = function(d) {
       return tooltip.html(d.name +  ' <br/>Latitude: ' + d.lat + '<br/>Longitude: ' + d.long 
        + '<br/>Number of Shoppers: ' + d.size)  
            .style("visibility", "visible")
              .style("left", (d3.event.pageX + 20) + "px")    
              .style("top", (d3.event.pageY - 125) + "px"); 
    }
    var mousemove = function(d) {
      return tooltip
            .html(d.name + '<br/>Latitude: ' + d.lat + '<br/>Longitude: ' + d.long 
        + '<br/>Number of Shoppers: ' + d.size)
            .style("visibility", "visible")
            .style("left",(d3.event.pageX + 20) + "px")
            .style("top", (d3.event.pageY - 125) + "px");
    }
    var mouseleave = function(d) {
      return tooltip.style("visibility", "hidden")
    }

    // Remove tooltip if necessary
    tooltip.style("visibility", "hidden")               

    d3.json("https://raw.githubusercontent.com/frankrowe/maryland-geojson/master/maryland.geojson", function(data){

      // Filter data
      data.features = data.features.filter(function(d){return d.properties.name=="Maryland"})

      // Draw the map
      svg.append("g")
          .selectAll("path")
          .data(data.features)
          .enter()
          .append("path")
            .attr("fill", "#b8b8b8")
            .attr("d", d3.geoPath()
                .projection(projection))
          .style("stroke", "black")
          .style("opacity", .3)

      svg
      .selectAll("myCircles")
      .data(markers)
      .enter()
      .append("circle")
        .attr("cx", function(d){ return projection([d.long, d.lat])[0] })
        .attr("cy", function(d){ return projection([d.long, d.lat])[1] })
        .attr("r", function(d){ return size(d.size) })
        .style("fill", function(d){ return color(d.type)})
        .style("fill", function(d){ return color(d.type)})
        .attr("stroke", function(d){ return color(d.type)})
        .attr("stroke-width", 3)
        .attr("fill-opacity", .4)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
    })
  }

  update(props, oldProps) {
  }
}

module.exports = MapComponent;
