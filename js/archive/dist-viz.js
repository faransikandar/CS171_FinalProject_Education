
DistViz = function(_parentElement, _edyearsData) {
    this.parentElement = _parentElement;
    this.data = _edyearsData;
    this.filteredData = [];
    this.initVis();
};


DistViz.prototype.initVis = function() {
    var vis = this;

    // specify globals
    vis.margin = {top: 40, right: 10, bottom: 40, left: 50};
    vis.width = 800 - vis.margin.left - vis.margin.right;
    vis.height = 200 - vis.margin.top - vis.margin.bottom;

    // Tooltip
    vis.tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


    vis.wrangleData();
};

DistViz.prototype.wrangleData = function() {
    var vis = this;

    vis.data.forEach(function(d) {
        d.BLcode = parseInt(d.BLcode);
        d.year = parseInt(d.year);
        d.edyears_F = parseFloat(d.edyears_F);
        d.edyears_M = parseFloat(d.edyears_M);
        d.edyears_MF = parseFloat(d.edyears_MF);
    });

    vis.filteredData = vis.data.filter(function(d){
        return (d.year==1950);
    });

    console.log(vis.filteredData);

    vis.updateVis();
};


DistViz.prototype.updateVis = function() {
    var vis = this;

    vis.x = d3.scaleLinear()
        .range([0, vis.width-70])
        .domain([0,d3.max(vis.filteredData, function(d) { return d.edyears_MF; })]);

    console.log(d3.max(vis.filteredData, function(d) { return d.edyears_MF; }));

    vis.svg_mf = d3.select("#svg-mf").append("svg")
        .attr("width", vis.width)
        .attr("height", vis.height)
        .append("g")
        .attr("width", vis.width )
        .attr("height", vis.height )
        .attr("transform", "translate("+vis.margin.left+","+vis.margin.top+")");

    vis.height2 = vis.height - vis.margin.top - vis.margin.bottom;

    vis.svg_mf.append("rect")
        .attr("id","rect")
        .attr("width", vis.width)
        .attr("height", vis.height2)
        .attr("x",0)
        .attr("y",0)
        .attr("fill","#E7E7E7");

    vis.rects = vis.svg_mf.append("g");
    vis.rectWidth = 3;

    vis.rects.selectAll(".event-rect")
        .data(vis.filteredData)
        .enter()
        .append("rect").merge(vis.rects)
        .attr("class", "event-rect")
        .attr("x", function(d){return vis.x(d.edyears_MF)})
        .attr("y", 0)
        .attr("height", vis.height2)
        .attr("width", vis.rectWidth)
        .attr("fill", '#67809F')
        .attr("opacity", 0.3)
        .on('mouseenter', MouseEnter)
        .on('mouseout', MouseOut);

    function MouseEnter(d) {
        d3.select(this)
            .transition().duration(100)
            .style("opacity", 1);
        vis.tooltip.transition().duration(300)
            .style("opacity", 1);
        vis.tooltip.html(function() {
            return d.country + ": " + d3.format(".2f")(d.edyears_MF) + " years";
        })
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 5) + "px");
    }
    function MouseOut(d) {
        d3.select(this)
            .transition().duration(600)
            .style("opacity", 0.3);
    }
};

