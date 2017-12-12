// dimensions
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    svg_dx = 330,
    svg_dy = 500
chart_dx = svg_dx - margin.right - margin.left,
    chart_dy = svg_dy - margin.top - margin.bottom;

// data

d3.csv("data/cleaned/avg_edyears25_35.csv", function(error, data) {
    var y = "edyears_MF",
        x_jitter = d3.randomUniform(-100, 100);

    var d = d3.range(14)
        .map(function() {
            return [x_jitter(), y];
        });

/*
var y = d3.randomNormal(400, 100);
var x_jitter = d3.randomUniform(-100, 100);

var d = d3.range(750)
    .map(function() {
        return [x_jitter(), y()];
    });


d3.csv("data/cleaned/avg_edyears25_35.csv", function(error, data) {
    var xVar = "edyears_MF",
        yVar = "year";

    data.forEach(function(d) {
        d[xVar] = +d[xVar];
        d[yVar] = d[yVar];
    });
*/

// fill
var colorScale = d3.scaleLinear()
    .domain(d3.extent(d, function(d) { return d[1]; }))
    .range([0, 1]);


// y position
var yScale = d3.scaleLinear()
    .domain(d3.extent(d, function(d) { return d[1]; }))
    .range([chart_dy, margin.top]);

// y-axis
var yAxis = d3.axisLeft(yScale);

// zoom
var svg = d3.select("#discrete-jitter")
    .append("svg")
    .attr("width", svg_dx)
    .attr("height", svg_dy)
    .call(d3.zoom().on("zoom", zoom));      // ref [1]

// plot data
var circles = svg.append("g")
    .attr("id", "circles")
    .attr("transform", "translate(200, 0)")
    .selectAll("circle")
    .data(d)
    .enter()
    .append("circle")
    .attr("r", 4)
    .attr("cx", function(d) { return d[0]; })
    .attr("cy", function(d) { return yScale(d[1]); })
    .style("fill", function(d) {
        var norm_color = colorScale(d[1]);
        return d3.interpolateInferno(norm_color)
    });

// add y-axis
var y_axis = svg.append("g")
    .attr("id", "y_axis")
    .attr("transform", "translate(75,0)")
    .call(yAxis)

function zoom() {

    // re-scale y axis during zoom; ref [2]
    y_axis.transition()
        .duration(50)
        .call(yAxis.scale(d3.event.transform.rescaleY(yScale)));

    // re-draw circles using new y-axis scale; ref [3]
    var new_yScale = d3.event.transform.rescaleY(yScale);
    circles.attr("cy", function(d) { return new_yScale(d[1]); });
}

});
