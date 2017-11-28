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
            })
        .attr('title', function(d){
            return "<b>" + d.properties.name + "</b>"+ "</br>" + showVariable(d)+ "</br>" + showData(d) ;
        });

    function showVariable(){
        if(vis.selectedVar=="avg13_literacy1524") { return 'Literacy Rate (Age 15-24)';}
        if(vis.selectedVar=="avg13_pri_compt") { return "Primary School Completion Rate (%)" ;}
        if(vis.selectedVar=="avg13_pri_attain") { return 'Attainment Rate (at least Primary School) (%)' ;}
        if(vis.selectedVar=="avg13_sec_low_attain") { return 'Attainment Rate (at least Lower Secondary School) (%)'; }
        if(vis.selectedVar=="avg13_sec_up_attain") { return 'Attainment Rate (at least Upper Secondary School) (%)'; }
        if(vis.selectedVar=="avg13_bac_attain") { return "Attainment Rate (at least Bachelor's Degree) (%)"; }
        if(vis.selectedVar=="avg13_mas_attain") { return "Attainment Rate (at least Masters's Degree) (%)" ;}
        if(vis.selectedVar=="avg13_pri_enroll") { return "Enrollment Rate (Primary School) (%)" ;}
        if(vis.selectedVar=="avg13_sec_enroll") { return "Enrollment Rate (Secondary School) (%)" ;}
        if(vis.selectedVar=="avg13_ter_enroll") { return "Enrollment Rate (Tertiary School) (%)" ;}
        if(vis.selectedVar=="avg13_gov_edu") { return "Government Expenditure on education (% of GDP)" ;}
    }

    function showData(d){
        if(vis.varByCountry[d.properties.name]==0){
            return "Data Not Available" ;
        } else {
            return vis.varByCountry[d.properties.name] + " %";
        }
    };

    function roundData(data){
        return data.toFixed(2);
    }

    // adding tooltip to the maps

        // try with tooltipsy
        $('.map').tooltipsy({
            alignTo: 'cursor',
            offset: [10, 10],
            css: {
                'padding': '10px',
                'max-width': '200px',
                'color': '#fafafa',
                'background-color': 'rgba(101, 101, 101, .75)',
                'border': '0.1px solid #656565',
                'border-radius': '10px',
                '-moz-box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
                '-webkit-box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
                'box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
                'text-shadow': 'none'
            }
        });


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

