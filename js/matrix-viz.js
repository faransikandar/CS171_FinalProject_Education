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
    vis.margin = { top: 135, right: 0, bottom: 50, left: 184 };
    vis.width = 1300 - vis.margin.left - vis.margin.right;
    vis.height = 450 - vis.margin.top - vis.margin.bottom;

    vis.gridSize = Math.floor(vis.width / 53);
    vis.col_number=47;
    vis.row_number=11;
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
        .attr('y', 250)
        .attr("class", "tooltip-matrix");

    // Sort
    vis.rowSortOrder=false;
    vis.colSortOrder=false;

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
        .attr("class",  function(d){return "code cell bordered cr"+(d.var-1)+" cc"+(d.code-1);})
        .attr("width", vis.gridSize)
        .attr("height", vis.gridSize)
        .style("fill", vis.colors[0])
        .merge(vis.cards)
        .transition()
        .duration(1000)
        .style("fill", function(d) { return vis.colorScale(d.value2)})
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
            if(vis.dataH.value2>0) {
                if (vis.dataH.var === 1) {
                    return "In " + vis.dataH.DHS + ", " + "being in the bottom 40% of the wealth distribution is associated with a " + d3.format(".2f")(vis.dataH.value2) + "% increase in the likelihood of enrollment.";
                }
                if (vis.dataH.var === 2) {
                    return "In " + vis.dataH.DHS + ", " + "one additional sibling is associated with a " + d3.format(".2f")(vis.dataH.value2) + "% increase in the likelihood of enrollment.";
                }
                if (vis.dataH.var === 3) {
                    return "In " + vis.dataH.DHS + ", " + "one additional household member is associated with a " + d3.format(".2f")(vis.dataH.value2) + "% increase in the likelihood of enrollment.";
                }
                if (vis.dataH.var === 4) {
                    return "In " + vis.dataH.DHS + ", " + "being female is associated with a " + d3.format(".2f")(vis.dataH.value2) + "% increase in the likelihood of enrollment.";
                }
                if (vis.dataH.var === 5) {
                    return "In " + vis.dataH.DHS + ", " + "being the firstborn child is associated with a " + d3.format(".2f")(vis.dataH.value2) + "% increase in the likelihood of enrollment.";
                }
                if (vis.dataH.var === 6) {
                    return "In " + vis.dataH.DHS + ", " + "living in an urban area is associated with a " + d3.format(".2f")(vis.dataH.value2) + "% increase in the likelihood of enrollment.";
                }
                if (vis.dataH.var === 7) {
                    return "In " + vis.dataH.DHS + ", " + "having married parents is associated with a " + d3.format(".2f")(vis.dataH.value2) + "% increase in the likelihood of enrollment.";
                }
                if (vis.dataH.var === 8) {
                    return "In " + vis.dataH.DHS + ", " + "having an employed household head is associated with a " + d3.format(".2f")(vis.dataH.value2) + "% increase in the likelihood of enrollment.";
                }
                if (vis.dataH.var === 9) {
                    return "In " + vis.dataH.DHS + ", " + "having a mother who completed high school is associated with a " + d3.format(".2f")(vis.dataH.value2) + "% increase in the likelihood of enrollment.";
                }
                if (vis.dataH.var === 10) {
                    return "In " + vis.dataH.DHS + ", " + "having a father who completed high school is associated with a " + d3.format(".2f")(vis.dataH.value2) + "% increase in the likelihood of enrollment.";
                }
                if (vis.dataH.var === 11) {
                    return "In " + vis.dataH.DHS + ", " + "a 100% increase in the share of the local community that completed high school is associated with a " + d3.format(".2f")(vis.dataH.value2) + "% increase in the likelihood of enrollment.";
                }
            }
            else {
                if (vis.dataH.var === 1) {
                    return "In " + vis.dataH.DHS + ", " + "being in the bottom 40% of the wealth distribution is associated with a " + d3.format(".2f")(vis.dataH.value2) + "% decrease in the likelihood of enrollment.";
                }
                if (vis.dataH.var === 2) {
                    return "In " + vis.dataH.DHS + ", " + "one additional sibling is associated with a " + d3.format(".2f")(vis.dataH.value2) + "% decrease in the likelihood of enrollment.";
                }
                if (vis.dataH.var === 3) {
                    return "In " + vis.dataH.DHS + ", " + "one additional household member is associated with a " + d3.format(".2f")(vis.dataH.value2) + "% decrease in the likelihood of enrollment.";
                }
                if (vis.dataH.var === 4) {
                    return "In " + vis.dataH.DHS + ", " + "being female is associated with a " + d3.format(".2f")(vis.dataH.value2) + "% decrease in the likelihood of enrollment.";
                }
                if (vis.dataH.var === 5) {
                    return "In " + vis.dataH.DHS + ", " + "being the firstborn child is associated with a " + d3.format(".2f")(vis.dataH.value2) + "% decrease in the likelihood of enrollment.";
                }
                if (vis.dataH.var === 6) {
                    return "In " + vis.dataH.DHS + ", " + "living in an urban area is associated with a " + d3.format(".2f")(vis.dataH.value2) + "% decrease in the likelihood of enrollment.";
                }
                if (vis.dataH.var === 7) {
                    return "In " + vis.dataH.DHS + ", " + "having married parents is associated with a " + d3.format(".2f")(vis.dataH.value2) + "% decrease in the likelihood of enrollment.";
                }
                if (vis.dataH.var === 8) {
                    return "In " + vis.dataH.DHS + ", " + "having an employed household head is associated with a " + d3.format(".2f")(vis.dataH.value2) + "% decrease in the likelihood of enrollment.";
                }
                if (vis.dataH.var === 9) {
                    return "In " + vis.dataH.DHS + ", " + "having a mother who completed high school is associated with a " + d3.format(".2f")(vis.dataH.value2) + "% decrease in the likelihood of enrollment.";
                }
                if (vis.dataH.var === 10) {
                    return "In " + vis.dataH.DHS + ", " + "having a father who completed high school is associated with a " + d3.format(".2f")(vis.dataH.value2) + "% decrease in the likelihood of enrollment.";
                }
                if (vis.dataH.var === 11) {
                    return "In " + vis.dataH.DHS + ", " + "a 100% increase in the share of the local community that completed high school is associated with a " + d3.format(".2f")(vis.dataH.value2) + "% decrease in the likelihood of enrollment.";
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
        .attr("x", function(d, i) { return vis.legendElementWidth * i + 520})
        .attr("y", vis.height +12)
        .attr("width", vis.legendElementWidth)
        .attr("height", vis.gridSize / 2)
        .style("fill", function(d, i) { return vis.colors[i]})
        .style("opacity",1);

    vis.legend_g.append("text")
        .attr("class", "mono")
        .text(function(d) { return d})
        .attr("x", function(d, i) { return vis.legendElementWidth * i + 520})
        .attr("y", vis.height + vis.gridSize + 12);

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
        .attr("class", function (d,i) { return "varLabel mono r"+i;} )
        .on("click", function(d,i) {vis.rowSortOrder=!vis.rowSortOrder;
            sortbylabel("r",i, vis.rowSortOrder); d3.select("#order").property("selectedIndex", 1).node().focus();;});

    vis.countryLabels = vis.svg.selectAll(".countryLabel")
        .data(vis.countries)
        .enter().append("text")
        .text(function(d){ return d; })
        .attr("x", 0)
        .attr("y", function(d, i){ return i * vis.gridSize})
        .style("text-anchor", "start")
        .attr("transform", "translate("+vis.gridSize/2 + ",-6) rotate (-90)")
        .attr("class",  function (d,i) { return "countryLabel mono c"+i;} )
        .on("click", function(d,i) {vis.colSortOrder=!vis.colSortOrder;
            sortbylabel("c",i,vis.colSortOrder);d3.select("#order").property("selectedIndex", 1).node().focus();;})
    ;



// Change ordering of cells

    function sortbylabel(rORc,i,sortOrder){
        var t = vis.svg.transition().duration(3000);
        var log2r=[];
        var sorted; // sorted is zero-based index
        d3.selectAll(".c"+rORc+i)
            .filter(function(ce){
                log2r.push(ce.value2);
            });

        console.log(log2r);

        if(rORc=="r"){ // sort by country
            sorted=d3.range(vis.col_number).sort(function(a,b){ if(sortOrder){ return log2r[b]-log2r[a];}else{ return log2r[a]-log2r[b];}});
            console.log(sorted);
            t.selectAll(".cell")
                .attr("x", function(d) { return sorted.indexOf(d.code-1) * vis.gridSize; })
            ;
            t.selectAll(".countryLabel")
                .attr("y", function (d, i) { return sorted.indexOf(i) * vis.gridSize; })
            ;
        }else if(rORc=="c") { // sort by var
            sorted=d3.range(vis.row_number).sort(function(a,b){
                if(sortOrder){
                    return log2r[b]-log2r[a];
                }
                else{
                    return log2r[a]-log2r[b];
                }
            });
            console.log(sorted);
            t.selectAll(".cell")
                .attr("y", function(d) { return sorted.indexOf(d.var-1) * vis.gridSize; })
            ;
            t.selectAll(".varLabel")
                .attr("y", function (d, i) { return sorted.indexOf(i) * vis.gridSize; })
            ;
        }
    }


    //





}
