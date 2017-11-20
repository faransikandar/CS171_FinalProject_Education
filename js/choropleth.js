// Choropleth - comparing between different countries for edu indicators

/*
 *  choroplethMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _geoJSON         -- geoJSON map data
 *  @param _data            -- Array with all the education data
 */

choroplethMap = function(_parentElement, _geoJSON, _eduData) {
    this.parentElement = _parentElement;
    this.geoJSON = _geoJSON;
    this.eduData = _eduData;

    this.initVis();
}



/*
 *  Initialize Vis
 */

choroplethMap.prototype.initVis = function() {
    var vis = this;

    // * Creating svg
    vis.width = 1150;
    vis.height = 650;

    vis.svgMap = d3.select("#map").append("svg")
        .attr("width", vis.width)
        .attr("height", vis.height)
        .attr("align", "center");


    // *  Creating scales
        // color scale
        vis.colorScale = d3.scaleThreshold()
            .range(colorbrewer.GnBu[9]);


    // *  Tooltips
    // lydia's version
    // var tooltip = d3.select("body")
    //     .append("div")
    //     .attr("class", "tooltip")
    //     .style("opacity", 0);


    // * Generate maps and project it on to svg
        // initiating map projection
        vis.projection = d3.geoMercator()
            .translate([vis.width*0.45, vis.height * 2 / 3])
            .scale([155]);

        // creating geopath for the maps
        vis.path = d3.geoPath()
            .projection(vis.projection);

        vis.mapPath = vis.svgMap.selectAll(".map")
            .data(vis.geoJSON);



    // run updateChoropleth() function
    vis.updateChoropleth();

}




/*
 *  UpdateVis
 */

// * Implement Map
choroplethMap.prototype.updateChoropleth = function() {
    var vis = this;

    console.log(vis.geoJSON);
    console.log(vis.eduData);

    // gen var for selected indicators
    vis.selectedVar = d3.select("#map-select-var").property("value");
    console.log(vis.selectedVar);

    // gen selectedVar by country
    vis.varByCountry = {};
    vis.eduData.forEach(function(d){
        vis.varByCountry[d.countryname] = +d[vis.selectedVar];
        });

    // update colorscale domain
    var extent = d3.extent(vis.eduData, function(d) {
        return d[vis.selectedVar];
    });
    console.log(extent);

    var step = Math.floor((extent[1] - extent[0])/9);
    console.log(step);

    var legendSteps = d3.range(extent[0], extent[1], step);

    // legendSteps.push([100]); // without 100 the break would be 99 max not 100 max.
    console.log(legendSteps);

    vis.colorScale.domain(legendSteps);

    // appending map
    vis.mapPath.enter()
            .append("path")
                .attr("d", vis.path)
                .attr("class", "map")
                .style("fill", function(d){
                    return vis.colorScale(vis.varByCountry[d.properties.name]);
                });

    // adding tooltip to the maps

        // trying yourself (from hw5)
        var tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-10, 0])
            .html(function(d){
                return "<b>" + d.name + "</b>"+ "</br>" + selectedVar+ ": " + d[selectedVar];
            });

    vis.svgMap.call(tip);

    vis.mapPath.on("mouseover", tip.show)
            .on("mouseout", tip.hide);


        // // lydia's version
        // mapPath.on("mouseover", function(d) {
        //     d3.select(this)
        //         .transition().duration(300)
        //         .style("opacity", 1);
        //     tooltip.transition().duration(300)
        //         .style("opacity", 1);
        //     tooltip.html(function (d) {
        //         if (varByCountry == 0) {
        //             return d.properties.name + " <br> " + "No available data"
        //         } else {
        //             return d.properties.name + " <br> " + varByCountry[d.properties.name] + "%";
        //         }
        //     })
        //         .style("left", (d3.event.pageX) + "px")
        //         .style("top", (d3.event.pageY - 30) + "px")
        //     })
        //     .on("mouseout", function () {
        //         d3.select(this)
        //             .transition().duration(100)
        //             .style("opacity", 1);
        //         tooltip.transition().duration(300)
        //             .style("opacity", 0);
        //     });



    // appending legend
        var legend = vis.svgMap.selectAll('.legend')
            .data(vis.colorScale.range());

        legend.enter()
            .append('rect')
            .merge(legend)
            .attr('class', 'legend')
            .attr("x", 50)
            .attr("y", function (d, i) { return vis.height/1.5 + i * 16; })
            .attr("width", 14)
            .attr("height", 16)
            .style("fill", function (d) { return d; });

        legend.exit().remove();

    // Legend labels
        var legendLabel = vis.svgMap.selectAll('.legendLabel')
            .data(legendSteps);

        console.log(d3.format(".2s")(legendSteps[0]));

        legendLabel.enter()
            .append('text')
            .merge(legendLabel)
            .attr('class', 'legendLabel')
            .attr("x", 70)
            .attr("y", function (d, i) { return vis.height/1.5 + i * 16; })
            .attr("dy", "4px")
            .text(function (d, i) {
                return i ? d3.format(".2s")(legendSteps[i]) : d3.format(".2s")(legendSteps[i]) + " " + "%";
            });

        legendLabel.exit().remove();

}

