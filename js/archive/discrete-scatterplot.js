DistViz = function(_parentElement, _data) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.filteredData = [];
    this.dataAfrica = [];
    this.dataAsia = [];
    this.dataAmericas = [];
    this.dataEurope = [];

    this.initVis();
};


DistViz.prototype.initVis = function() {
    var vis = this;

    console.log(vis.dataFull);

    /*
    vis.data = vis.dataFull.filter(function(d){
        return (d.year == "1950" || d.year == "1960" || d.year == "1970" || d.year == "1980" || d.year == "1990" || d.year == "2000" || d.year == "2010");
    });
    */

    vis.dataAfrica = vis.data.filter(function(d){
        return (d.region=="Africa");
    });

    vis.dataAmericas = vis.data.filter(function(d){
        return (d.region=="Americas");
    });

    vis.dataAsia = vis.data.filter(function(d){
        return (d.region=="Asia");
    });

    vis.dataEurope = vis.data.filter(function(d){
        return (d.region=="Europe");
    });

    console.log(vis.dataAsia);

    // specify globals
    vis.margin = {top: 70, right: 20, bottom: 80, left: 300};
    vis.width = 1300 - vis.margin.left - vis.margin.right;
<<<<<<< Updated upstream
    vis.height = 500 - vis.margin.top - vis.margin.bottom;
    vis.padding = 0; // separation b/w nodes
=======
    vis.height = 600 - vis.margin.top - vis.margin.bottom;
    vis.padding = 1; // separation b/w nodes
>>>>>>> Stashed changes

    // Tooltip
    vis.tooltip = d3.select("#discrete-scatterplot")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0.3);

    vis.wrangleData();
};

DistViz.prototype.wrangleData = function() {
    var vis = this;

    /*
    vis.data.forEach(function(d) {
        d.BLcode = +d.BLcode;
        // d.country = d.country;
        // d.year = d.year;
        d.edyears_F = +d.edyears_F;
        d.edyears_M = +d.edyears_M;
        d.edyears_MF = +d.edyears_MF;
        // d.region = d.region;
    });
    */

    vis.updateVis();
};

DistViz.prototype.updateVis = function() {
    var vis = this;

    var formatNumber = d3.format("d");

    vis.x = d3.scaleLinear()
        .range([0, vis.width]);

    vis.y = d3.scaleLinear()
        .range([vis.height, 0]);

    vis.discrete_scatterplot = d3.select("#discrete-scatterplot").append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


    /*
    var controls = d3.select("scatterplot-controls").append("label")
        .attr("id", "controls");
    var checkbox = controls.append("input")
        .attr("id", "collisiondetection")
        .attr("type", "checkbox");
    controls.append("span")
        .text("Collision Detection");
        */

    vis.color = d3.scaleOrdinal(d3.schemeCategory10);

    var ticks = d3.selectAll(".tick text");

    /*
    ticks.attr("class", function(d,i){
        if(i%10 != 0) d3.select(this).remove();
    });
    */

    vis.xAxis = d3.axisBottom()
        .scale(vis.x);

    vis.yAxis = d3.axisLeft()
        .scale(vis.y)
        .tickFormat(d3.format("d"));

    /*
    vis.discrete_scatterplot.append("g")
        .attr("transform", "translate(0," + (0) + ")")
        .call(customYAxis);

    function customYAxis(g) {
        g.call(vis.yAxis);
        g.select(".domain").remove();
        g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "#777").attr("stroke-dasharray", "20,20");
        g.selectAll(".tick text").attr("x", 4).attr("dy", -4);
    }
    */

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

    vis.data.forEach(function (d) {
        d[vis.xVar] = +d[vis.xVar];
        d[vis.yVar] = d[vis.yVar.replace(/\,/g,'')];
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

    vis.x.domain(d3.extent(vis.data, function (d) {
        return d[vis.xVar];
    })).nice();
    vis.y.domain(d3.extent(vis.data, function (d) {
        return d[vis.yVar];
    })).nice();

    // Set initial positions
    vis.data.forEach(function (d) {
        d[vis.x] = vis.x(d[vis.xVar]);
        d[vis.y] = vis.y(d[vis.yVar]);
        d[vis.color] = vis.color(d[vis.region]);
        d[vis.radius] = vis.radius;
    });

    vis.discrete_scatterplot.append("g")
        .attr("class", "x_axis_scatter")
        .attr("transform", "translate(0," + (vis.height) + ")")
        .call(vis.xAxis);

    vis.discrete_scatterplot.append("text")
        .attr("class", "label")
        .attr("x", vis.width)
        .attr("y", vis.height - 10)
        .style("text-anchor", "end")
        .style("font-size", 14)
        .text("Years of Educational Attainment");

    vis.discrete_scatterplot.append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("x", 0)
        .attr("y", -100)
        .attr("dy", "1em")
        //.style("text-anchor", "end")
        .style("font-size", 14)
        .text("Year");


    vis.discrete_scatterplot.append("g")
        .attr("class", "y_axis_scatter")
        .attr("transform", "translate(0," + (-20) + ")")
        .call(vis.yAxis)

    nodeAfrica = vis.discrete_scatterplot.selectAll(".rect")
        .data(vis.dataAfrica)
        .enter().append("rect")
        .attr("class", "rect")
        .attr("x", function (d) {
            return vis.x(d[vis.xVar])
        })
        .attr("y", function (d) {
            return vis.y(d[vis.yVar]) - 50/6*4;
        })
        .attr("height", 5)
        .attr("width", 10)
        .attr("opacity", 0.3)
        .style("fill", function (d) {
            return d[vis.color];
        })
        .on('mouseenter', MouseEnter)
        .on('mouseout', MouseOut);

    nodeAmericas = vis.discrete_scatterplot.selectAll(".rect")
        .data(vis.dataAmericas)
        .enter().append("rect")
        .attr("class", "rect")
        .attr("x", function (d) {
            return vis.x(d[vis.xVar])
        })
        .attr("y", function (d) {
            return vis.y(d[vis.yVar]) - 50/6*3;
        })
        .attr("height",5)
        .attr("width", 10)
        .attr("opacity", 0.3)
        .style("fill", function (d) {
            return d[vis.color];
        })
        .on('mouseenter', MouseEnter)
        .on('mouseout', MouseOut);

    nodeAsia = vis.discrete_scatterplot.selectAll(".rect")
        .data(vis.dataAsia)
        .enter().append("rect")
        .attr("class", "rect")
        .attr("x", function (d) {
            return vis.x(d[vis.xVar])
        })
        .attr("y", function (d) {
            return vis.y(d[vis.yVar]) - 50/6*2;
        })
        .attr("height", 5)
        .attr("width", 10)
        .attr("opacity", 0.3)
        .style("fill", function (d) {
            return d[vis.color];
        })
        .on('mouseenter', MouseEnter)
        .on('mouseout', MouseOut);

    nodeEurope = vis.discrete_scatterplot.selectAll(".rect")
        .data(vis.dataEurope)
        .enter().append("rect")
        .attr("class", "rect")
        .attr("x", function (d) {
            return vis.x(d[vis.xVar])
        })
        .attr("y", function (d) {
            return vis.y(d[vis.yVar]) - 50/6*1;
        })
        .attr("height", 5)
        .attr("width", 10)
        .attr("opacity", 0.3)
        .style("fill", function (d) {
            return d[vis.color];
        })
        .on('mouseenter', MouseEnter)
        .on('mouseout', MouseOut);


    // vis.filteredData = vis.data.filter(function(d){
    //     return (d.region=="Asia");
    // });
    //
    // console.log(vis.filteredData);

    var legend = vis.discrete_scatterplot.selectAll(".legend")
        .data(vis.color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
            return "translate(0," + i * 20 + ")";
        });

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
        .text(function (d) {
            return d;
        });

    var instruction = vis.discrete_scatterplot.selectAll(".addInstruction")
        .enter().append("g")
        .attr("class", "addInstruction")
        .append('text')
        .attr('x', vis.width/2)
        .attr('y', vis.height - 30)
        .text("HOVER OVER EACH BAR FOR MORE INFORMATION");

    function MouseEnter(d) {
        d3.select(this)
            .transition().duration(100)
            .style("opacity", 1);
        vis.tooltip.transition().duration(300)
            .style("opacity", 1);
        vis.tooltip.html(function () {
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
        /*
        vis.node.each(moveTowardDataPosition(e.alpha));

        if (checkbox.node().checked) vis.node.each(collide(e.alpha));
        */

        nodeAfrica.attr("x", function (d) {
            return vis.x(d[vis.xVar]);
        })
            .attr("y", function (d) {
                return vis.y(d[vis.yVar]) - 50/6*4;
            });

        nodeAmericas.attr("x", function (d) {
            return vis.x(d[vis.xVar]);
        })
            .attr("y", function (d) {
                return vis.y(d[vis.yVar]) - 50/6*3;
            });

        nodeAsia.attr("x", function (d) {
            return vis.x(d[vis.xVar]);
        })
            .attr("y", function (d) {
                return vis.y(d[vis.yVar]) - 50/6*2;
            });

        nodeEurope.attr("x", function (d) {
            return vis.x(d[vis.xVar]);
        })
            .attr("y", function (d) {
                return vis.y(d[vis.yVar]) - 50/6*1;
            });
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
        return function (d) {
            d[vis.x] += (vis.x(d[vis.xVar]) - d[vis.x]) * 0.1 * alpha;
            d[vis.y] += (vis.y(d[vis.yVar]) - d[vis.y]) * 0.1 * alpha;
        };
    }

    // Resolve collisions between nodes
    function collide(alpha) {
        var quadtree = d3.quadtree(vis.data);
        return function (d) {
            var r = d[vis.radius] + vis.radius + vis.padding,
                nx1 = d[vis.x] - r,
                nx2 = d[vis.x] + r,
                ny1 = d[vis.y] - r,
                ny2 = d[vis.y] + r;
            quadtree.visit(function (quad, x1, y1, x2, y2) {
                if (quad.point && (quant.point !== d)) {
                    var x = d.x - quad.point.x,
                        y = d.y - quad.point.y,
                        l = Math.sqrt(vis.x * vis.x + vis.y * vis.y),
                        r = vis.radius + quad.point.radius + (d[vis.color] !== quad.point.color) * vis.padding;
                    if (l < r) {
                        l = (l - r) / l * alpha;
                        d[vis.x] -= vis.x *= l;
                        d[vis.y] -= vis.y *= l;
                        quad.point.x += vis.x;
                        quad.point.y += vis.y;
                    }
                }
                return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            });
        };
    }
};
