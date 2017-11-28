// Line graph - attainment profile of different countries

/*
 *  attainmentVis - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all the education data
 */

attainmentVis = function(_parentElement, _data) {
    this.parentElement = _parentElement;
    this.data = _data;

    this.addDropdown();
    this.initVis();
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

    vis.margin = { bottom: 50, top:60, left:50, right:55 };

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


    // axis labels
    vis.xLabel = d3.select("#svg-line").append('text')
        .text("Years of Education")
        .attr('x', vis.width+vis.margin.left)
        .attr('y', vis.height+vis.margin.top +35)
        .attr('class', 'x-label');

    vis.yLabel = d3.select('#svg-line').append('text')
        .text("Share of Population")
        .attr('x', -50)
        .attr('y', vis.margin.left-35)
        .attr('class', 'y-label');


    // lines
    vis.addLine20 = vis.svgLine.append('path')
        .attr("class", "line line-20");


    // legends / rect
    var gap = 20;
    var group = 10;

    vis.legend = vis.svgLine.append('circle')
        .attr('cx', vis.width*0.85)
        .attr('cy', 0)
        .attr('r', 7)
        .attr('class', 'legend')
        .style('opacity', 0.15)
        .style('fill', '#663399');

    vis.legendText = vis.svgLine.append('text')
        .attr('x', vis.width*0.85 +15)
        .attr('y', 4)
        .attr('class', 'legend-text')
        .style('opacity', 0.15)
        .text('All population');

    vis.legendMale = vis.svgLine.append('circle')
        .attr('cx', vis.width*0.85)
        .attr('cy', group+gap)
        .attr('r', 7)
        .attr('class', 'legend legend-gender')
        .style('opacity', 0.15)
        .style('fill', '#1d65af');

    vis.legendMaleText = vis.svgLine.append('text')
        .attr('x', vis.width*0.85 + 15)
        .attr('y', 4+ group + gap)
        .attr('class', 'legend-text legend-gender')
        .style('opacity', 0.15)
        .text('Male Population');

    vis.legendFemale = vis.svgLine.append('circle')
        .attr('cx', vis.width*0.85)
        .attr('cy', group +gap*2)
        .attr('r', 7)
        .attr('class', 'legend legend-gender')
        .style('opacity', 0.15)
        .style('fill', '#a52731');

    vis.legendFemaleText = vis.svgLine.append('text')
        .attr('x', vis.width*0.85 + 15)
        .attr('y', 4+ group +gap*2)
        .attr('class', 'legend-text legend-gender')
        .style('opacity', 0.15)
        .text('Female Population');

    vis.legendUrban = vis.svgLine.append('circle')
        .attr('cx', vis.width*0.85)
        .attr('cy', group*2+gap*3)
        .attr('r', 7)
        .attr('class', 'legend legend-urban')
        .style('opacity', 0.15)
        .style('fill', '#656565');

    vis.legendUrbanText = vis.svgLine.append('text')
        .attr('x', vis.width*0.85 + 15)
        .attr('y', 4+ group*2 +gap*3)
        .attr('class', 'legend-text legend-urban')
        .style('opacity', 0.15)
        .text('Urban Population');

    vis.legendRural = vis.svgLine.append('circle')
        .attr('cx', vis.width*0.85)
        .attr('cy', group*2 + gap*4)
        .attr('r', 7)
        .attr('class', 'legend legend-urban')
        .style('opacity', 0.15)
        .style('fill', '#147f27');

    vis.legendRuralText = vis.svgLine.append('text')
        .attr('x', vis.width*0.85 + 15)
        .attr('y', 4 +group*2 +gap*4)
        .attr('class', 'legend-text legend-urban')
        .style('opacity', 0.15)
        .text('Rural Population');

    vis.legendQ1 = vis.svgLine.append('circle')
        .attr('cx', vis.width*0.85)
        .attr('cy', group*3+ gap*5)
        .attr('r', 7)
        .attr('class', 'legend legend-income')
        .style('opacity', 0.15)
        .style('fill', '#08589e');

    vis.legendQ1Text = vis.svgLine.append('text')
        .attr('x', vis.width*0.85 + 15)
        .attr('y', 4 +group*3+gap*5)
        .attr('class', 'legend-text legend-income')
        .style('opacity', 0.15)
        .text('First Income Quintile');

    vis.legendQ2 = vis.svgLine.append('circle')
        .attr('cx', vis.width*0.85)
        .attr('cy', group*3+gap*6)
        .attr('r', 7)
        .attr('class', 'legend legend-income')
        .style('opacity', 0.15)
        .style('fill', '#2b8cbe');

    vis.legendQ2Text = vis.svgLine.append('text')
        .attr('x', vis.width*0.85 + 15)
        .attr('y', 4 +group*3+gap*6)
        .attr('class', 'legend-text legend-income')
        .style('opacity', 0.15)
        .text('Second Income Quintile');

    vis.legendQ3 = vis.svgLine.append('circle')
        .attr('cx', vis.width*0.85)
        .attr('cy', group*3+gap*7)
        .attr('r', 7)
        .attr('class', 'legend legend-income')
        .style('opacity', 0.15)
        .style('fill', '#4eb3d3');

    vis.legendQ3Text = vis.svgLine.append('text')
        .attr('x', vis.width*0.85 + 15)
        .attr('y', 4+group*3 +gap*7)
        .attr('class', 'legend-text legend-income')
        .style('opacity', 0.15)
        .text('Third Income Quintile');

    vis.legendQ4 = vis.svgLine.append('circle')
        .attr('cx', vis.width*0.85)
        .attr('cy', group*3+gap*8)
        .attr('r', 7)
        .attr('class', 'legend legend-income')
        .style('opacity', 0.15)
        .style('fill', '#7bccc4');

    vis.legendQ4Text = vis.svgLine.append('text')
        .attr('x', vis.width*0.85 + 15)
        .attr('y', 4+group*3 +gap*8)
        .attr('class', 'legend-text legend-income')
        .style('opacity', 0.15)
        .text('Forth Income Quintile');

    vis.legendQ5 = vis.svgLine.append('circle')
        .attr('cx', vis.width*0.85)
        .attr('cy', group*3+gap*9)
        .attr('r', 7)
        .attr('class', 'legend legend-income')
        .style('opacity', 0.15)
        .style('fill', '#a8ddb5');

    vis.legendQ5Text = vis.svgLine.append('text')
        .attr('x', vis.width*0.85 + 15)
        .attr('y', 4 +group*3+gap*9)
        .attr('class', 'legend-text legend-income')
        .style('opacity', 0.15)
        .text('Fifth Income Quintile');


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

    vis.legend.style('opacity', function(){
        if(vis.selectedCountry=="default") { return 0.15; }
        else { return 1; }
    });
    vis.legendText.style('opacity', function(){
        if(vis.selectedCountry=="default") { return 0.15; }
        else { return 1; }
    });


    // update domain for axis
    vis.eduMin = d3.min(vis.filteredData, function(d) { return d.edyears; });
    vis.eduMax = d3.max(vis.filteredData, function(d) { return d.edyears; });

    vis.x.domain([vis.eduMin, vis.eduMax]);


    // adding Axes
    vis.addX.transition().duration(1500).call(vis.xAxis);
    vis.addY.transition().duration(1500).call(vis.yAxis);


    // adding lines
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


    // dots
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
        })
        .attr('title', function(d){
            return "<b>" + vis.selectedCountry + "</b>"+ "</br>" + showAge(d) + "</br> Group: All Population </br> Share: " + showShare(d) ;
        });

    vis.circles20.transition().duration(1500);


    // exit().remove()
    vis.circles20.exit().remove();
    vis.addLine20.exit().remove();


    // initializing tool tips
    $('.points').tooltipsy({
        // alignTo: 'cursor',
        offset: [10, -3],
        css: {
            'padding': '10px',
            'max-width': '200px',
            'color': '#f4f4f4',
            'background-color': 'rgba(101, 101, 101, .55)',
            'border': '0.1px solid #656565',
            'border-radius': '10px',
            '-moz-box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
            '-webkit-box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
            'box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
            'text-shadow': 'none'
        }
    });



}


attainmentVis.prototype.filterGender = function() {
    var vis = this;


    // reducing opacity for the all pop linees
    vis.addLine20.style('opacity', 0.15);
    vis.circles20.style('opacity', 0.15);
    vis.legend.style('opacity', 0.15);
    vis.legendText.style('opacity', 0.15);
    vis.legendMale.style('opacity', 1);
    vis.legendFemale.style('opacity', 1);
    vis.legendRural.style('opacity', 0.15);
    vis.legendUrban.style('opacity', 0.15);
    vis.legendQ1.style('opacity', 0.15);
    vis.legendQ2.style('opacity', 0.15);
    vis.legendQ3.style('opacity', 0.15);
    vis.legendQ4.style('opacity', 0.15);
    vis.legendQ5.style('opacity', 0.15);

    vis.legendMaleText.style('opacity', 1);
    vis.legendFemaleText.style('opacity', 1);
    vis.legendRuralText.style('opacity', 0.15);
    vis.legendUrbanText.style('opacity', 0.15);
    vis.legendQ1Text.style('opacity', 0.15);
    vis.legendQ2Text.style('opacity', 0.15);
    vis.legendQ3Text.style('opacity', 0.15);
    vis.legendQ4Text.style('opacity', 0.15);
    vis.legendQ5Text.style('opacity', 0.15);


    // creating lines
    vis.lineMale20 = d3.line()
        .x(function(d){ return vis.x(d.edyears); })
        .y(function(d){ return vis.y(d.pct20_29_male); })
        .curve(d3.curveLinear);

    vis.lineFemale20 = d3.line()
        .x(function(d){ return vis.x(d.edyears); })
        .y(function(d){ return vis.y(d.pct20_29_female); })
        .curve(d3.curveLinear);

    vis.addMale20 = vis.svgLine.append('path')
        .attr("class", "line-male line-male20 line-20 line");

    vis.addFemale20 = vis.svgLine.append('path')
        .attr("class", "line-female line-female20 line-20 line");

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


    // adding points
    vis.circlesMale20 = vis.svgLine.selectAll('circle.points-male20')
        .data(vis.filteredData);

    vis.circlesMale20.enter()
        .append('circle')
        .merge(vis.circlesMale20)
        .attr('class', 'points-male points-male20 points')
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
        })
        .attr('title',function(d){
            return "<b>" + vis.selectedCountry + "</b>"+ "</br>" + showAge(d) + "</br> Group: Male" + "</br>" + showShare(d) ;
        });

    vis.circlesFemale20 = vis.svgLine.selectAll('circle.points-female20')
        .data(vis.filteredData);

    vis.circlesFemale20.enter()
        .append('circle')
        .merge(vis.circlesFemale20)
        .attr('class', 'points-female points-female20 points')
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
        })
        .attr('title',function(d){
            return "<b>" + vis.selectedCountry + "</b>"+ "</br>" + showAge(d) + "</br> Group: Female" + "</br>" + showShare(d) ;
        });


    // exit().remove();
    vis.addMale20.exit().remove();
    vis.addFemale20.exit().remove();

    vis.circlesMale20.exit().remove();
    vis.circlesFemale20.exit().remove();

    // tooltips
    $('.points-male').tooltipsy({
        offset: [10, -3],
        css: {
            'padding': '10px',
            'max-width': '200px',
            'color': '#f4f4f4',
            'background-color': 'rgba(29, 101, 175, .7)',
            'border': '0.1px solid #656565',
            'border-radius': '10px',
            '-moz-box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
            '-webkit-box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
            'box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
            'text-shadow': 'none'
        }
    });

    $('.points-female').tooltipsy({
        offset: [10, -3],
        css: {
            'padding': '10px',
            'max-width': '200px',
            'color': '#f4f4f4',
            'background-color': 'rgba(165, 39, 49, .7)',
            'border': '0.1px solid #656565',
            'border-radius': '10px',
            '-moz-box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
            '-webkit-box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
            'box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
            'text-shadow': 'none'
        }
    });

}

attainmentVis.prototype.filterRural = function() {
    var vis = this;

    // reducing opacity.
    vis.addLine20.style('opacity', 0.15);
    vis.circles20.style('opacity', 0.15);
    vis.legend.style('opacity', 0.15);
    vis.legendText.style('opacity', 0.15);
    vis.legendMale.style('opacity', 0.15);
    vis.legendFemale.style('opacity', 0.15);
    vis.legendRural.style('opacity', 1);
    vis.legendUrban.style('opacity', 1);
    vis.legendQ1.style('opacity', 0.15);
    vis.legendQ2.style('opacity', 0.15);
    vis.legendQ3.style('opacity', 0.15);
    vis.legendQ4.style('opacity', 0.15);
    vis.legendQ5.style('opacity', 0.15);
    vis.legendMaleText.style('opacity', 0.15);
    vis.legendFemaleText.style('opacity', 0.15);
    vis.legendRuralText.style('opacity', 1);
    vis.legendUrbanText.style('opacity', 1);
    vis.legendQ1Text.style('opacity', 0.15);
    vis.legendQ2Text.style('opacity', 0.15);
    vis.legendQ3Text.style('opacity', 0.15);
    vis.legendQ4Text.style('opacity', 0.15);
    vis.legendQ5Text.style('opacity', 0.15);


    // adding lines for male and female data
    vis.addUrban = vis.svgLine.append('path')
        .attr("class", "line line-urban");

    vis.addRural = vis.svgLine.append('path')
        .attr("class", "line line-rural");

    vis.lineUrban = d3.line()
        .x(function(d){ return vis.x(d.edyears); })
        .y(function(d){ return vis.y(d.pct20_29_urban); })
        .curve(d3.curveLinear);

    vis.lineRural = d3.line()
        .x(function(d){ return vis.x(d.edyears); })
        .y(function(d){ return vis.y(d.pct20_29_rural); })
        .curve(d3.curveLinear);

    vis.addUrban
        .transition().duration(1500)
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
        .attr('class', 'points points-urban')
        .attr('r', 5)
        .attr('cx', function(d){
            return vis.x(d.edyears);
        })
        .attr('cy', function(d){
            return vis.y(d.pct20_29_urban);
        })
        .style('opacity', function(){
            if(vis.selectedCountry=="default") { return 0; }
            else { return 1; }
        })
        .attr('title',function(d){
            return "<b>" + vis.selectedCountry + "</b>"+ "</br>" + showAge(d) + "</br> Group: Urban" + "</br>" + showShare(d) ;
        });

    vis.circlesRural = vis.svgLine.selectAll('circle.points-rural')
        .data(vis.filteredData);

    vis.circlesRural.enter()
        .append('circle')
        .merge(vis.circlesRural)
        .attr('class', 'points points-rural')
        .attr('r', 5)
        .attr('cx', function(d){
            return vis.x(d.edyears);
        })
        .attr('cy', function(d){
            return vis.y(d.pct20_29_rural);
        })
        .style('opacity', function(){
            if(vis.selectedCountry=="default") { return 0; }
            else { return 1; }
        })
        .attr('title',function(d){
            return "<b>" + vis.selectedCountry + "</b>"+ "</br>" + showAge(d) + "</br> Group: Rural" + "</br>" + showShare(d) ;
        });


    // exit().remove();
    vis.addUrban.exit().remove();
    vis.addRural.exit().remove();
    vis.circlesUrban.exit().remove();
    vis.circlesRural.exit().remove();

    $('.points-urban').tooltipsy({
        offset: [10, -3],
        css: {
            'padding': '10px',
            'max-width': '200px',
            'color': '#f4f4f4',
            'background-color': 'rgba(101, 101, 101, .7)',
            'border': '0.1px solid #656565',
            'border-radius': '10px',
            '-moz-box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
            '-webkit-box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
            'box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
            'text-shadow': 'none'
        }
    });

    $('.points-rural').tooltipsy({
        offset: [10, -3],
        css: {
            'padding': '10px',
            'max-width': '200px',
            'color': '#f4f4f4',
            'background-color': 'rgba(20, 127, 39, .7)',
            'border': '0.1px solid #656565',
            'border-radius': '10px',
            '-moz-box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
            '-webkit-box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
            'box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
            'text-shadow': 'none'
        }
    });

}

attainmentVis.prototype.filterIncome = function() {
    var vis = this;

    // removing the previous graph (default)
    vis.addLine20.style('opacity', 0.15);
    vis.circles20.style('opacity', 0.15);
    vis.legend.style('opacity', 0.15);
    vis.legendText.style('opacity', 0.15);
    vis.legendMale.style('opacity', 0.15);
    vis.legendFemale.style('opacity', 0.15);
    vis.legendRural.style('opacity', 0.15);
    vis.legendUrban.style('opacity', 0.15);
    vis.legendQ1.style('opacity', 1);
    vis.legendQ2.style('opacity', 1);
    vis.legendQ3.style('opacity', 1);
    vis.legendQ4.style('opacity', 1);
    vis.legendQ5.style('opacity', 1);
    vis.legendMaleText.style('opacity', 0.15);
    vis.legendFemaleText.style('opacity', 0.15);
    vis.legendRuralText.style('opacity', 0.15);
    vis.legendUrbanText.style('opacity', 0.15);
    vis.legendQ1Text.style('opacity', 1);
    vis.legendQ2Text.style('opacity', 1);
    vis.legendQ3Text.style('opacity', 1);
    vis.legendQ4Text.style('opacity', 1);
    vis.legendQ5Text.style('opacity', 1);


    // filtering by age (20-29) default
    vis.selectedQ1Age = 'pct20_29_q1';
    vis.selectedQ2Age = 'pct20_29_q2';
    vis.selectedQ3Age = 'pct20_29_q3';
    vis.selectedQ4Age = 'pct20_29_q4';
    vis.selectedQ5Age = 'pct20_29_q5';


    // adding lines for male and female data
    vis.addQ1 = vis.svgLine.append('path')
        .attr("class", "line-q1 line");

    vis.addQ2 = vis.svgLine.append('path')
        .attr("class", "line-q2 line");

    vis.addQ3 = vis.svgLine.append('path')
        .attr("class", "line-q3 line");

    vis.addQ4 = vis.svgLine.append('path')
        .attr("class", "line-q4 line");

    vis.addQ5 = vis.svgLine.append('path')
        .attr("class", "line-q5 line");

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
        .attr('class', 'points-q1 points')
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
        })
        .attr('title',function(d){
            return "<b>" + vis.selectedCountry + "</b>"+ "</br>" + showAge(d) + "</br> Group: Income Quintile 1" + "</br>" + showShare(d) ;
        });

    vis.circlesQ2= vis.svgLine.selectAll('circle.points-q2')
        .data(vis.filteredData);

    vis.circlesQ2.enter()
        .append('circle')
        .merge(vis.circlesQ2)
        .attr('class', 'points-q2 points')
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
        })
        .attr('title',function(d){
            return "<b>" + vis.selectedCountry + "</b>"+ "</br>" + showAge(d) + "</br> Group: Income Quintile 2" + "</br>" + showShare(d) ;
        });

    vis.circlesQ3= vis.svgLine.selectAll('circle.points-q3')
        .data(vis.filteredData);

    vis.circlesQ3.enter()
        .append('circle')
        .merge(vis.circlesQ3)
        .attr('class', 'points-q3 points')
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
        })
        .attr('title',function(d){
            return "<b>" + vis.selectedCountry + "</b>"+ "</br>" + showAge(d) + "</br> Group: Income Quintile 3" + "</br>" + showShare(d) ;
        });

    vis.circlesQ4= vis.svgLine.selectAll('circle.points-q4')
        .data(vis.filteredData);

    vis.circlesQ4.enter()
        .append('circle')
        .merge(vis.circlesQ4)
        .attr('class', 'points-q4 points')
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
        })
        .attr('title',function(d){
            return "<b>" + vis.selectedCountry + "</b>"+ "</br>" + showAge(d) + "</br> Group: Income Quintile 4" + "</br>" + showShare(d) ;
        });

    vis.circlesQ5= vis.svgLine.selectAll('circle.points-q5')
        .data(vis.filteredData);

    vis.circlesQ5.enter()
        .append('circle')
        .merge(vis.circlesQ5)
        .attr('class', 'points-q5 points')
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
        })
        .attr('title',function(d){
            return "<b>" + vis.selectedCountry + "</b>"+ "</br>" + showAge(d) + "</br> Group: Income Quintile 5" + "</br>" + showShare(d) ;
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


    $('.points-q1').tooltipsy({
        offset: [10, -3],
        css: {
            'padding': '10px',
            'max-width': '200px',
            'color': '#f4f4f4',
            'background-color': 'rgba(8, 88, 158, .7)',
            'border': '0.1px solid #656565',
            'border-radius': '10px',
            '-moz-box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
            '-webkit-box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
            'box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
            'text-shadow': 'none'
        }
    });
    $('.points-q2').tooltipsy({
        offset: [10, -3],
        css: {
            'padding': '10px',
            'max-width': '200px',
            'color': '#f4f4f4',
            'background-color': 'rgba(43, 140, 190, .7)',
            'border': '0.1px solid #656565',
            'border-radius': '10px',
            '-moz-box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
            '-webkit-box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
            'box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
            'text-shadow': 'none'
        }
    });
    $('.points-q3').tooltipsy({
        offset: [10, -3],
        css: {
            'padding': '10px',
            'max-width': '200px',
            'color': '#737373',
            'background-color': 'rgba(78, 179, 211, .7)',
            'border': '0.1px solid #656565',
            'border-radius': '10px',
            '-moz-box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
            '-webkit-box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
            'box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
            'text-shadow': 'none'
        }
    });
    $('.points-q4').tooltipsy({
        offset: [10, -3],
        css: {
            'padding': '10px',
            'max-width': '200px',
            'color': '#737373',
            'background-color': 'rgba(123, 204, 196, .7)',
            'border': '0.1px solid #656565',
            'border-radius': '10px',
            '-moz-box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
            '-webkit-box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
            'box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
            'text-shadow': 'none'
        }
    });
    $('.points-q5').tooltipsy({
        offset: [10, -3],
        css: {
            'padding': '10px',
            'max-width': '200px',
            'color': '#737373',
            'background-color': 'rgba(164, 221, 181, .7)',
            'border': '0.1px solid #656565',
            'border-radius': '10px',
            '-moz-box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
            '-webkit-box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
            'box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
            'text-shadow': 'none'
        }
    });
}

attainmentVis.prototype.showOriginal = function(){
    var vis = this;

    vis.addLine20.style('opacity', 1);
    vis.circles20.style('opacity', 1);

    vis.legend.style('opacity', 1);
    vis.legendText.style('opacity', 1);
    vis.legendMale.style('opacity', 0.15);
    vis.legendFemale.style('opacity', 0.15);
    vis.legendRural.style('opacity', 0.15);
    vis.legendUrban.style('opacity', 0.15);
    vis.legendQ1.style('opacity', 0.15);
    vis.legendQ2.style('opacity', 0.15);
    vis.legendQ3.style('opacity', 0.15);
    vis.legendQ4.style('opacity', 0.15);
    vis.legendQ5.style('opacity', 0.15);
    vis.legendMaleText.style('opacity', 0.15);
    vis.legendFemaleText.style('opacity', 0.15);
    vis.legendRuralText.style('opacity', 0.15);
    vis.legendUrbanText.style('opacity', 0.15);
    vis.legendQ1Text.style('opacity', 0.15);
    vis.legendQ2Text.style('opacity', 0.15);
    vis.legendQ3Text.style('opacity', 0.15);
    vis.legendQ4Text.style('opacity', 0.15);
    vis.legendQ5Text.style('opacity', 0.15);

}

/*
 *  Removing all line/dots on the svg
 */

attainmentVis.prototype.removeAll = function(){
    $('.points').hide();
    $('.line').hide();
}

attainmentVis.prototype.hideFilter = function(){
    $('.line-female').hide();
    $('.line-male').hide();
    $('.line-urban').hide();
    $('.line-rural').hide();
    $('.line-q1').hide();
    $('.line-q2').hide();
    $('.line-q3').hide();
    $('.line-q4').hide();
    $('.line-q5').hide();

    $('.points-female').hide();
    $('.points-male').hide();
    $('.points-urban').hide();
    $('.points-rural').hide();
    $('.points-q1').hide();
    $('.points-q2').hide();
    $('.points-q3').hide();
    $('.points-q4').hide();
    $('.points-q5').hide();

}

function showShare(d){
    return d.pct20_29.toPrecision(3);
}

function showAge(){ return "Age: 20-29"; }