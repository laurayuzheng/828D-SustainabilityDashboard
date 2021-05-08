const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const globalWidth = 600;
const globalHeight = 500;


// Bar graph code was adapted from: https://www.d3-graph-gallery.com/graph/barplot_button_data_hard.html
class PieD3Component extends D3Component {
  render;

  initialize(node, props) {
    // var margin = {top: 30, right: 30, bottom: 90, left: 40};
    // var width = globalWidth - margin.left - margin.right;
    // var height = globalHeight - margin.top - margin.bottom;

    // set the dimensions and margins of the graph
    var width = 450
    var height = 450
    var margin = 40

    const svg = d3.select(node)
    .append('svg')
    .attr('id', 'main_graph')
    .attr("width", width + margin + margin)
    .attr("height", height + margin + margin)
    .append("g")
    .attr("transform", "translate(" + (600) / 2 + "," + (500) / 2 + ")");

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    var radius = Math.min(width, height) / 2 - margin

    // create 2 data_set
    var data1 = {a: 9, b: 20, c:30, d:8, e:12}
    var data2 = {a: 6, b: 16, c:20, d:14, e:19, f:12}
   
    // scheme([
    //     "fde0ddfa9fb5c51b8a",
    //     "feebe2fbb4b9f768a1ae017e",
    //     "feebe2fbb4b9f768a1c51b8a7a0177",
    //     "feebe2fcc5c0fa9fb5f768a1c51b8a7a0177",
    //     "feebe2fcc5c0fa9fb5f768a1dd3497ae017e7a0177",
    //     "fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a0177"
    //   ])

    this.render = (props) => {
        svg.selectAll("text")
        .remove();

        const data = this.updateData(props);
        var color = d3.scaleOrdinal()
        .domain(Object.keys(data))
        .range(["gold", "slateblue"])

        // Compute the position of each group on the pie:
        var pie = d3.pie()
        .value(function(d) {return d.value; })
        .sort(function(a, b) { console.log(a) ; return d3.ascending(a.key, b.key);} ) // This make sure that group order remains the same in the pie chart
        var data_ready = pie(d3.entries(data))

        // map to data
        var u = svg.selectAll("path")
        .data(data_ready)
        
        var text = svg.selectAll("text")
		.data(data_ready);


        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        var arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(radius)

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

        text
        .enter()
        .append('text')
        .transition()
        .duration(1000)
        .text(function(d){ console.log(d.data.key); return d.data.key})
        .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
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