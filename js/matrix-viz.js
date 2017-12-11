/*
 * Matrix constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 */


Matrix = function(_parentElement, _reg1Data) {
    this.parentElement = _parentElement;
    this.reg1Data = _reg1Data;
    this.displayData = [];

    this.yvar = "value";

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
    vis.buckets = 10;
    vis.colors = ['#67001f','#b2182b','#d6604d','#f4a582','#fddbc7','#d1e5f0','#92c5de','#4393c3','#2166ac','#053061'];
    vis.vars = ["Poor", "Number of siblings", "Household size", "Female", "Firstborn child", "Urban area", "Parents are married", "Household head is employed", "Mother completed HS", "Father completed HS", "% of community that completed HS"];
    vis.countries = ["Afghanistan", "Angola", "Armenia", "Bangladesh", "Benin", "Bolivia", "Burkina Faso", "Cambodia", "Cameroon", "Chad", "Colombia", "Comoros", "Congo",  "Congo DR", "Cote d'Ivoire", "Dominican Republic", "Ethiopia", "Gabon", "Gambia", "Ghana", "Guatemala", "Guinea", "Haiti", "Honduras", "India", "Indonesia", "Kenya", "Kyrgyz Republic", "Lesotho", "Liberia", "Malawi", "Mali", "Mozambique", "Myanmar", "Namibia", "Nepal", "Niger", "Pakistan", "Peru", "Rwanda", "Sierra Leone", "Tajikistan", "Timor-Leste", "Togo", "Uganda", "Zambia", "Zimbabwe"];

    // initialize SVG area
    vis.svg = d3.select("#chart").append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.colorScale = d3.scaleThreshold()
        .domain([-20, -15, -10, -5, 0, 5, 10, 15, 20, 25])
        .range(vis.colors);


    // Tooltip
    vis.tooltip = vis.svg.append("text")
        .attr('x', 5)
        .attr('y', 230)
        .attr("class", "tooltip-matrix");

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

    //vis.yvar = d3.select("#value").property("value");

    //vis.yvar = d3.select('input[name="enroll-outcome"]:checked').property("value");
    console.log(vis.yvar);

    vis.cards = vis.svg.selectAll(".code")
        .data(vis.displayData, function(d) { return d.var+':'+d.code});

    vis.cards.enter().append("rect")
        .merge(vis.cards)
        .on("mouseover", highlightCell)
        .on("mouseout", function () {
            d3.selectAll(".code").style("opacity",1);
            d3.selectAll(".varLabel").classed("text-highlight",false);
            d3.selectAll(".countryLabel").classed("text-highlight",false);
            //vis.tooltip.transition().duration(2000).style("opacity", 0.1);
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
        .style("opacity",1);

    function highlightCell() {
        vis.dataH = d3.select(this).data()[0];

        d3.selectAll(".code")
            .style("opacity",function(d) {
                return d.var === vis.dataH.var || d.code === vis.dataH.code ? "1" : "0.2";
            });
        d3.selectAll(".varLabel")
            .classed("text-highlight",function(r,ri){
                return ri===(vis.dataH.var-1);
            });
        d3.selectAll(".countryLabel")
            .classed("text-highlight",function(c,ci){
                return ci===(vis.dataH.code-1);
            });
        vis.tooltip.text(function(d) {
            if(vis.dataH[vis.yvar]>0) {
                if (vis.dataH.var === 1) {
                    return "In " + vis.dataH.DHS + ", " + "being in the bottom 40% of the wealth distribution is associated with a " + d3.format(".2f")(vis.dataH[vis.yvar]) + "% increase in the likelihood of enrollment.";
                }
                if (vis.dataH.var === 2) {
                    return "In " + vis.dataH.DHS + ", " + "one additional sibling is associated with a " + d3.format(".2f")(vis.dataH[vis.yvar]) + "% increase in the likelihood of enrollment.";
                }
                if (vis.dataH.var === 3) {
                    return "In " + vis.dataH.DHS + ", " + "one additional household member is associated with a " + d3.format(".2f")(vis.dataH[vis.yvar]) + "% increase in the likelihood of enrollment.";
                }
                if (vis.dataH.var === 4) {
                    return "In " + vis.dataH.DHS + ", " + "being female is associated with a " + d3.format(".2f")(vis.dataH[vis.yvar]) + "% increase in the likelihood of enrollment.";
                }
                if (vis.dataH.var === 5) {
                    return "In " + vis.dataH.DHS + ", " + "being the firstborn child is associated with a " + d3.format(".2f")(vis.dataH[vis.yvar]) + "% increase in the likelihood of enrollment.";
                }
                if (vis.dataH.var === 6) {
                    return "In " + vis.dataH.DHS + ", " + "living in an urban area is associated with a " + d3.format(".2f")(vis.dataH[vis.yvar]) + "% increase in the likelihood of enrollment.";
                }
                if (vis.dataH.var === 7) {
                    return "In " + vis.dataH.DHS + ", " + "having married parents is associated with a " + d3.format(".2f")(vis.dataH[vis.yvar]) + "% increase in the likelihood of enrollment.";
                }
                if (vis.dataH.var === 8) {
                    return "In " + vis.dataH.DHS + ", " + "having an employed household head is associated with a " + d3.format(".2f")(vis.dataH[vis.yvar]) + "% increase in the likelihood of enrollment.";
                }
                if (vis.dataH.var === 9) {
                    return "In " + vis.dataH.DHS + ", " + "having a mother who completed high school is associated with a " + d3.format(".2f")(vis.dataH[vis.yvar]) + "% increase in the likelihood of enrollment.";
                }
                if (vis.dataH.var === 10) {
                    return "In " + vis.dataH.DHS + ", " + "having a father who completed high school is associated with a " + d3.format(".2f")(vis.dataH[vis.yvar]) + "% increase in the likelihood of enrollment.";
                }
                if (vis.dataH.var === 11) {
                    return "In " + vis.dataH.DHS + ", " + "a 100% increase in the share of the local community that completed high school is associated with a " + d3.format(".2f")(vis.dataH[vis.yvar]) + "% increase in the likelihood of enrollment.";
                }
            }
            else {
                if (vis.dataH.var === 1) {
                    return "In " + vis.dataH.DHS + ", " + "being in the bottom 40% of the wealth distribution is associated with a " + d3.format(".2f")(vis.dataH[vis.yvar]) + "% decrease in the likelihood of enrollment.";
                }
                if (vis.dataH.var === 2) {
                    return "In " + vis.dataH.DHS + ", " + "one additional sibling is associated with a " + d3.format(".2f")(vis.dataH[vis.yvar]) + "% decrease in the likelihood of enrollment.";
                }
                if (vis.dataH.var === 3) {
                    return "In " + vis.dataH.DHS + ", " + "one additional household member is associated with a " + d3.format(".2f")(vis.dataH[vis.yvar]) + "% decrease in the likelihood of enrollment.";
                }
                if (vis.dataH.var === 4) {
                    return "In " + vis.dataH.DHS + ", " + "being female is associated with a " + d3.format(".2f")(vis.dataH[vis.yvar]) + "% decrease in the likelihood of enrollment.";
                }
                if (vis.dataH.var === 5) {
                    return "In " + vis.dataH.DHS + ", " + "being the firstborn child is associated with a " + d3.format(".2f")(vis.dataH[vis.yvar]) + "% decrease in the likelihood of enrollment.";
                }
                if (vis.dataH.var === 6) {
                    return "In " + vis.dataH.DHS + ", " + "living in an urban area is associated with a " + d3.format(".2f")(vis.dataH[vis.yvar]) + "% decrease in the likelihood of enrollment.";
                }
                if (vis.dataH.var === 7) {
                    return "In " + vis.dataH.DHS + ", " + "having married parents is associated with a " + d3.format(".2f")(vis.dataH[vis.yvar]) + "% decrease in the likelihood of enrollment.";
                }
                if (vis.dataH.var === 8) {
                    return "In " + vis.dataH.DHS + ", " + "having an employed household head is associated with a " + d3.format(".2f")(vis.dataH[vis.yvar]) + "% decrease in the likelihood of enrollment.";
                }
                if (vis.dataH.var === 9) {
                    return "In " + vis.dataH.DHS + ", " + "having a mother who completed high school is associated with a " + d3.format(".2f")(vis.dataH[vis.yvar]) + "% decrease in the likelihood of enrollment.";
                }
                if (vis.dataH.var === 10) {
                    return "In " + vis.dataH.DHS + ", " + "having a father who completed high school is associated with a " + d3.format(".2f")(vis.dataH[vis.yvar]) + "% decrease in the likelihood of enrollment.";
                }
                if (vis.dataH.var === 11) {
                    return "In " + vis.dataH.DHS + ", " + "a 100% increase in the share of the local community that completed high school is associated with a " + d3.format(".2f")(vis.dataH[vis.yvar]) + "% decrease in the likelihood of enrollment.";
                }
            }
        }).style("opacity",1);
    }


    vis.cards.exit().remove();

    // legend
    vis.legend = vis.svg.selectAll(".legend")
        .data([-25].concat(vis.colorScale.domain()), function(d) { return d});

    vis.legend_g = vis.legend.enter().append("g")
        .attr("class", "legend");

    vis.legend_g.append("rect")
        .attr("x", function(d, i) { return vis.legendElementWidth * i + 475})
        .attr("y", vis.height +13)
        .attr("width", vis.legendElementWidth)
        .attr("height", vis.gridSize / 2)
        .style("fill", function(d, i) { return vis.colors[i]})
        .style("opacity",1);

    vis.legend_g.append("text")
        .attr("class", "mono")
        .text(function(d) { return d})
        .attr("x", function(d, i) { return vis.legendElementWidth * i + 475})
        .attr("y", vis.height + vis.gridSize + 13);

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
        .attr("class", function (d,i) { return "varLabel mono r"+i;} ) ;

    vis.countryLabels = vis.svg.selectAll(".countryLabel")
        .data(vis.countries)
        .enter().append("text")
        .text(function(d){ return d; })
        .attr("x", 0)
        .attr("y", function(d, i){ return i * vis.gridSize})
        .style("text-anchor", "start")
        .attr("transform", "translate("+vis.gridSize/2 + ",-6) rotate (-90)")
        .attr("class",  function (d,i) { return "countryLabel mono c"+i;} );


}
