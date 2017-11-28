var margin = {top: 20, right: 20, bottom: 30, left: 300},
    width = 1300 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    padding = 1, // separation between nodes
    radius = 6;

var svg = d3.select("#discrete-scatterplot").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    //.call(d3.zoom().on("zoom", zoom));

var x = d3.scaleLinear()
    .range([0, width]);

var y = d3.scaleLinear()
    .range([height, 0]);

var color = d3.scaleOrdinal(d3.schemeCategory10);

var xAxis = d3.axisBottom()
    .scale(x);

var yAxis = d3.axisLeft()
    .scale(y);

/*
var xScale = d3.scaleLinear()
    .domain(d3.extent(d, function(d) { return d[1]; }))
    .range([height, margin.top]);
*/

/*
var controls = d3.select("#discrete-scatterplot-controls").append("label")
    .attr("id", "controls");
var checkbox = controls.append("input")
    .attr("id", "collisiondetection")
    .attr("type", "checkbox");
controls.append("span")
    .text("Collision detection");
*/

d3.csv("data/cleaned/avg_edyears25_35.csv", function(error, data) {
    var xVar = "edyears_MF",
        //yVar = d3.randomUniform(-height/2, height/2);
        yVar = "year";

    data.forEach(function(d) {
        d[xVar] = +d[xVar];
        d[yVar] = d[yVar];
    });

    var force = d3.forceSimulation()
        .nodes(data)
//        .size([width, height])
        .on("tick", tick);
//        .charge(-1)
//        .gravity(0)
//        .chargeDistance(20);

    x.domain(d3.extent(data, function(d) { return d[xVar]; })).nice();
    y.domain(d3.extent(data, function(d) { return d[yVar]; })).nice();

//    x.range([height, margin.top]

    // Set initial positions
    data.forEach(function(d) {
        d.x = x(d[xVar]);
        d.y = y(d[yVar]);
        d.color = color(d.region);
        d.radius = radius;
    });

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)

    svg.append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", height - 10)
        .style("text-anchor", "end")
        .text("Years of Educational Attainment");

    svg.append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "1em")
        .style("text-anchor", "end")
        .text("Year");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)

    var node = svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", radius)
        .attr("cx", function(d) { return x(d[xVar]); })
        .attr("cy", function(d) { return y(d[yVar]); })
        .style("fill", function(d) { return d.color; });

    var legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });

    d3.select("#collisiondetection").on("change", function() {
        force.resume();
    });

//    force.start();

    function tick(e) {
//        node.each(moveTowardDataPosition(e.alpha));

//        if (checkbox.node().checked) node.each(collide(e.alpha));

        node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    }

    function moveTowardDataPosition(alpha) {
        return function(d) {
            d.x += (x(d[xVar]) - d.x) * 0.1 * alpha;
            d.y += (y(d[yVar]) - d.y) * 0.1 * alpha;
        };
    }

    // Resolve collisions between nodes.
    function collide(alpha) {
        var quadtree = d3.geom.quadtree(data);
        return function(d) {
            var r = d.radius + radius + padding,
                nx1 = d.x - r,
                nx2 = d.x + r,
                ny1 = d.y - r,
                ny2 = d.y + r;
            quadtree.visit(function(quad, x1, y1, x2, y2) {
                if (quad.point && (quad.point !== d)) {
                    var x = d.x - quad.point.x,
                        y = d.y - quad.point.y,
                        l = Math.sqrt(x * x + y * y),
                        r = d.radius + quad.point.radius + (d.color !== quad.point.color) * padding;
                    if (l < r) {
                        l = (l - r) / l * alpha;
                        d.x -= x *= l;
                        d.y -= y *= l;
                        quad.point.x += x;
                        quad.point.y += y;
                    }
                }
                return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            });
        };
    }

    /*
    function zoom() {

        // re-scale x axis during zoom; ref [2]
        xAxis.transition()
            .duration(50)
            .call(xAxis.scale(d3.event.transform.rescaleX(xScale)));

        // re-draw circles using new x-axis scale; ref [3]
        var new_xScale = d3.event.transform.rescaleX(xScale);
        node.attr("cy", function(d) { return new_xScale(d[1]); });
    }
    */

});