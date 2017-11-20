// ranking: top 5 and bottom 5 ranking for all

/*
 *  rankingVis - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all the education data
 */

rankingVis = function(_parentElement, _data) {
    this.parentElement = _parentElement;
    this.data = _data;

    this.initVis();
}


/*
 *  Initialize Vis
 */

rankingVis.prototype.initVis = function() {
    var vis = this;
    console.log(vis.data);

    // * Creating svg
    vis.width = 1150;
    vis.height = 125;

    vis.svgRanking = d3.select("#ranking")
        .append("svg")
        .attr("width", vis.width)
        .attr("height", vis.height)
        .attr("align", "center");

    vis.addTopTitle = vis.svgRanking.append("text")
        .attr("x", 10)
        .attr("y", 30)
        .attr("class", "rank-title")
        .text("Top 5 countries");

    vis.addBottomTitle = vis.svgRanking.append("text")
        .attr("x", vis.width/2)
        .attr("y", 30)
        .attr("class", "rank-title")
        .text("Bottom 5 countries");

    vis.addTop5 = vis.svgRanking
        .append('text')
        .attr('class', 'rank-text');

    vis.addBottom5 = vis.svgRanking
        .append('text')
        .attr('class', 'rank-text');


    vis.wrangleData();
}



/*
 *  Data wrangling
 */

rankingVis.prototype.wrangleData = function() {
    var vis = this;

    vis.displayData = vis.data;

    // gen var for selected indicators
    var selectedVar = d3.select("#map-select-var").property("value");

    // Top 5
        // sort selected var
        vis.topData = vis.displayData.sort(function(a, b){
            return d3.descending(a[selectedVar], b[selectedVar])
        });

        // only select top 5
        vis.filteredTop = vis.topData.filter(function(d,i){
            return i < 5;
        });

        console.log(vis.filteredTop);


    // Bottom 5
        vis.bottomData = vis.displayData.sort(function(a, b){
            return d3.ascending(a[selectedVar], b[selectedVar]);
        });

        // only select top 5
        vis.filteredBottom = vis.bottomData.filter(function(d){
            if(d[selectedVar]!=0 ) return true;
            else return false;
        }).filter(function(d, i){
            return i < 5;
        });

        console.log(vis.filteredBottom);


    vis.updateVis();
}



/*
 *  UpdateVis
 */

rankingVis.prototype.updateVis = function() {
    var vis = this;

    console.log(vis.filteredTop[0].countryname);
    console.log(vis.filteredBottom[4].countryname);

    vis.addTop5.data(vis.filteredTop)
        .enter()
        .text(function(d){ return "1. " + d[0].countryname +
                "</br>2. " + d[1].countryname +
                "</br>3. " + d[2].countryname +
                "</br>4. " + d[3].countryname +
                "</br>5. " + d[4].countryname ;
        })
        .attr("class", 'rank-text')
        .attr("x", 10)
        .attr("y", vis.height/2);


    // vis.addTop5.merge(vis.addTop5)
    //     .transition().duration(1500);
    // vis.addTop5.exit().remove();

    vis.addBottom5.data(vis.filteredBottom).enter()
        .merge(vis.addBottom5)
        .transition().duration(1500)
        .attr("class", 'rank-text')
        .text(function(d){
            return d.countryname;
        })
        .attr("x", vis.width/2)
        .attr("y", function(d, i){
            return 100;
        });

    vis.addBottom5.exit().remove();

}








