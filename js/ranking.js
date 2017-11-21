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
    vis.height = 140;

    vis.svgRanking = d3.select("#ranking")
        .append("svg")
        .attr("width", vis.width)
        .attr("height", vis.height)
        .attr("align", "center")
        .attr('id', 'ranking-svg');

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

    vis.addTop5 = d3.select("#ranking-svg")
        .append('text')
        // .attr('class', 'rank-text')
        .attr('id', 'top5-text');

    vis.addBottom5 = d3.select('#ranking-svg')
        .append('text')
        // .attr('class', 'rank-text')
        .attr('id', 'bottom5-text');


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


    vis.addTop5
            // .data(vis.filteredTop).enter()
            // .merge(vis.addTop5)
            // .transition()
            // .duration(1000)
            .text(function(){
                return "1. " + vis.filteredTop[0].countryname;
            })
            .attr("class", 'rank-text')
            .attr("x", 20)
            .attr("y", 50)
        .append('tspan')
            .text(function(){
                return "2. " + vis.filteredTop[1].countryname;
            }).attr('x', 20).attr("y", 70)
        .append('tspan')
            .text(function(){ return "3. " + vis.filteredTop[2].countryname; })
            .attr('x', 20).attr("y", 90)
        .append('tspan')
            .text(function(){ return "4. " + vis.filteredTop[3].countryname; })
            .attr('x', 20).attr("y", 110)
        .append('tspan')
            .text(function(){ return "5. " + vis.filteredTop[4].countryname; })
            .attr('x', 20).attr("y", 130);


    vis.addBottom5
        // .data(vis.filteredBottom).enter()
        // .merge(vis.addBottom5)
        // .transition()
        // .duration(1500)
        .text(function(){
            return "1. " + vis.filteredBottom[0].countryname;
        })
        .attr("class", 'rank-text')
        .attr("x", vis.width/2 +10)
        .attr("y", 50)
        .append('tspan')
        .text(function(){
            return "2. " + vis.filteredBottom[1].countryname; })
        .attr('x', vis.width/2 +10).attr("y", 70)
        .append('tspan')
        .text(function(){ return "3. " + vis.filteredBottom[2].countryname; })
        .attr('x', vis.width/2 +10).attr("y", 90)
        .append('tspan')
        .text(function(){ return "4. " + vis.filteredBottom[3].countryname; })
        .attr('x', vis.width/2 +10).attr("y", 110)
        .append('tspan')
        .text(function(){ return "5. " + vis.filteredBottom[4].countryname; })
        .attr('x', vis.width/2 +10).attr("y", 130);


}

rankingVis.prototype.textRemove = function(){
    var vis = this;

    d3.select('.rank-text').remove();

    // d3.select('#top5-text').remove();
    // d3.select('#bottom5-text').remove();

    // vis.addTop5.remove();
    // vis.addBottom5.remove();

    vis.wrangleData();
}








