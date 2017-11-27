// Line graph - attainment profile of different countries

/*
 *  attainmentVis - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all the education data
 */

attainmentVis = function(_parentElement, _data) {
    this.parentElement = _parentElement;
    this.data = _data;

    this.initVis();
    this.addDropdown();
}

/*
 *  Adding Dropdown Menu
 */

attainmentVis.prototype.addDropdown = function() {
    var vis = this;

    // reshaping the data by country
    vis.dataByCountry = d3.nest()
        .key(function(d){ return d.country; })
        .entries(vis.data);

    console.log(vis.dataByCountry); // reshaping the data by country

    // creating the dropdown menu
    $.each(vis.dataByCountry, function(key, value) {
        $('#line-select-country')
            .append($("<option>")
                .attr("value", value.key)
                .text(value.key));
    });

}


/*
 *  Initialize Vis
 */

attainmentVis.prototype.initVis = function() {
    var vis = this;

    vis.margin = { bottom: 50, top:20, left:50, right:20 };

    vis.width = 700 - vis.margin.left - vis.margin.right;
    vis.height = 550 - vis.margin.top - vis.margin.bottom;

    vis.svgLine = d3.select('#line-area')
        .append('svg')
            .attr('width', vis.width + vis.margin.left + vis.margin.right)
            .attr('height', vis.height + vis.margin.top + vis.margin.bottom)
            .attr('align', 'center')
            .attr('id', 'svg-line')
        .append('g')
            .attr('transform', 'translate('+ vis.margin.left +',' + vis.margin.top +')');


    // scales and axes
    vis.x = d3.scaleLinear()
        .range([0, vis.width]); // domain of x should change depending on the country.

    vis.y = d3.scaleLinear()
        .domain([0,1])
        .range([vis.height, 0]);

    vis.xAxis = d3.axisBottom().scale(vis.x);
    vis.yAxis = d3.axisLeft().scale(vis.y);

    vis.addX = vis.svgLine.append('g')
        .attr('class', 'x-axis axis')
        .attr('transform', 'translate(0,' + (vis.height) + ')');

    vis.addY = vis.svgLine.append('g')
        .attr('class', 'y-axis axis');


    // lines
        // vis.selectedAge = "pct20_29";
        // vis.ageLabel = "20-29";

    vis.addLine15 = vis.svgLine.append('path')
        .attr("class", "line line-15");

    vis.addLine20 = vis.svgLine.append('path')
        .attr("class", "line line-20");

    vis.addLine30 = vis.svgLine.append('path')
        .attr("class", "line line-30");

    vis.addLine40 = vis.svgLine.append('path')
        .attr("class", "line line-40");

    var gap = 20;
    var group = 10;

    // legends / rect
    vis.legend = vis.svgLine.append('circle')
        .attr('cx', vis.width*0.8)
        .attr('cy', 0)
        .attr('r', 7)
        .attr('class', 'legend')
        .style('fill', '#663399');

    vis.legendText = vis.svgLine.append('text')
        .attr('x', vis.width*0.8 + 15)
        .attr('y', 4)
        .attr('class', 'legend-text')
        .text('All population');

    vis.legendMale = vis.svgLine.append('circle')
        .attr('cx', vis.width*0.8)
        .attr('cy', group+gap)
        .attr('r', 7)
        .attr('class', 'legend legend-gender')
        .style('fill', '#1d65af');

    vis.legendMale = vis.svgLine.append('text')
        .attr('x', vis.width*0.8 + 15)
        .attr('y', 4+ group + gap)
        .attr('class', 'legend-text legend-gender')
        .text('Male Population');

    vis.legendFemale = vis.svgLine.append('circle')
        .attr('cx', vis.width*0.8)
        .attr('cy', group +gap*2)
        .attr('r', 7)
        .attr('class', 'legend legend-gender')
        .style('fill', '#a52731');

    vis.legendFemale = vis.svgLine.append('text')
        .attr('x', vis.width*0.8 + 15)
        .attr('y', 4+ group +gap*2)
        .attr('class', 'legend-text legend-gender')
        .text('Female Population');

    vis.legendUrban = vis.svgLine.append('circle')
        .attr('cx', vis.width*0.8)
        .attr('cy', group*2+gap*3)
        .attr('r', 7)
        .attr('class', 'legend legend-urban')
        .style('fill', '#656565');

    vis.legendUrban = vis.svgLine.append('text')
        .attr('x', vis.width*0.8 + 15)
        .attr('y', 4+ group*2 +gap*3)
        .attr('class', 'legend-text legend-urban')
        .text('Urban Population');

    vis.legendRural = vis.svgLine.append('circle')
        .attr('cx', vis.width*0.8)
        .attr('cy', group*2 + gap*4)
        .attr('r', 7)
        .attr('class', 'legend legend-urban')
        .style('fill', '#147f27');

    vis.legendRural = vis.svgLine.append('text')
        .attr('x', vis.width*0.8 + 15)
        .attr('y', 4 +group*2 +gap*4)
        .attr('class', 'legend-text legend-urban')
        .text('Rural Population');

    vis.legendQ1 = vis.svgLine.append('circle')
        .attr('cx', vis.width*0.8)
        .attr('cy', group*3+ gap*5)
        .attr('r', 7)
        .attr('class', 'legend legend-income')
        .style('fill', '#08589e');

    vis.legendQ1 = vis.svgLine.append('text')
        .attr('x', vis.width*0.8 + 15)
        .attr('y', 4 +group*3+gap*5)
        .attr('class', 'legend-text legend-income')
        .text('First income quintile');

    vis.legendQ2 = vis.svgLine.append('circle')
        .attr('cx', vis.width*0.8)
        .attr('cy', group*3+gap*6)
        .attr('r', 7)
        .attr('class', 'legend legend-income')
        .style('fill', '#2b8cbe');

    vis.legendQ2 = vis.svgLine.append('text')
        .attr('x', vis.width*0.8 + 15)
        .attr('y', 4 +group*3+gap*6)
        .attr('class', 'legend-text legend-income')
        .text('Second income quintile');

    vis.legendQ3 = vis.svgLine.append('circle')
        .attr('cx', vis.width*0.8)
        .attr('cy', group*3+gap*7)
        .attr('r', 7)
        .attr('class', 'legend legend-income')
        .style('fill', '#4eb3d3');

    vis.legendQ3 = vis.svgLine.append('text')
        .attr('x', vis.width*0.8 + 15)
        .attr('y', 4+group*3 +gap*7)
        .attr('class', 'legend-text legend-income')
        .text('Third Income Quintile');

    vis.legendQ4 = vis.svgLine.append('circle')
        .attr('cx', vis.width*0.8)
        .attr('cy', group*3+gap*8)
        .attr('r', 7)
        .attr('class', 'legend legend-income')
        .style('fill', '#7bccc4');

    vis.legendQ4 = vis.svgLine.append('text')
        .attr('x', vis.width*0.8 + 15)
        .attr('y', 4+group*3 +gap*8)
        .attr('class', 'legend-text legend-income')
        .text('Forth Income Quintile');

    vis.legendQ5 = vis.svgLine.append('circle')
        .attr('cx', vis.width*0.8)
        .attr('cy', group*3+gap*9)
        .attr('r', 7)
        .attr('class', 'legend legend-income')
        .style('fill', '#a8ddb5');

    vis.legendQ5 = vis.svgLine.append('text')
        .attr('x', vis.width*0.8 + 15)
        .attr('y', 4 +group*3+gap*9)
        .attr('class', 'legend-text legend-income')
        .text('Fifth Income Quintile');



    // initializing tool tips
    vis.tooltip = d3.select('#profilepage').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);


    vis.wrangleData();
}


/*
 *  Data wrangling
 */

attainmentVis.prototype.wrangleData = function() {
    var vis = this;

    vis.selectedCountry = d3.select("#line-select-country").property("value");


    // filtering by country
    console.log(vis.data);
    console.log(vis.selectedCountry);

    // NOTE: Not doing average anymore but doing comparison with average of the developed countries
        // creating the var for world average for each age group
        // vis.dataByEdyears = d3.nest()
        //     .key(function(d) { return d.edyears; })
        //     .entries(vis.data);
        // console.log(vis.dataByEdyears);

        // vis.worldAverage = d3.mean(vis.data, function(d){
        //     for(i=0; i < d.edyears.length; i++){
        //         return d.pct15_19;
        //     }
        // });

    // selecting the data to be used for the line graph
    if(vis.selectedCountry == "default") {
        vis.filteredData = vis.data; //need to change this to the world average for each education year
    } else {
        vis.filteredData = vis.data.filter(function(d){
            if(vis.selectedCountry == d.country) return true;
            else return false;
        })
    };

    console.log(vis.filteredData);

    vis.updateLineVis();
}


/*
 *  UpdateVis
 */

attainmentVis.prototype.updateLineVis = function() {
    var vis = this;

    // testing variable for selection of age:
        // console.log(vis.ageLabel);
        // console.log(vis.selectedAge);


    // update domain for axis
    vis.eduMin = d3.min(vis.filteredData, function(d) { return d.edyears; });
    vis.eduMax = d3.max(vis.filteredData, function(d) { return d.edyears; });

    vis.x.domain([vis.eduMin, vis.eduMax]);


    // adding Axes
    vis.addX.transition().duration(1500).call(vis.xAxis);
    vis.addY.transition().duration(1500).call(vis.yAxis);


    // adding lines
    vis.line15 = d3.line()
        .x(function(d){ return vis.x(d.edyears); })
        .y(function(d){ return vis.y(d.pct15_19); })
        .curve(d3.curveLinear);

    vis.addLine15.transition().duration(1500)
        .attr('d', vis.line15(vis.filteredData))
        .style('opacity', function(){
            if(vis.selectedCountry=="default") { return 0; }
            else { return 0; }
        });

    vis.line20 = d3.line()
        .x(function(d){ return vis.x(d.edyears); })
        .y(function(d){ return vis.y(d.pct20_29); })
        .curve(d3.curveLinear);

    vis.addLine20.transition().duration(1500)
        .attr('d', vis.line20(vis.filteredData))
        .style('opacity', function(){
            if(vis.selectedCountry=="default") { return 0; }
            else { return 1; }
        });

    vis.line30 = d3.line()
        .x(function(d){ return vis.x(d.edyears); })
        .y(function(d){ return vis.y(d.pct30_39); })
        .curve(d3.curveLinear);

    vis.addLine30.transition().duration(1500)
        .attr('d', vis.line30(vis.filteredData))
        .style('opacity', function(){
            if(vis.selectedCountry=="default") { return 0; }
            else { return 0; }
        });

    vis.line40 = d3.line()
        .x(function(d){ return vis.x(d.edyears); })
        .y(function(d){ return vis.y(d.pct40_49); })
        .curve(d3.curveLinear);

    vis.addLine40.transition().duration(1500)
        .attr('d', vis.line40(vis.filteredData))
        .style('opacity', function(){
            if(vis.selectedCountry=="default") { return 0; }
            else { return 0; }
        });


    // axis labels
    vis.xLabel = d3.select("#svg-line").append('text')
        .text("Years of Education")
        .attr('x', vis.width+vis.margin.left)
        .attr('y', vis.height+vis.margin.top +35)
        .attr('class', 'x-label');

    vis.yLabel = d3.select('#svg-line').append('text')
        .text("Share of Population")
        .attr('x', -20)
        .attr('y', vis.margin.left-35)
        .attr('class', 'y-label');


    // Tooltips

        // var tip = d3.tip()
        //     .attr("class", "d3-tip")
        //     .offset([-10, 0])
        //     .html(function(d){
        //         return "<b>" + d.country +"</b>" +
        //             "</br> Age: 20-29 </br> Share of the Population: " +
        //             d.pct20_29*100;
        //     });
        //
        // vis.svgLine.call(tip);


    // dots
    vis.circles15 = vis.svgLine.selectAll('circle.points15')
        .data(vis.filteredData);

    vis.circles15.enter()
        .append('circle')
        .merge(vis.circles15)
        .attr('class', 'points points15')
        .attr('r', 5)
        .attr('cx', function(d){
            return vis.x(d.edyears);
        })
        .attr('cy', function(d){
            return vis.y(d.pct15_19);
        })
        .style('opacity', function(){
           if(vis.selectedCountry=="default") { return 0; }
           else { return 0; }
        });

    vis.circles20 = vis.svgLine.selectAll('circle.points20')
        .data(vis.filteredData);

    vis.circles20.enter()
        .append('circle')
        .merge(vis.circles20)
        .attr('class', 'points points20')
        .attr('r', 5)
        .attr('cx', function(d){
            return vis.x(d.edyears);
        })
        .attr('cy', function(d){
            return vis.y(d.pct20_29);
        })
        .style('opacity', function(){
            if(vis.selectedCountry=="default") { return 0; }
            else { return 1; }
        });

    vis.circles30 = vis.svgLine.selectAll('circle.points30')
        .data(vis.filteredData);

    vis.circles30.enter()
        .append('circle')
        .merge(vis.circles30)
        .attr('class', 'points points30')
        .attr('r', 5)
        .attr('cx', function(d){
            return vis.x(d.edyears);
        })
        .attr('cy', function(d){
            return vis.y(d.pct30_39);
        })
        .style('opacity', function(){
            if(vis.selectedCountry=="default") { return 0; }
            else { return 0; }
        });

    vis.circles40 = vis.svgLine.selectAll('circle.points40')
        .data(vis.filteredData);

    vis.circles40.enter()
        .append('circle')
        .merge(vis.circles40)
        .attr('class', 'points points40')
        .attr('r', 5)
        .attr('cx', function(d){
            return vis.x(d.edyears);
        })
        .attr('cy', function(d){
            return vis.y(d.pct40_49);
        })
        .style('opacity', function(){
            if(vis.selectedCountry=="default") { return 0; }
            else { return 0; }
        });


        // .attr('mouseover', function(d){
        //     vis.tooltip.transition().duration(200)
        //         .style('opacity', 0.5);
        //
        //     vis.tooltip.html(showTooltip)
        //         .style("left", (d3.event.pageX) + "px")
        //         .style("top", (d3.event.pageY) + "px");
        // })
        // .attr('mouseout', function(){
        //     vis.tooltip.transition().duration(500)
        //         .style('opacity', 0);
        // });
        // .attr('mouseover', tip.show)
        // .attr('mouseout', tip.hide);

    // var showTooltip = function(d){
    //     return "<b>" + d.key +"</b>" +
    //         "</br> Age: " + vis.ageLabel +
    //         "</br> Share of the Population: " +  d[vis.selectedAge];
    // };

    vis.circles15.transition().duration(1500);
    vis.circles20.transition().duration(1500);
    vis.circles30.transition().duration(1500);
    vis.circles40.transition().duration(1500);

    // exit().remove()
    vis.circles15.exit().remove();
    vis.circles20.exit().remove();
    vis.circles30.exit().remove();
    vis.circles40.exit().remove();

    vis.addLine15.exit().remove();
    vis.addLine20.exit().remove();
    vis.addLine30.exit().remove();
    vis.addLine40.exit().remove();



}


attainmentVis.prototype.filterGender = function() {
    var vis = this;

    // vis.filterType = d3.select('#gender-btn').property('value');
    // console.log(vis.filterType);

    // removing the previous graph (default)
    // vis.addLine15.remove();
    // vis.circles15.remove();


    // filtering by age (20-29) default
    vis.selectedMaleAge = 'pct20_29_male';
    vis.selectedFemaleAge = 'pct20_29_female';


    // adding lines for male and female data
    vis.lineMale15 = d3.line()
        .x(function(d){ return vis.x(d.edyears); })
        .y(function(d){ return vis.y(d.pct15_19_male); })
        .curve(d3.curveLinear);

    vis.lineFemale15 = d3.line()
        .x(function(d){ return vis.x(d.edyears); })
        .y(function(d){ return vis.y(d.pct15_19_female); })
        .curve(d3.curveLinear);

    vis.lineMale20 = d3.line()
        .x(function(d){ return vis.x(d.edyears); })
        .y(function(d){ return vis.y(d.pct20_29_male); })
        .curve(d3.curveLinear);

    vis.lineFemale20 = d3.line()
        .x(function(d){ return vis.x(d.edyears); })
        .y(function(d){ return vis.y(d.pct20_29_female); })
        .curve(d3.curveLinear);

    vis.lineMale30 = d3.line()
        .x(function(d){ return vis.x(d.edyears); })
        .y(function(d){ return vis.y(d.pct30_39_male); })
        .curve(d3.curveLinear);

    vis.lineFemale30 = d3.line()
        .x(function(d){ return vis.x(d.edyears); })
        .y(function(d){ return vis.y(d.pct30_39_female); })
        .curve(d3.curveLinear);

    vis.lineMale40 = d3.line()
        .x(function(d){ return vis.x(d.edyears); })
        .y(function(d){ return vis.y(d.pct40_49_male); })
        .curve(d3.curveLinear);

    vis.lineFemale40 = d3.line()
        .x(function(d){ return vis.x(d.edyears); })
        .y(function(d){ return vis.y(d.pct40_49_female); })
        .curve(d3.curveLinear);

    vis.addMale15 = vis.svgLine.append('path')
        .attr("class", "line-male line-male15 line-15");

    vis.addFemale15 = vis.svgLine.append('path')
        .attr("class", "line-female line-female15 line-15");

    vis.addMale15.transition().duration(1500)
        .attr('d', vis.lineMale15(vis.filteredData))
        .style('opacity', function(){
            if(vis.selectedCountry=="default") { return 0; }
            else { return 0; }
        });

    vis.addFemale15.transition().duration(1500)
        .attr('d', vis.lineFemale15(vis.filteredData))
        .style('opacity', function(){
            if(vis.selectedCountry=="default") { return 0; }
            else { return 0; }
        });

    vis.addMale20 = vis.svgLine.append('path')
        .attr("class", "line-male line-male20 line-20");

    vis.addFemale20 = vis.svgLine.append('path')
        .attr("class", "line-female line-female20 line-20");

    vis.addMale20.transition().duration(1500)
        .attr('d', vis.lineMale20(vis.filteredData))
        .style('opacity', function(){
            if(vis.selectedCountry=="default") { return 0; }
            else { return 1; }
        });

    vis.addFemale20.transition().duration(1500)
        .attr('d', vis.lineFemale20(vis.filteredData))
        .style('opacity', function(){
            if(vis.selectedCountry=="default") { return 0; }
            else { return 1; }
        });

    vis.addMale30 = vis.svgLine.append('path')
        .attr("class", "line-male line-male30 line-30");

    vis.addFemale30 = vis.svgLine.append('path')
        .attr("class", "line-female line-female30 line-30");

    vis.addMale30.transition().duration(1500)
        .attr('d', vis.lineMale30(vis.filteredData))
        .style('opacity', function(){
            if(vis.selectedCountry=="default") { return 0; }
            else { return 0; }
        });

    vis.addFemale30.transition().duration(1500)
        .attr('d', vis.lineFemale30(vis.filteredData))
        .style('opacity', function(){
            if(vis.selectedCountry=="default") { return 0; }
            else { return 0; }
        });

    vis.addMale40 = vis.svgLine.append('path')
        .attr("class", "line-male line-male40 line-40");

    vis.addFemale40 = vis.svgLine.append('path')
        .attr("class", "line-female line-female40 line-40");

    vis.addMale40.transition().duration(1500)
        .attr('d', vis.lineMale40(vis.filteredData))
        .style('opacity', function(){
            if(vis.selectedCountry=="default") { return 0; }
            else { return 0; }
        });

    vis.addFemale40.transition().duration(1500)
        .attr('d', vis.lineFemale40(vis.filteredData))
        .style('opacity', function(){
            if(vis.selectedCountry=="default") { return 0; }
            else { return 0; }
        });


    // circles male and female
    vis.circlesMale15 = vis.svgLine.selectAll('circle.points-male15')
        .data(vis.filteredData);

    vis.circlesMale15.enter()
        .append('circle')
        .merge(vis.circlesMale15)
        .attr('class', 'points-male points-male15 points15')
        .attr('r', 5)
        .attr('cx', function(d){
            return vis.x(d.edyears);
        })
        .attr('cy', function(d){
            return vis.y(d.pct15_19_male);
        })
        .style('opacity', function(){
            if(vis.selectedCountry=="default") { return 0; }
            else { return 0; }
        });

    vis.circlesFemale15 = vis.svgLine.selectAll('circle.points-female15')
        .data(vis.filteredData);

    vis.circlesFemale15.enter()
        .append('circle')
        .merge(vis.circlesFemale15)
        .attr('class', 'points-female points-female15 points15')
        .attr('r', 5)
        .attr('cx', function(d){
            return vis.x(d.edyears);
        })
        .attr('cy', function(d){
            return vis.y(d.pct15_19_female);
        })
        .style('opacity', function(){
            if(vis.selectedCountry=="default") { return 0; }
            else { return 0; }
        });

    vis.circlesMale20 = vis.svgLine.selectAll('circle.points-male20')
        .data(vis.filteredData);

    vis.circlesMale20.enter()
        .append('circle')
        .merge(vis.circlesMale20)
        .attr('class', 'points-male points-male20 points20')
        .attr('r', 5)
        .attr('cx', function(d){
            return vis.x(d.edyears);
        })
        .attr('cy', function(d){
            return vis.y(d.pct20_29_male);
        })
        .style('opacity', function(){
            if(vis.selectedCountry=="default") { return 0; }
            else { return 1; }
        });

    vis.circlesFemale20 = vis.svgLine.selectAll('circle.points-female20')
        .data(vis.filteredData);

    vis.circlesFemale20.enter()
        .append('circle')
        .merge(vis.circlesFemale20)
        .attr('class', 'points-female points-female20 points20')
        .attr('r', 5)
        .attr('cx', function(d){
            return vis.x(d.edyears);
        })
        .attr('cy', function(d){
            return vis.y(d.pct20_29_female);
        })
        .style('opacity', function(){
            if(vis.selectedCountry=="default") { return 0; }
            else { return 1; }
        });

    vis.circlesMale30 = vis.svgLine.selectAll('circle.points-male30')
        .data(vis.filteredData);

    vis.circlesMale30.enter()
        .append('circle')
        .merge(vis.circlesMale30)
        .attr('class', 'points-male points-male30 points30')
        .attr('r', 5)
        .attr('cx', function(d){
            return vis.x(d.edyears);
        })
        .attr('cy', function(d){
            return vis.y(d.pct30_39_male);
        })
        .style('opacity', function(){
            if(vis.selectedCountry=="default") { return 0; }
            else { return 0; }
        });

    vis.circlesFemale30 = vis.svgLine.selectAll('circle.points-female30')
        .data(vis.filteredData);

    vis.circlesFemale30.enter()
        .append('circle')
        .merge(vis.circlesFemale30)
        .attr('class', 'points-female points-female30 points30')
        .attr('r', 5)
        .attr('cx', function(d){
            return vis.x(d.edyears);
        })
        .attr('cy', function(d){
            return vis.y(d.pct30_39_female);
        })
        .style('opacity', function(){
            if(vis.selectedCountry=="default") { return 0; }
            else { return 0; }
        });

    vis.circlesMale40 = vis.svgLine.selectAll('circle.points-male40')
        .data(vis.filteredData);

    vis.circlesMale40.enter()
        .append('circle')
        .merge(vis.circlesMale40)
        .attr('class', 'points-male points-male40 points40')
        .attr('r', 5)
        .attr('cx', function(d){
            return vis.x(d.edyears);
        })
        .attr('cy', function(d){
            return vis.y(d.pct40_49_male);
        })
        .style('opacity', function(){
            if(vis.selectedCountry=="default") { return 0; }
            else { return 0; }
        });

    vis.circlesFemale40 = vis.svgLine.selectAll('circle.points-female40')
        .data(vis.filteredData);

    vis.circlesFemale40.enter()
        .append('circle')
        .merge(vis.circlesFemale40)
        .attr('class', 'points-female points-female40 points40')
        .attr('r', 5)
        .attr('cx', function(d){
            return vis.x(d.edyears);
        })
        .attr('cy', function(d){
            return vis.y(d.pct40_49_female);
        })
        .style('opacity', function(){
            if(vis.selectedCountry=="default") { return 0; }
            else { return 0; }
        });


    // exit().remove();
    vis.addMale15.exit().remove();
    vis.addFemale15.exit().remove();
    vis.addMale20.exit().remove();
    vis.addFemale20.exit().remove();
    vis.addMale30.exit().remove();
    vis.addFemale30.exit().remove();
    vis.addMale40.exit().remove();
    vis.addFemale40.exit().remove();

    vis.circlesMale15.exit().remove();
    vis.circlesFemale15.exit().remove();
    vis.circlesMale20.exit().remove();
    vis.circlesFemale20.exit().remove();
    vis.circlesMale30.exit().remove();
    vis.circlesFemale30.exit().remove();
    vis.circlesMale40.exit().remove();
    vis.circlesFemale40.exit().remove();

}

attainmentVis.prototype.filterRural = function() {
    var vis = this;

    // removing the previous graph (default)
    // vis.addLine.remove();
    // vis.circles.remove();


    // filtering by age (20-29) default
    vis.selectedRuralAge = 'pct20_29_rural';
    vis.selectedUrbanAge = 'pct20_29_urban';


    // adding lines for male and female data
    vis.addUrban = vis.svgLine.append('path')
        .attr("class", "line-urban");

    vis.addRural = vis.svgLine.append('path')
        .attr("class", "line-rural");

    vis.lineUrban = d3.line()
        .x(function(d){ return vis.x(d.edyears); })
        .y(function(d){ return vis.y(d[vis.selectedUrbanAge]); })
        .curve(d3.curveLinear);

    vis.lineRural = d3.line()
        .x(function(d){ return vis.x(d.edyears); })
        .y(function(d){ return vis.y(d[vis.selectedRuralAge]); })
        .curve(d3.curveLinear);

    vis.addUrban.transition().duration(1500)
        .attr('d', vis.lineUrban(vis.filteredData))
        .style('opacity', function(){
            if(vis.selectedCountry=="default") { return 0; }
            else { return 1; }
        });

    vis.addRural.transition().duration(1500)
        .attr('d', vis.lineRural(vis.filteredData))
        .style('opacity', function(){
            if(vis.selectedCountry=="default") { return 0; }
            else { return 1; }
        });


    // circles male and female
    vis.circlesUrban= vis.svgLine.selectAll('circle.points-urban')
        .data(vis.filteredData);

    vis.circlesUrban.enter()
        .append('circle')
        .merge(vis.circlesUrban)
        .attr('class', 'points-urban')
        .attr('r', 5)
        .attr('cx', function(d){
            return vis.x(d.edyears);
        })
        .attr('cy', function(d){
            return vis.y(d[vis.selectedUrbanAge]);
        })
        .style('opacity', function(){
            if(vis.selectedCountry=="default") { return 0; }
            else { return 1; }
        });

    vis.circlesRural = vis.svgLine.selectAll('circle.points-rural')
        .data(vis.filteredData);

    vis.circlesRural.enter()
        .append('circle')
        .merge(vis.circlesRural)
        .attr('class', 'points-rural')
        .attr('r', 5)
        .attr('cx', function(d){
            return vis.x(d.edyears);
        })
        .attr('cy', function(d){
            return vis.y(d[vis.selectedRuralAge]);
        })
        .style('opacity', function(){
            if(vis.selectedCountry=="default") { return 0; }
            else { return 1; }
        });


    // exit().remove();
    vis.addUrban.exit().remove();
    vis.addRural.exit().remove();
    vis.circlesUrban.exit().remove();
    vis.circlesRural.exit().remove();

}

attainmentVis.prototype.filterIncome = function() {
    var vis = this;

    // removing the previous graph (default)
    vis.addLine.remove();
    vis.circles.remove();


    // filtering by age (20-29) default
    vis.selectedQ1Age = 'pct20_29_q1';
    vis.selectedQ2Age = 'pct20_29_q2';
    vis.selectedQ3Age = 'pct20_29_q3';
    vis.selectedQ4Age = 'pct20_29_q4';
    vis.selectedQ5Age = 'pct20_29_q5';


    // adding lines for male and female data
    vis.addQ1 = vis.svgLine.append('path')
        .attr("class", "line-q1");

    vis.addQ2 = vis.svgLine.append('path')
        .attr("class", "line-q2");

    vis.addQ3 = vis.svgLine.append('path')
        .attr("class", "line-q3");

    vis.addQ4 = vis.svgLine.append('path')
        .attr("class", "line-q4");

    vis.addQ5 = vis.svgLine.append('path')
        .attr("class", "line-q5");

    vis.lineQ1 = d3.line()
        .x(function(d){ return vis.x(d.edyears); })
        .y(function(d){ return vis.y(d[vis.selectedQ1Age]); })
        .curve(d3.curveLinear);

    vis.lineQ2 = d3.line()
        .x(function(d){ return vis.x(d.edyears); })
        .y(function(d){ return vis.y(d[vis.selectedQ2Age]); })
        .curve(d3.curveLinear);

    vis.lineQ3 = d3.line()
        .x(function(d){ return vis.x(d.edyears); })
        .y(function(d){ return vis.y(d[vis.selectedQ3Age]); })
        .curve(d3.curveLinear);

    vis.lineQ4 = d3.line()
        .x(function(d){ return vis.x(d.edyears); })
        .y(function(d){ return vis.y(d[vis.selectedQ4Age]); })
        .curve(d3.curveLinear);

    vis.lineQ5 = d3.line()
        .x(function(d){ return vis.x(d.edyears); })
        .y(function(d){ return vis.y(d[vis.selectedQ5Age]); })
        .curve(d3.curveLinear);

    vis.addQ1.transition().duration(1500)
        .attr('d', vis.lineQ1(vis.filteredData))
        .style('opacity', function(){
            if(vis.selectedCountry=="default") { return 0; }
            else { return 1; }
        });

    vis.addQ2.transition().duration(1500)
        .attr('d', vis.lineQ2(vis.filteredData))
        .style('opacity', function(){
            if(vis.selectedCountry=="default") { return 0; }
            else { return 1; }
        });

    vis.addQ3.transition().duration(1500)
        .attr('d', vis.lineQ3(vis.filteredData))
        .style('opacity', function(){
            if(vis.selectedCountry=="default") { return 0; }
            else { return 1; }
        });

    vis.addQ4.transition().duration(1500)
        .attr('d', vis.lineQ4(vis.filteredData))
        .style('opacity', function(){
            if(vis.selectedCountry=="default") { return 0; }
            else { return 1; }
        });

    vis.addQ5.transition().duration(1500)
        .attr('d', vis.lineQ5(vis.filteredData))
        .style('opacity', function(){
            if(vis.selectedCountry=="default") { return 0; }
            else { return 1; }
        });


    // circles male and female
    vis.circlesQ1= vis.svgLine.selectAll('circle.points-q1')
        .data(vis.filteredData);

    vis.circlesQ1.enter()
        .append('circle')
        .merge(vis.circlesQ1)
        .attr('class', 'points-q1')
        .attr('r', 5)
        .attr('cx', function(d){
            return vis.x(d.edyears);
        })
        .attr('cy', function(d){
            return vis.y(d[vis.selectedQ1Age]);
        })
        .style('opacity', function(){
            if(vis.selectedCountry=="default") { return 0; }
            else { return 1; }
        });

    vis.circlesQ2= vis.svgLine.selectAll('circle.points-q2')
        .data(vis.filteredData);

    vis.circlesQ2.enter()
        .append('circle')
        .merge(vis.circlesQ2)
        .attr('class', 'points-q2')
        .attr('r', 5)
        .attr('cx', function(d){
            return vis.x(d.edyears);
        })
        .attr('cy', function(d){
            return vis.y(d[vis.selectedQ2Age]);
        })
        .style('opacity', function(){
            if(vis.selectedCountry=="default") { return 0; }
            else { return 1; }
        });

    vis.circlesQ3= vis.svgLine.selectAll('circle.points-q3')
        .data(vis.filteredData);

    vis.circlesQ3.enter()
        .append('circle')
        .merge(vis.circlesQ3)
        .attr('class', 'points-q3')
        .attr('r', 5)
        .attr('cx', function(d){
            return vis.x(d.edyears);
        })
        .attr('cy', function(d){
            return vis.y(d[vis.selectedQ3Age]);
        })
        .style('opacity', function(){
            if(vis.selectedCountry=="default") { return 0; }
            else { return 1; }
        });

    vis.circlesQ4= vis.svgLine.selectAll('circle.points-q4')
        .data(vis.filteredData);

    vis.circlesQ4.enter()
        .append('circle')
        .merge(vis.circlesQ4)
        .attr('class', 'points-q4')
        .attr('r', 5)
        .attr('cx', function(d){
            return vis.x(d.edyears);
        })
        .attr('cy', function(d){
            return vis.y(d[vis.selectedQ4Age]);
        })
        .style('opacity', function(){
            if(vis.selectedCountry=="default") { return 0; }
            else { return 1; }
        });

    vis.circlesQ5= vis.svgLine.selectAll('circle.points-q5')
        .data(vis.filteredData);

    vis.circlesQ5.enter()
        .append('circle')
        .merge(vis.circlesQ5)
        .attr('class', 'points-q5')
        .attr('r', 5)
        .attr('cx', function(d){
            return vis.x(d.edyears);
        })
        .attr('cy', function(d){
            return vis.y(d[vis.selectedQ5Age]);
        })
        .style('opacity', function(){
            if(vis.selectedCountry=="default") { return 0; }
            else { return 1; }
        });


    // exit().remove();
    vis.addQ1.exit().remove();
    vis.addQ2.exit().remove();
    vis.addQ3.exit().remove();
    vis.addQ4.exit().remove();
    vis.addQ5.exit().remove();

    vis.circlesQ1.exit().remove();
    vis.circlesQ2.exit().remove();
    vis.circlesQ3.exit().remove();
    vis.circlesQ4.exit().remove();
    vis.circlesQ5.exit().remove();

}

/*
 *  Removing all line/dots on the svg
 */

attainmentVis.prototype.removeAll = function(){
    var vis = this;

    // vis.addLine15.hide();
    // vis.circles15.hide();
    // vis.addLine20.hide();
    // vis.circles20.hide();
    // vis.addLine30.hide();
    // vis.circles30.hide();
    // vis.addLine40.hide();
    // vis.circles40.hide();

    vis.addLine15.remove();
    vis.circles15.remove();
    vis.addLine20.remove();
    vis.circles20.remove();
    vis.addLine30.remove();
    vis.circles30.remove();
    vis.addLine40.remove();
    vis.circles40.remove();

    // removing any other lines and dots
    vis.addFemale.remove();
    vis.addMale.remove();
    vis.circlesFemale.remove();
    vis.circlesMale.remove()


}


/*
 *  SELECTING AGE GROUP
 */

attainmentVis.prototype.select15 = function() {
    // this function will select which age group to present

    var vis = this;
    // vis.selectedAge = "pct15_19";
    // vis.ageLabel = "15-19";
    //
    vis.addLine15.style('opacity', function() {
        if (vis.selectedCountry == "default") {
            return 0;
        }
        else {
            return 1;
        }
    });

    vis.circles15.style('opacity', function() {
        if (vis.selectedCountry == "default") {
            return 0;
        }
        else {
            return 1;
        }
    });

    // vis.addMale15.style('opacity', function(){
    //     if(vis.selectedCountry=="default") { return 0; }
    //     else { return 1; }
    // });
    //
    // vis.addFemale15.style('opacity', function(){
    //     if(vis.selectedCountry=="default") { return 0; }
    //     else { return 1; }
    // });
    //
    // vis.circlesFemale15.style('opacity', function(){
    //     if(vis.selectedCountry=="default") { return 0; }
    //     else { return 1; }
    // });
    //
    // vis.circlesMale15.style('opacity', function(){
    //     if(vis.selectedCountry=="default") { return 0; }
    //     else { return 1; }
    // });

    $('.line-15').toggle();
    // $('.line-20').toggle();
    // $('.line-30').hide();
    // $('.line-40').hide();

    $('.points15').toggle();
    // $('.points20').toggle();
    // $('.points30').hide();
    // $('.points40').hide();
}

attainmentVis.prototype.select20 = function() {
    var vis = this;
    // vis.selectedAge = "pct20_29";
    // vis.ageLabel = "20-29";

    vis.addLine20
        .style('opacity', function() {
            if (vis.selectedCountry == "default") {
                return 0;
            }
            else {
                return 1;
            }
        });

    vis.circles20.style('opacity', function() {
        if (vis.selectedCountry == "default") {
            return 0;
        }
        else {
            return 1;
        }
    });

    // vis.addMale20.style('opacity', function(){
    //     if(vis.selectedCountry=="default") { return 0; }
    //     else { return 1; }
    // });
    //
    // vis.addFemale20.style('opacity', function(){
    //     if(vis.selectedCountry=="default") { return 0; }
    //     else { return 1; }
    // });
    //
    // vis.circlesFemale20.style('opacity', function(){
    //     if(vis.selectedCountry=="default") { return 0; }
    //     else { return 1; }
    // });
    //
    // vis.circlesMale20.style('opacity', function(){
    //     if(vis.selectedCountry=="default") { return 0; }
    //     else { return 1; }
    // });

    // $('.line-15').toggle();
    $('.line-20').toggle();
    // $('.line-30').toggle();
    // $('.line-40').toggle();
    // //
    // $('.points15').toggle();
    $('.points20').toggle();
    // $('.points30').toggle();
    // $('.points40').toggle();

}

attainmentVis.prototype.select30 = function() {
    var vis = this;

    vis.addLine30
        .style('opacity', function() {
            if (vis.selectedCountry == "default") {
                return 0;
            }
            else {
                return 1;
            }
        });

    vis.circles30.style('opacity', function() {
        if (vis.selectedCountry == "default") {
            return 0;
        }
        else {
            return 1;
        }
    });

    $('.line-15').toggle();
    $('.line-20').toggle();
    // $('.line-30').toggle();
    $('.line-40').toggle();

    $('.points15').toggle();
    $('.points20').toggle();
    // $('.points30').toggle();
    $('.points40').toggle();

}

attainmentVis.prototype.select40 = function() {
    var vis = this;

    vis.addLine40
        .style('opacity', function() {
            if (vis.selectedCountry == "default") {
                return 0;
            }
            else {
                return 1;
            }
        });

    vis.circles40.style('opacity', function() {
        if (vis.selectedCountry == "default") {
            return 0;
        }
        else {
            return 1;
        }
    });

    $('.line-15').toggle();
    $('.line-20').toggle();
    $('.line-30').toggle();
    // $('.line-40').toggle();
    //
    $('.points15').toggle();
    $('.points20').toggle();
    $('.points30').toggle();
    // $('.points40').toggle();
}

attainmentVis.prototype.hideAllAge = function(){
    $('.line').hide();
    $('.points').hide();
}




