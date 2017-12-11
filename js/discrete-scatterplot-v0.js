var margin = {top: 70, right: 20, bottom: 30, left: 300},
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

var formatNumber = d3.format("d");

tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var x = d3.scaleLinear()
    .range([0, width]);

var y = d3.scaleLinear()
    .range([height, 0]);

var color = d3.scaleOrdinal(d3.schemeCategory10);

var xAxis = d3.axisBottom()
    .scale(x);

var yAxis = d3.axisLeft()
    .scale(y)
    .tickFormat(d3.format("d"));





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

loadData();

Object.defineProperty(window, 'data', {
    // data getter
    get: function() { return _data; },
    // data setter
    set: function(value) {
        _data = value;
        // update the visualization each time the data property is set by using the equal sign (e.g. data = [])
        updateVis()
    }
});

d3.select("#ranking-type").on("change", updateVis);

function loadData() {
    d3.csv("data/cleaned/avg_edyears25_35.csv", function(error, csv) {

        csv.forEach(function (d) {
            // d[xVar] = +d[xVar];
            // d[yVar] = d[yVar];
            d.BLcode = parseInt(d.BLcode);
            d.year = parseInt(d.year);
            d.edyears_F = parseFloat(d.edyears_F);
            d.edyears_M = parseFloat(d.edyears_M);
            d.edyears_MF = parseFloat(d.edyears_MF);
        });

        data = csv
    });
}

function updateVis() {

    var selection = d3.select("#ranking-type").property("value");

    // NEED TO INCORPORATE SELECTION SOMEHOW

    var xVar = "edyears_MF",
        //yVar = d3.randomUniform(-height/2, height/2);
        yVar = "year";

    var force = d3.forceSimulation()
            .nodes(data)
            //        .size([width, height])
            .on("tick", tick);
//        .charge(-1)
//        .gravity(0)
//        .chargeDistance(20);

        x.domain(d3.extent(data, function (d) {
            return d[xVar];
        })).nice();
        y.domain(d3.extent(data, function (d) {
            return d[yVar];
        })).nice();

//    x.range([height, margin.top]

        // Set initial positions
        data.forEach(function (d) {
            d.x = x(d[xVar]);
            d.y = y(d[yVar]);
            d.color = color(d.region);
            d.radius = radius;
        });

        svg.append("g")
            .attr("class", "x_axis_scatter")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)

        svg.append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", height - 10)
            .style("text-anchor", "end")
            .style("font-size", 14)
            .text("Years of Educational Attainment");

        svg.append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("x", 0)
            .attr("y", -80)
            .attr("dy", "1em")
            //.style("text-anchor", "end")
            .text("Year");

        svg.append("g")
            .attr("class", "y_axis_scatter")
            .style("font-size", 14)
            .call(yAxis)

        var node = svg.selectAll(".rect")
            .data(data)
            .enter().append("rect")
            .attr("class", "rect")
            .attr("x", function (d) {
                return x(d[xVar]);
            })
            .attr("y", function (d) {
                return y(d[yVar]) - 30;
            })
            .attr("height", 25)
            .attr("width", 10)
            .attr("opacity", 0.3)
            .style("fill", function (d) {
                return d.color;
            })
            .on('mouseenter', MouseEnter)
            .on('mouseout', MouseOut);

        var legend = svg.selectAll(".legend")
            .data(color.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            });

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
            .text(function (d) {
                return d;
            });

        function MouseEnter(d) {
            d3.select(this)
                .transition().duration(100)
                .style("opacity", 1);
            tooltip.transition().duration(300)
                .style("opacity", 1);
            tooltip.html(function () {
                return d.country + " [" + d.region + "]: " + d3.format(".2f")(d.edyears_MF) + " years";
            })
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 5) + "px");
        }

        function MouseOut(d) {
            d3.select(this)
                .transition().duration(600)
                .style("opacity", 0.3);
        }

        d3.select("#collisiondetection").on("change", function () {
            force.resume();
        });

    // force.start();


        function tick(e) {
//        node.each(moveTowardDataPosition(e.alpha));

//        if (checkbox.node().checked) node.each(collide(e.alpha));

            node.attr("x", function (d) {
                return d.x;
            })
                .attr("y", function (d) {
                    return d.y - 30;
                });
        }

        function moveTowardDataPosition(alpha) {
            return function (d) {
                d.x += (x(d[xVar]) - d.x) * 0.1 * alpha;
                d.y += (y(d[yVar]) - d.y) * 0.1 * alpha;
            };
        }

        // Resolve collisions between nodes.
        function collide(alpha) {
            var quadtree = d3.geom.quadtree(data);
            return function (d) {
                var r = d.radius + radius + padding,
                    nx1 = d.x - r,
                    nx2 = d.x + r,
                    ny1 = d.y - r,
                    ny2 = d.y + r;
                quadtree.visit(function (quad, x1, y1, x2, y2) {
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

    }