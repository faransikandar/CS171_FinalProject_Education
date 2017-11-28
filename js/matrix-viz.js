/*
 * Matrix constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 */

Matrix = function(_parentElement, _reg1Data) {
    this.parentElement = _parentElement;
    this.reg1Data = _reg1Data;
    this.displayData = [];

    this.initVis();
};

Matrix.prototype.initVis = function() {
    var vis = this;

    // specify globals
    vis.margin = { top: 150, right: 0, bottom: 50, left: 250 };
    vis.width = 1300 - vis.margin.left - vis.margin.right;
    vis.height = 430 - vis.margin.top - vis.margin.bottom;

    vis.gridSize = Math.floor(vis.width / 53);
    vis.legendElementWidth = vis.gridSize*2;
    vis.buckets = 9;
    vis.colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"]; // alternatively colorbrewer.YlGnBu[9]
    vis.vars = ["Wealth index", "Household size", "Number of younger siblings", "First born child", "Female", "Urban area", "Mother received higher education", "Father received higher education", "% malnourished in village", "% received higher educ. in village"];
    vis.countries = ["Afghanistan", "Angola", "Armenia", "Bangladesh", "Benin", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Chad", "Colombia", "Comoros", "Congo", "Congo DR", "Cote d'Ivoire", "Dominican Republic", "Egypt", "Ethiopia", "Gabon", "Gambia", "Ghana", "Guatemala", "Guinea", "Haiti", "Honduras", "Indonesia", "Jordan", "Kenya", "Kyrgyz Republic", "Lesotho", "Liberia", "Malawi", "Mali", "Mozambique", "Myanmar", "Namibia", "Nepal", "Niger", "Nigeria", "Pakistan", "Peru", "Philippines", "Rwanda", "Senegal", "Sierra Leone", "Tajikistan", "Tanzania", "Timor-Leste", "Togo", "Uganda", "Yemen", "Zambia", "Zimbabwe"];


    // initialize SVG area
    vis.svg = d3.select("#chart").append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.colorScale = d3.scaleThreshold()
        .domain([.1, .2, .3, .4, .5, .6, .7, .8])
        .range(vis.colors);


    vis.wrangleData();
};

Matrix.prototype.wrangleData = function() {
    var vis = this;

    vis.reg1Data.forEach(function(d){
        d.value = +d.value;
        d.value2 = +d.value2;
        d.code = +d.code;
        d.var = +d.var;
    });

    vis.displayData = vis.reg1Data;
    console.log(vis.displayData);

    vis.updateVis();
};




Matrix.prototype.updateVis = function() {
    var vis = this;

    vis.yvar = d3.select("#selectedY").property("value");
    console.log(vis.yvar);

    vis.cards = vis.svg.selectAll(".code")
        .data(vis.displayData, function(d) { return d.var+':'+d.code});

    vis.cards.enter().append("rect")
        .merge(vis.cards)
        .on("mouseover", highlightCell)
        .on("mouseout", function () {
            d3.selectAll(".code").style("opacity",0.8);
        })
        .attr("x", function(d, i) { return (d.code - 1) * vis.gridSize})
        .attr("y", function(d, i) { return (d.var - 1) * vis.gridSize})
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("class", "code bordered")
        .attr("width", vis.gridSize)
        .attr("height", vis.gridSize)
        .style("fill", vis.colors[0])
        .merge(vis.cards)
        .transition()
        .duration(1000)
        .style("fill", function(d) { return vis.colorScale(d[vis.yvar])})
        .style("opacity",.8);

    function highlightCell() {
        vis.dataH = d3.select(this).data()[0];

        d3.selectAll(".code")
            .style("opacity",function(d) {
                return d.var === vis.dataH.var || d.code === vis.dataH.code ? "1" : "0.2";
            });
        }

    vis.cards.exit().remove();

    // legend
    vis.legend = vis.svg.selectAll(".legend")
        .data([0].concat(vis.colorScale.domain()), function(d) { return d});

    vis.legend_g = vis.legend.enter().append("g")
        .attr("class", "legend");

    vis.legend_g.append("rect")
        .attr("x", function(d, i) { return vis.legendElementWidth * i})
        .attr("y", vis.height)
        .attr("width", vis.legendElementWidth)
        .attr("height", vis.gridSize / 2)
        .style("fill", function(d, i) { return vis.colors[i]})
        .style("opacity",.8);

    vis.legend_g.append("text")
        .attr("class", "mono")
        .text(function(d) { return d})
        .attr("x", function(d, i) { return vis.legendElementWidth * i})
        .attr("y", vis.height + vis.gridSize);

    vis.legend.exit().remove();

    // labels
    vis.varLabels = vis.svg.selectAll(".varLabel")
        .data(vis.vars)
        .enter().append("text")
        .text(function (d) { return d; })
        .attr("x", 0)
        .attr("y", function(d, i){ return i * vis.gridSize })
        .style("text-anchor", "end")
        .attr("transform", "translate(-6," + vis.gridSize / 1.5 + ")")
        .attr("class", "varLabel");

    vis.countryLabels = vis.svg.selectAll(".countryLabel")
        .data(vis.countries)
        .enter().append("text")
        .text(function(d){ return d; })
        .attr("x", 0)
        .attr("y", function(d, i){ return i * vis.gridSize})
        .style("text-anchor", "start")
        .attr("transform", "translate("+vis.gridSize/2 + ",-6) rotate (-90)")
        .attr("class", "countryLabel");


}
