DistViz = function(_parentElement, _data) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.filteredData = [];
    this.initVis();
};


DistViz.prototype.initVis = function() {
    var vis = this;

    console.log(vis.data);

    // specify globals
    vis.margin = {top: 70, right: 20, bottom: 30, left: 300};
    vis.width = 1300 - vis.margin.left - vis.margin.right;
    vis.height = 500 - vis.margin.top - vis.margin.bottom;
    vis.padding = 1; // separation b/w nodes

    // Tooltip
    vis.tooltip = d3.select("#discrete-scatterplot")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    vis.wrangleData();
};

DistViz.prototype.wrangleData = function() {
    var vis = this;

    vis.data.forEach(function(d) {
        d.BLcode = +d.BLcode;
        // d.country = d.country;
        // d.year = d.year;
        d.edyears_F = +d.edyears_F;
        d.edyears_M = +d.edyears_M;
        d.edyears_MF = +d.edyears_MF;
        // d.region = d.region;
    });

    vis.updateVis();
};

DistViz.prototype.updateVis = function() {
    var vis = this;

    vis.x = d3.scaleLinear()
        .range([0, vis.width]);

    vis.y = d3.scaleLinear()
        .range([vis.height, 0]);

    vis.discrete_scatterplot = d3.select("#discrete-scatterplot").append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.color = d3.scaleOrdinal(d3.schemeCategory10);

    vis.xAxis = d3.axisBottom()
        .scale(vis.x);

    vis.yAxis = d3.axisLeft()
        .scale(vis.y);

    vis.height2 = (vis.height - vis.margin.top - vis.margin.bottom) / 14;

    vis.xVar = "edyears_MF";
    vis.yVar = "year";
    vis.country = "country";
    vis.region = "region";

    /*
    vis.discrete_scatterplot.append("rect")
        .attr("id","rect")
        .attr("width", vis.width)
        .attr("height", vis.height)
        .attr("x",0)
        .attr("y",0)
        .attr("fill","#E7E7E7");
        */

//    vis.rects = vis.discrete_scatterplot.append("g");
    vis.rectWidth = 10;

    vis.data.forEach(function(d) {
        d[vis.xVar] = +d[vis.xVar];
        d[vis.yVar] = d[vis.yVar];
        d.BLcode = parseInt(d.BLcode);
        d.year = parseInt(d.year);
        d.edyears_F = +d.edyears_F;
        d.edyears_M = +d.edyears_M;
        d.edyears_MF = +d.edyears_MF;
    });

    var force = d3.forceSimulation()
        .nodes(vis.data)
//        .size([width, height])
        .on("tick", tick);
//        .charge(-1)
//        .gravity(0)
//        .chargeDistance(20);

    vis.x.domain(d3.extent(vis.data, function(d) { return d[vis.xVar]; })).nice();
    vis.y.domain(d3.extent(vis.data, function(d) { return d[vis.yVar]; })).nice();

    // Set initial positions
    vis.data.forEach(function(d) {
        d[vis.x] = vis.x(d[vis.xVar]);
        d[vis.y] = vis.y(d[vis.yVar]);
        d[vis.color] = vis.color(d[vis.region]);
        d[vis.radius] = vis.radius;
    });

    vis.discrete_scatterplot.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + vis.height + ")")
        .call(vis.xAxis);

    vis.discrete_scatterplot.append("text")
        .attr("class", "label")
        .attr("x", vis.width)
        .attr("y", vis.height - 10)
        .style("text-anchor", "end")
        .text("Years of Educational Attainment");

    vis.discrete_scatterplot.append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "1em")
        .style("text-anchor", "end")
        .text("Year");

    vis.discrete_scatterplot.append("g")
        .attr("class", "y axis")
        .call(vis.yAxis)

    var node = vis.discrete_scatterplot.selectAll(".rect")
        .data(vis.data)
        .enter().append("rect")
        .attr("class", "rect")
        .attr("x", function(d) { return vis.x(d[vis.xVar]); })
        .attr("y", function(d) { return vis.y(d[vis.yVar]) - 30; })
        .attr("height", 30)
        .attr("width", 10)
        .attr("opacity", 0.3)
        .style("fill", function(d) { return d[vis.color]; })
        .on('mouseenter', MouseEnter)
        .on('mouseout', MouseOut);

    var legend = vis.discrete_scatterplot.selectAll(".legend")
        .data(vis.color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", vis.width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", vis.color);

    legend.append("text")
        .attr("x", vis.width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });

    function MouseEnter(d) {
        d3.select(this)
            .transition().duration(100)
            .style("opacity", 1);
        vis.tooltip.transition().duration(300)
            .style("opacity", 1);
        vis.tooltip.html(function() {
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

    d3.select("#collisiondetection").on("change", function() {
        force.resume();
    });

//    force.start();


    function tick(e) {
//        node.each(moveTowardDataPosition(e.alpha));

//        if (checkbox.node().checked) node.each(collide(e.alpha));

        node.attr("x", function(d) { return vis.x(d[vis.xVar]); })
            .attr("y", function(d) { return vis.y(d[vis.yVar]) - 30; });
    }
/*
    vis.data.forEach(function(d) {
        d[vis.x] = vis.x(d[vis.xVar]);
        d[vis.y] = vis.y(d[vis.yVar]);
        d[vis.color] = vis.color(d[vis.region]);
        d[vis.radius] = vis.radius;
    });
*/

    function moveTowardDataPosition(alpha) {
        return function(d) {
            d[vis.x] += (vis.x(d[vis.xVar]) - d[vis.x]) * 0.1 * alpha;
            d[vis.y] += (vis.y(d[vis.yVar]) - d[vis.y]) * 0.1 * alpha;
        };
    }

};