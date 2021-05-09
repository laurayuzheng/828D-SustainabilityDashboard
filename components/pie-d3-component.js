const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const globalWidth = 600;
const globalHeight = 500;


// Bar graph code was adapted from: https://www.d3-graph-gallery.com/graph/barplot_button_data_hard.html
class PieD3Component extends D3Component {
  render;

  initialize(node, props) {
    // set the dimensions and margins of the graph
    var width = 450
    var height = 450
    var margin = 40

    const svg = d3.select(node)
    .append('svg')
    .attr('id', 'main_graph')
    .attr("width", width + margin)
    .attr("height", height + margin)
    .append("g")
    .attr("transform", "translate(" + globalWidth / 2 + "," + globalHeight / 2 + ")");

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    var radius = Math.min(width, height) / 2 - margin

    this.render = (props) => {
        svg.selectAll("text")
        .remove();

        const data = this.updateData(props);
        var color = d3.scaleOrdinal()
        .domain(Object.keys(data))
        .range(["#2a6592", "#8ec3eb"])

        // Compute the position of each group on the pie:
        var pie = d3.pie()
        .value(function(d) {return d.value; })
        .sort(function(a, b) { console.log(a) ; return d3.ascending(a.key, b.key);} ) // This make sure that group order remains the same in the pie chart
        var data_ready = pie(d3.entries(data))

        // map to data
        var u = svg.selectAll("path")
        .data(data_ready)
        
        var percentageText = svg.selectAll("text")
        .data(data_ready);
        
        var nameText = svg.selectAll("text")
		.data(data_ready);


        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        var arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(radius)

        var arcGenerator2 = d3.arc()
        .innerRadius(0)
        .outerRadius(2.4*radius)

        u
        .enter()
        .append('path')
        .merge(u)
        .transition()
        .duration(500)
        .attr('d', arcGenerator)
        .attr('fill', function(d){ return(color(d.data.key)) })
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 1)

        percentageText
        .enter()
        .append('text')
        .transition()
        .duration(1000)
        .text(function(d){ return (d.data.value/props.data.length).toFixed(2)*100 + "%"})
        .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
        .style("text-anchor", "middle")
        .style("font-size", 17)
        .style("color", "white")


        nameText
        .enter()
        .append('text')
        .transition()
        .duration(1000)
        .text(function(d){ return d.data.key})
        .attr("transform", function(d) { return "translate(" + arcGenerator2.centroid(d) + ")";  })
        .style("text-anchor", "middle")
        .style("font-size", 17)
        .style("color", "white")

        // remove the group that is not present anymore
        u
        .exit()
        .remove()

    };

    this.render(props);
    
  }

  update(props, oldProps) {
    this.render(props);
  }

  updateData(props) {
    const data = props.data
    const attribute = props.attribute
    const mappedAttribute = {
        "gender": "What gender do you identify as?",
        "major": "What is your major?",
        "degree": "Are you an undergraduate or graduate student?",
        "dining": "Do you have a campus dining plan?"
    }
    var final = {};
    data.forEach((element) => {
        const answer = element[mappedAttribute[attribute]]
        if (answer in final) {
            final[answer] += 1;
        } else {
            final[answer] = 1;
        }    
    });

    return final;
  }
    
}

module.exports = PieD3Component;