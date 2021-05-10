const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const size = 600;
const margin = {top: 10, right: 10, bottom: 20, left: 10};
const height = 500;
const width = 500;

class Demographics extends D3Component {
    initialize(node, props) {
        var total = props.data.length;
        var gradCount = 0;
        var genderCount = 0;
        var majorCount = 0;
        var programData = [];

        props.data.forEach(d => {
            if (d['Are you an undergraduate or graduate student?'] == "Graduate") {
                gradCount = gradCount + 1;
            }

            if (d['What gender do you identify as?'] == "Male") {
                genderCount = genderCount + 1;
            }

            if (d['What is your major?'] == "Computer Science") {
                majorCount = majorCount + 1;
            }

            let temp = d['How many years are you into your program?']
            if (programData.some(year => year.name === temp)) {
                let i = programData.findIndex((obj => obj.name === temp));
                programData[i].value = programData[i].value + 1;
            }
            else {
                programData.push({name: temp, value: 1});
            }
        });

        var gradData = [{name: "Graduate", value: gradCount}, {name: "Undergraduate", value: total - gradCount}];
        var genderData = [{name: "Male", value: genderCount}, {name: "Female", value: total - genderCount}];
        var majorData = [{name: "Computer Science", value: majorCount}, {name: "Biological Sciences", value: total - majorCount}];
        programData.sort((a, b) => (a.name > b.name) ? 1 : -1);

        d3.select(node).attr('id','vis');

        const grad = d3.select(node).append('svg');

        grad
        .attr('class', 'center-container')
        .style('width', width/2 + margin.left + margin.right + 10)
        .style('height', height/2 + margin.top + margin.bottom);

        grad.append("text")
        .attr("x", (width / 4))             
        .attr("y", 20)
        .attr("text-anchor", "middle")  
        .style("font-size", "24px")
        .style("font-weight", "bold")  
        .text("Student Type");

        var xGrad = d3.scaleBand()
        .domain(d3.range(gradData.length))
        .range([margin.left, width/2 - margin.right])
        .padding(0.1)

        var yGrad = d3.scaleLinear()
        .domain([0, d3.max(gradData, d => d.value)]).nice()
        .range([height/2 - margin.bottom, margin.top])

        var graphGrad = grad.append("g")
        .attr("transform", "translate(" + (5 * margin.left) + "," + 3 * margin.top + ")");

        graphGrad.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(yGrad).ticks(Math.max.apply(Math, gradData.map(function(o) { return o.value;}))));

        graphGrad.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + (height/2 - margin.bottom) + ")")
        .call(d3.axisBottom(xGrad).tickFormat(i => gradData[i].name).tickSizeOuter(0));

        graphGrad.append("g")
        .selectAll("rect")
        .data(gradData)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xGrad(i))
        .attr("y", function(d) { return yGrad(d.value); })
        .attr("width", xGrad.bandwidth())
        .attr("height", d => yGrad(0) - yGrad(d.value))
        .attr("fill", "#69b3a2")
        .style("stroke", "grey");

        
        const gender = d3.select(node).append('svg');

        gender
        .attr('class', 'center-container')
        .style('width', width/2 + margin.left + margin.right + 10)
        .style('height', height/2 + margin.top + margin.bottom);

        gender.append("text")
        .attr("x", (width / 4))             
        .attr("y", 20)
        .attr("text-anchor", "middle")  
        .style("font-size", "24px")
        .style("font-weight", "bold")  
        .text("Gender");

        let xGender = d3.scaleBand()
        .domain(d3.range(genderData.length))
        .range([margin.left, width/2 - margin.right])
        .padding(0.1)

        let yGender = d3.scaleLinear()
        .domain([0, d3.max(genderData, d => d.value)]).nice()
        .range([height/2 - margin.bottom, margin.top])


        let graphGender = gender.append("g")
        .attr("transform", "translate(" + (5 * margin.left) + "," + 3 * margin.top + ")");

        graphGender.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(yGender));

        graphGender.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + (height/2 - margin.bottom) + ")")
        .call(d3.axisBottom(xGender).tickFormat(i => genderData[i].name).tickSizeOuter(0));

        graphGender.append("g")
        .selectAll("rect")
        .data(genderData)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xGender(i))
        .attr("y", function(d) { return yGender(d.value); })
        .attr("width", xGender.bandwidth())
        .attr("height", d => yGender(0) - yGender(d.value))
        .attr("fill", "#69b3a2")
        .style("stroke", "grey");

        const major = d3.select(node).append('svg');

        major
        .attr('class', 'center-container')
        .style('width', width/2 + margin.left + margin.right + 10)
        .style('height', height/2 + margin.top + margin.bottom);

        major.append("text")
        .attr("x", (width / 4))             
        .attr("y", 20)
        .attr("text-anchor", "middle")  
        .style("font-size", "24px")
        .style("font-weight", "bold")  
        .text("Major");

        let xMajor = d3.scaleBand()
        .domain(d3.range(majorData.length))
        .range([margin.left, width/2 - margin.right])
        .padding(0.1);

        let yMajor = d3.scaleLinear()
        .domain([0, d3.max(majorData, d => d.value)]).nice()
        .range([height/2 - margin.bottom, margin.top])

        let graphMajor = major.append("g")
        .attr("transform", "translate(" + (5 * margin.left) + "," + 3 * margin.top + ")");

        graphMajor.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(yMajor));

        graphMajor.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + (height/2 - margin.bottom) + ")")
        .call(d3.axisBottom(xMajor).tickFormat(i => majorData[i].name).tickSizeOuter(0));

        graphMajor.append("g")
        .selectAll("rect")
        .data(majorData)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xMajor(i))
        .attr("y", function(d) { return yMajor(d.value); })
        .attr("width", xMajor.bandwidth())
        .attr("height", d => yMajor(0) - yMajor(d.value))
        .attr("fill", "#69b3a2")
        .style("stroke", "grey");

        const program = d3.select(node).append('svg');

        program
        .attr('class', 'center-container')
        .style('width', width/2 + margin.left + margin.right + 10)
        .style('height', height/2 + margin.top + margin.bottom);

        program.append("text")
        .attr("x", (width / 4))             
        .attr("y", 20)
        .attr("text-anchor", "middle")  
        .style("font-size", "24px")
        .style("font-weight", "bold")  
        .text("Program Years");

        let xProgram = d3.scaleBand()
        .domain(d3.range(programData.length))
        .range([margin.left, width/2 - margin.right])
        .padding(0.1)

        let yProgram = d3.scaleLinear()
        .domain([0, d3.max(programData, d => d.value)]).nice()
        .range([height/2 - margin.bottom, margin.top])

        let graphProgram = program.append("g")
        .attr("transform", "translate(" + (5 * margin.left) + "," + 3 * margin.top + ")");

        graphProgram.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(yProgram));

        graphProgram.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + (height/2 - margin.bottom) + ")")
        .call(d3.axisBottom(xProgram).tickFormat(i => programData[i].name).tickSizeOuter(0));

        graphProgram.append("g")
        .selectAll("rect")
        .data(programData)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xProgram(i))
        .attr("y", function(d) { return yProgram(d.value); })
        .attr("width", xProgram.bandwidth())
        .attr("height", d => yProgram(0) - yProgram(d.value))
        .attr("fill", "#69b3a2")
        .style("stroke", "grey");
        
    }
    update(props, oldprops) {
        this.clearNode("vis");

        var gradData = [];
        var genderData = [];
        var majorData = [];
        var programData = [];

        var programInt = "5+"
        if (props.program != "5+" &&  props.program != "None") {
            programInt = parseInt(props.program);
        }
        console.log(programInt)

        props.data.forEach(d => {
            if ((Object.values(d).indexOf(props.school) > -1 || props.school == "None") && 
            (Object.values(d).indexOf(props.gender) > -1 || props.gender == "None") &&
            (Object.values(d).indexOf(props.major) > -1 || props.major == "None") &&
            (props.program == "None" || d['How many years are you into your program?'] == programInt)) {

                var temp = d['Are you an undergraduate or graduate student?'];
                gradData = count(temp, gradData);

                temp = d['What gender do you identify as?']
                genderData = count(temp, genderData);

                temp = d['What is your major?']
                majorData = count(temp, majorData);
    
                temp = d['How many years are you into your program?']
                programData = count(temp, programData);
            }
        });

        function count(name, struct) {
            if (struct.some(obj => obj.name === name)) {
                let i = struct.findIndex((obj => obj.name === name));
                struct[i].value = struct[i].value + 1;
            }
            else {
                struct.push({name: name, value: 1});
            }

            return struct
        }
        programData.sort((a, b) => (a.name > b.name) ? 1 : -1);
        console.log(programData)

        const grad = d3.select('#vis').append('svg');;

        grad
        .attr('class', 'center-container')
        .style('width', width/2 + margin.left + margin.right + 10)
        .style('height', height/2 + margin.top + margin.bottom);

        grad.append("text")
        .attr("x", (width / 4))             
        .attr("y", 20)
        .attr("text-anchor", "middle")  
        .style("font-size", "24px")
        .style("font-weight", "bold")  
        .text("Student Type");

        var xGrad = d3.scaleBand()
        .domain(d3.range(gradData.length))
        .range([margin.left, width/2 - margin.right])
        .padding(0.1)

        var yGrad = d3.scaleLinear()
        .domain([0, d3.max(gradData, d => d.value)]).nice()
        .range([height/2 - margin.bottom, margin.top])

        var graphGrad = grad.append("g")
        .attr("transform", "translate(" + (5 * margin.left) + "," + 3 * margin.top + ")");

        graphGrad.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(yGrad).ticks(Math.max.apply(Math, gradData.map(function(o) { return o.value;}))));

        graphGrad.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + (height/2 - margin.bottom) + ")")
        .call(d3.axisBottom(xGrad).tickFormat(i => gradData[i].name).tickSizeOuter(0));

        graphGrad.append("g")
        .selectAll("rect")
        .data(gradData)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xGrad(i))
        .attr("y", function(d) { return yGrad(d.value); })
        .attr("width", xGrad.bandwidth())
        .attr("height", d => yGrad(0) - yGrad(d.value))
        .attr("fill", "#69b3a2")
        .style("stroke", "grey");

        
        const gender = d3.select("#vis").append('svg');

        gender
        .attr('class', 'center-container')
        .style('width', width/2 + margin.left + margin.right + 10)
        .style('height', height/2 + margin.top + margin.bottom);

        gender.append("text")
        .attr("x", (width / 4))             
        .attr("y", 20)
        .attr("text-anchor", "middle")  
        .style("font-size", "24px")
        .style("font-weight", "bold")  
        .text("Gender");

        let xGender = d3.scaleBand()
        .domain(d3.range(genderData.length))
        .range([margin.left, width/2 - margin.right])
        .padding(0.1)

        let yGender = d3.scaleLinear()
        .domain([0, d3.max(genderData, d => d.value)]).nice()
        .range([height/2 - margin.bottom, margin.top])


        let graphGender = gender.append("g")
        .attr("transform", "translate(" + (5 * margin.left) + "," + 3 * margin.top + ")");

        graphGender.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(yGender).ticks(Math.max.apply(Math, genderData.map(function(o) { return o.value;}))));

        graphGender.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + (height/2 - margin.bottom) + ")")
        .call(d3.axisBottom(xGender).tickFormat(i => genderData[i].name).tickSizeOuter(0));

        graphGender.append("g")
        .selectAll("rect")
        .data(genderData)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xGender(i))
        .attr("y", function(d) { return yGender(d.value); })
        .attr("width", xGender.bandwidth())
        .attr("height", d => yGender(0) - yGender(d.value))
        .attr("fill", "#69b3a2")
        .style("stroke", "grey");

        const major = d3.select("#vis").append('svg');

        major
        .attr('class', 'center-container')
        .style('width', width/2 + margin.left + margin.right + 10)
        .style('height', height/2 + margin.top + margin.bottom);

        major.append("text")
        .attr("x", (width / 4))             
        .attr("y", 20)
        .attr("text-anchor", "middle")  
        .style("font-size", "24px")
        .style("font-weight", "bold")  
        .text("Major");

        let xMajor = d3.scaleBand()
        .domain(d3.range(majorData.length))
        .range([margin.left, width/2 - margin.right])
        .padding(0.1);

        let yMajor = d3.scaleLinear()
        .domain([0, d3.max(majorData, d => d.value)]).nice()
        .range([height/2 - margin.bottom, margin.top])

        let graphMajor = major.append("g")
        .attr("transform", "translate(" + (5 * margin.left) + "," + 3 * margin.top + ")");

        graphMajor.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(yMajor).ticks(Math.max.apply(Math, majorData.map(function(o) { return o.value;}))));

        graphMajor.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + (height/2 - margin.bottom) + ")")
        .call(d3.axisBottom(xMajor).tickFormat(i => majorData[i].name).tickSizeOuter(0));

        graphMajor.append("g")
        .selectAll("rect")
        .data(majorData)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xMajor(i))
        .attr("y", function(d) { return yMajor(d.value); })
        .attr("width", xMajor.bandwidth())
        .attr("height", d => yMajor(0) - yMajor(d.value))
        .attr("fill", "#69b3a2")
        .style("stroke", "grey");

        const program = d3.select("#vis").append('svg');

        program
        .attr('class', 'center-container')
        .style('width', width/2 + margin.left + margin.right + 10)
        .style('height', height/2 + margin.top + margin.bottom);

        program.append("text")
        .attr("x", (width / 4))             
        .attr("y", 20)
        .attr("text-anchor", "middle")  
        .style("font-size", "24px")
        .style("font-weight", "bold")  
        .text("Program Years");

        let xProgram = d3.scaleBand()
        .domain(d3.range(programData.length))
        .range([margin.left, width/2 - margin.right])
        .padding(0.1)

        let yProgram = d3.scaleLinear()
        .domain([0, d3.max(programData, d => d.value)]).nice()
        .range([height/2 - margin.bottom, margin.top])


        let graphProgram = program.append("g")
        .attr("transform", "translate(" + (5 * margin.left) + "," + 3 * margin.top + ")");

        graphProgram.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(yProgram).ticks(Math.max.apply(Math, programData.map(function(o) { return o.value;}))));

        graphProgram.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + (height/2 - margin.bottom) + ")")
        .call(d3.axisBottom(xProgram).tickFormat(i => programData[i].name).tickSizeOuter(0));

        graphProgram.append("g")
        .selectAll("rect")
        .data(programData)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xProgram(i))
        .attr("y", function(d) { return yProgram(d.value); })
        .attr("width", xProgram.bandwidth())
        .attr("height", d => yProgram(0) - yProgram(d.value))
        .attr("fill", "#69b3a2")
        .style("stroke", "grey");
    }

    clearNode(identifier) {
        const myNode = document.getElementById(identifier);
        myNode.textContent = '';
    }
}

module.exports = Demographics;