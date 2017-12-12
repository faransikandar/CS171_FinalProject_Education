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

    // specify globals
    vis.xVar = "edyears_MF";
    vis.yVar = "year";
    vis.country = "country";
    vis.region = "region";

    vis.margin = {top: 70, right: 20, bottom: 80, left: 200};
    vis.width = 1100 - vis.margin.left - vis.margin.right;
    vis.height = 575 - vis.margin.top - vis.margin.bottom;
    vis.padding = 0; // separation b/w nodes

    vis.height2 = (vis.height - vis.margin.top - vis.margin.bottom) / 14;
    vis.rectWidth = 10;

    vis.x = d3.scaleLinear()
        .range([0, vis.width])
        .domain([0,16]);

    vis.y = d3.scaleLinear()
        .range([vis.height, 0])
        .domain([1950,2010]);

    vis.svg = d3.select("#discrete-scatterplot").append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    //vis.color = d3.scaleOrdinal(d3.schemeCategory10);
    vis.color = d3.scaleOrdinal(['#66c2a5','#ffd92f','#8da0cb','#fc8d62']);

    vis.xAxis = d3.axisBottom()
        .scale(vis.x);

    vis.yAxis = d3.axisLeft()
        .scale(vis.y)
        .tickFormat(d3.format("d"));


    // Axes
    vis.svg.append("g")
        .attr("class", "dist-xAxis")
        .attr("transform", "translate(0," + (vis.height) + ")")
        .call(vis.xAxis);

    vis.svg.append("g")
        .attr("class", "dist-yAxis")
        .attr("transform", "translate(0," + (-12) + ")")
        .call(vis.yAxis);

    // Axis labels
    vis.svg.append("text")
        .attr("class", "dist-label")
        .attr("x", vis.width)
        .attr("y", vis.height - 5)
        .style("text-anchor", "end")
        .text("Years of Educational Attainment");


    // Tooltip
    vis.tooltip = d3.select("body")
        .append("div")
        .attr("class", "dist-tooltip")
        .style("opacity", 0);

    vis.wrangleData();
};


DistViz.prototype.wrangleData = function() {
    var vis = this;

    vis.data.forEach(function (d) {
        d[vis.xVar] = +d[vis.xVar];
        d[vis.yVar] = d[vis.yVar.replace(/\,/g,'')];
        d.BLcode = parseInt(d.BLcode);
        d.year = parseInt(d.year);
        d.edyears_F = +d.edyears_F;
        d.edyears_M = +d.edyears_M;
        d.edyears_MF = +d.edyears_MF;
    });

    console.log(vis.data);

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

    vis.updateVis();
};




DistViz.prototype.updateVis = function() {
    var vis = this;

    // Set initial positions
    vis.data.forEach(function (d) {
        d[vis.x] = vis.x(d[vis.xVar]);
        d[vis.y] = vis.y(d[vis.yVar]);
        //d[vis.color] = vis.color(d[vis.region]);
    });

    // Add rectangles
    vis.monolines = vis.svg.selectAll(".monoLines")
        .data(vis.data);

    vis.monolines.enter().append("rect")
        .merge(vis.monolines)
        .on('mouseenter', MouseEnter1)
        .on('mouseout', MouseOut1)
        .attr("class", "monoLines")
        .attr("x", function (d) {
            return vis.x(d[vis.xVar]);
        })
        .attr("y", function (d) {
            return vis.y(d[vis.yVar]) - 30;
        })
        .attr("height", 25)
        .attr("width", 10)
        .merge(vis.monolines)
        .transition()
        .duration(1000)
        .style("fill", '#2b8cbe')
        .style("opacity", 0.3);

    vis.monolines.exit().remove();

    function MouseEnter1(d) {
        d3.select(this)
            .transition().duration(100)
            .style("opacity", 1)
            .style("stroke", 'black')
            .style("stroke-width", 1);
        vis.tooltip.transition().duration(300)
            .style("opacity", 1);
        vis.tooltip.html(function () {
            return d.country +  " (" + d.year + "): " + d3.format(".2f")(d[vis.xVar]) + " years";
        })
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY + 4) + "px");
    }

    function MouseOut1(d) {
        d3.select(this)
            .transition().duration(600)
            .style("opacity", 0.3)
            .style("stroke", 'none');
        vis.tooltip.transition().duration(300)
            .style("opacity", 0);
    }


}



DistViz.prototype.updateVis2 = function() {
    var vis = this;

    // Set initial positions
    vis.data.forEach(function (d) {
        d[vis.x] = vis.x(d[vis.xVar]);
        d[vis.y] = vis.y(d[vis.yVar]);
        d[vis.color] = vis.color(d[vis.region]);
    });

    // Add rectangles
    vis.lines = vis.svg.selectAll(".distLines")
        .data(vis.data);

    vis.lines.enter().append("rect")
        .merge(vis.lines)
        .on('mouseenter', MouseEnter2)
        .on('mouseout', MouseOut2)
        .attr("class", function(d){return "distLines reg-"+(d.region);})
        .attr("x", function (d) {
            return vis.x(d[vis.xVar]);
        })
        .attr("y", function (d) {
            return vis.y(d[vis.yVar]) - 30;
        })
        .attr("height", 25)
        .attr("width", 10)
        .merge(vis.lines)
        .transition()
        .duration(1500)
        .style("fill", function (d) {
            return d[vis.color];
        })
        .style("opacity", 0.3);

    vis.lines.exit().remove();

    // legend
    vis.legend = vis.svg.selectAll(".legend")
        .data(vis.color.domain())
        .enter().append("g")
        .attr("class", "dist-legend2")
        .attr("transform", function (d, i) {
            return "translate(0," + i * 20 + ")";
        });

    vis.legend.append("rect")
        .attr("x", vis.width - 20 )
        .attr("y", 300)
        .attr("width", 18)
        .attr("height", 18)
        .on('mouseenter', highlightCell)
        .on("mouseout", function () {
            d3.selectAll(".distLines").style("opacity",0.3);
            d3.selectAll(".dist-legend2-label").style("opacity",1);
        })
        .style("fill", vis.color);

    vis.legend.append("text")
        .attr("x", vis.width - 30)
        .attr("y", 310)
        .attr("dy", ".35em")
        .attr("class", "dist-legend2-label")
        .on('mouseenter', highlightCell)
        .on("mouseout", function () {
            d3.selectAll(".distLines").style("opacity",0.3);
            d3.selectAll(".dist-legend2-label").style("opacity",1);
        })
        .style("text-anchor", "end")
        .text(function (d) {
            return d;
        });

    // text
    vis.instruct = vis.svg.append("text");

    vis.instruct.enter().append("g")
        .merge(vis.instruct)
        .attr("x", 760)
        .attr("y", 285)
        .attr("class", "dist-instruct")
        .style("text-anchor", "start")
        .text("Hover over legend to filter");


    function highlightCell() {
        vis.dataH = d3.select(this).data()[0];

        d3.selectAll(".distLines")
            .style("opacity", function (d) {
                return d.region === vis.dataH ? "0.3" : "0";
            });
        d3.selectAll(".dist-legend2-label")
            .style("opacity", function (d) {
                return d === vis.dataH ? "1" : "0.2";
            });
    }


    function MouseEnter2(d) {
        d3.select(this)
            .transition().duration(100)
            .style("opacity", 1)
            .style("stroke", 'black')
            .style("stroke-width", 1);
        vis.tooltip.transition().duration(300)
            .style("opacity", 1);
        vis.tooltip.html(function () {
            return d.country +  " (" + d.year + "): " + d3.format(".2f")(d[vis.xVar]) + " years";
        })
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY + 4) + "px");
    }

    function MouseOut2(d) {
        d3.select(this)
            .transition().duration(600)
            .style("opacity", 0.3)
            .style("stroke", 'none');
        vis.tooltip.transition().duration(300)
            .style("opacity", 0);
    }

}


DistViz.prototype.updateVis3 = function() {
    var vis = this;


    // Set initial positions
    vis.data.forEach(function (d) {
        d[vis.x] = vis.x(d[vis.xVar]);
        d[vis.y] = vis.y(d[vis.yVar]);
        d[vis.color] = vis.color(d[vis.region]);
    });

    // Add rectangles
    vis.nodeAfrica = vis.svg.selectAll(".rectAfrica")
        .data(vis.dataAfrica);

    vis.nodeAfrica.enter().append("rect")
        .merge(vis.nodeAfrica)
        .on('mouseenter', MouseEnter3)
        .on('mouseout', MouseOut3)
        .attr("class", "rectAfrica")
        .attr("x", function (d) {
            return vis.x(d[vis.xVar])
        })
        .attr("y", function (d) {
            return vis.y(d[vis.yVar]) - 50/6*4 +12.5;
        })
        .attr("height", 5)
        .attr("width", 10)
        .merge(vis.nodeAfrica)
        .transition()
        .duration(1500)
        .style("fill", function (d) {
            return d[vis.color];
        })
        .style("opacity", 0.4);

    vis.nodeAfrica.exit().remove();

    vis.nodeAmericas = vis.svg.selectAll(".rectAmericas")
        .data(vis.dataAmericas);

    vis.nodeAmericas.enter().append("rect")
        .merge(vis.nodeAmericas)
        .on('mouseenter', MouseEnter3)
        .on('mouseout', MouseOut3)
        .attr("class", "rectAmericas")
        .attr("x", function (d) {
            return vis.x(d[vis.xVar])
        })
        .attr("y", function (d) {
            return vis.y(d[vis.yVar]) - 50/6*3 +9;
        })
        .attr("height",5)
        .attr("width", 10)
        .merge(vis.nodeAmericas)
        .transition()
        .duration(1500)
        .style("fill", function (d) {
            return d[vis.color];
        })
        .style("opacity", 0.4);

    vis.nodeAmericas.exit().remove();

    vis.nodeAsia = vis.svg.selectAll(".rectAsia")
        .data(vis.dataAsia);

    vis.nodeAsia.enter().append("rect")
        .merge(vis.nodeAsia)
        .on('mouseenter', MouseEnter3)
        .on('mouseout', MouseOut3)
        .attr("class", "rectAsia")
        .attr("x", function (d) {
            return vis.x(d[vis.xVar])
        })
        .attr("y", function (d) {
            return vis.y(d[vis.yVar]) - 50/6*2 + 5.5;
        })
        .attr("height", 5)
        .attr("width", 10)
        .merge(vis.nodeAsia)
        .transition()
        .duration(1500)
        .style("fill", function (d) {
            return d[vis.color];
        })
        .style("opacity", 0.4);

    vis.nodeAsia.exit().remove();

    vis.nodeEurope = vis.svg.selectAll(".rectEurope")
        .data(vis.dataEurope);

    vis.nodeEurope.enter().append("rect")
        .merge(vis.nodeEurope)
        .on('mouseenter', MouseEnter3)
        .on('mouseout', MouseOut3)
        .attr("class", "rectEurope")
        .attr("x", function (d) {
            return vis.x(d[vis.xVar])
        })
        .attr("y", function (d) {
            return vis.y(d[vis.yVar]) - 50/6*1 +2 ;
        })
        .attr("height", 5)
        .attr("width", 10)
        .merge(vis.nodeEurope)
        .transition()
        .duration(1500)
        .style("fill", function (d) {
            return d[vis.color];
        })
        .style("opacity", 0.4);

    vis.nodeEurope.exit().remove();


    // legend
    vis.legend = vis.svg.selectAll(".dist-legend")
        .data(vis.color.domain())
        .enter().append("g")
        .attr("class", "dist-legend")
        .attr("transform", function (d, i) {
            return "translate(0," + i * 20 + ")";
        });

    vis.legend.append("rect")
        .attr("x", vis.width - 20 )
        .attr("y", 300)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", vis.color);

    vis.legend.append("text")
        .attr("x", vis.width - 30)
        .attr("y", 310)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d) {
            return d;
        });

    function MouseEnter3(d) {
        d3.select(this)
            .transition().duration(100)
            .style("opacity", 1)
            .style("stroke", 'black')
            .style("stroke-width", 1);
        vis.tooltip.transition().duration(300)
            .style("opacity", 1);
        vis.tooltip.html(function () {
            return d.country +  " (" + d.year + "): " + d3.format(".2f")(d[vis.xVar]) + " years";
        })
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY + 4) + "px");
    }

    function MouseOut3(d) {
        d3.select(this)
            .transition().duration(600)
            .style("opacity", 0.4)
            .style("stroke", 'none');
        vis.tooltip.transition().duration(300)
            .style("opacity", 0);
    }

};


















