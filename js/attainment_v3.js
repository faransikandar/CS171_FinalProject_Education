// Line graph - attainment profile of different countries

/*
 *  attainmentVis - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all the education data
 *  @param _usData          -- Array with all the US data
 */

attainmentVis = function(_parentElement, _data, _usData) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.usData = _usData;

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

    console.log(vis.data);
    console.log(vis.usData);

    vis.margin = { bottom: 50, top: 30, left:50, right:55 };

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
        .range([0, vis.width]);

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
    vis.addLine = vis.svgLine.append('path')
        .attr("class", "line");

    // vis.addFemale20 = vis.svgLine.append('path')
    //     .attr('class', 'line');


    // legends / rect
    var gap = 20;
    var group = 0;

    vis.legend = vis.svgLine.append('circle')
        .attr('cx', vis.width*0.85)
        .attr('cy', 0)
        .attr('r', 5)
        .attr('class', 'legend')
        .style('opacity', 0)
        .style('fill', '#663399');

    vis.legendText = vis.svgLine.append('text')
        .attr('x', vis.width*0.85 +15)
        .attr('y', 4)
        .attr('class', 'legend-text')
        .style('opacity', 0)
        .text('All population');

    vis.legendMale = vis.svgLine.append('circle')
        .attr('cx', vis.width*0.85)
        .attr('cy', group)
        .attr('r', 5)
        .attr('class', 'legend legend-gender')
        .style('opacity', 0)
        .style('fill', '#1d65af');

    vis.legendMaleText = vis.svgLine.append('text')
        .attr('x', vis.width*0.85 + 15)
        .attr('y', 4+ group)
        .attr('class', 'legend-text legend-gender')
        .style('opacity', 0)
        .text('Male Population');

    vis.legendFemale = vis.svgLine.append('circle')
        .attr('cx', vis.width*0.85)
        .attr('cy', group +gap)
        .attr('r', 5)
        .attr('class', 'legend legend-gender')
        .style('opacity', 0)
        .style('fill', '#a52731');

    vis.legendFemaleText = vis.svgLine.append('text')
        .attr('x', vis.width*0.85 + 15)
        .attr('y', 4+ group +gap)
        .attr('class', 'legend-text legend-gender')
        .style('opacity', 0)
        .text('Female Population');

    vis.legendUrban = vis.svgLine.append('circle')
        .attr('cx', vis.width*0.85)
        .attr('cy', group*2)
        .attr('r', 5)
        .attr('class', 'legend legend-urban')
        .style('opacity', 0)
        .style('fill', '#656565');

    vis.legendUrbanText = vis.svgLine.append('text')
        .attr('x', vis.width*0.85 + 15)
        .attr('y', 4+ group*2 )
        .attr('class', 'legend-text legend-urban')
        .style('opacity', 0)
        .text('Urban Population');

    vis.legendRural = vis.svgLine.append('circle')
        .attr('cx', vis.width*0.85)
        .attr('cy', group*2 + gap*1)
        .attr('r', 5)
        .attr('class', 'legend legend-urban')
        .style('opacity', 0)
        .style('fill', '#147f27');

    vis.legendRuralText = vis.svgLine.append('text')
        .attr('x', vis.width*0.85 + 15)
        .attr('y', 4 +group*2 +gap*1)
        .attr('class', 'legend-text legend-urban')
        .style('opacity', 0)
        .text('Rural Population');

    vis.legendQ1 = vis.svgLine.append('circle')
        .attr('cx', vis.width*0.85)
        .attr('cy', group*3)
        .attr('r', 5)
        .attr('class', 'legend legend-income')
        .style('opacity', 0)
        .style('fill', '#08589e');

    vis.legendQ1Text = vis.svgLine.append('text')
        .attr('x', vis.width*0.85 + 15)
        .attr('y', 4 +group*3)
        .attr('class', 'legend-text legend-income')
        .style('opacity', 0)
        .text('First Income Quintile');

    vis.legendQ2 = vis.svgLine.append('circle')
        .attr('cx', vis.width*0.85)
        .attr('cy', group*3+gap*1)
        .attr('r', 5)
        .attr('class', 'legend legend-income')
        .style('opacity', 0)
        .style('fill', '#2b8cbe');

    vis.legendQ2Text = vis.svgLine.append('text')
        .attr('x', vis.width*0.85 + 15)
        .attr('y', 4 +group*3+gap*1)
        .attr('class', 'legend-text legend-income')
        .style('opacity', 0)
        .text('Second Income Quintile');

    vis.legendQ3 = vis.svgLine.append('circle')
        .attr('cx', vis.width*0.85)
        .attr('cy', group*3+gap*2)
        .attr('r', 5)
        .attr('class', 'legend legend-income')
        .style('opacity', 0)
        .style('fill', '#4eb3d3');

    vis.legendQ3Text = vis.svgLine.append('text')
        .attr('x', vis.width*0.85 + 15)
        .attr('y', 4+group*3 +gap*2)
        .attr('class', 'legend-text legend-income')
        .style('opacity', 0)
        .text('Third Income Quintile');

    vis.legendQ4 = vis.svgLine.append('circle')
        .attr('cx', vis.width*0.85)
        .attr('cy', group*3+gap*3)
        .attr('r', 5)
        .attr('class', 'legend legend-income')
        .style('opacity', 0)
        .style('fill', '#7bccc4');

    vis.legendQ4Text = vis.svgLine.append('text')
        .attr('x', vis.width*0.85 + 15)
        .attr('y', 4+group*3 +gap*3)
        .attr('class', 'legend-text legend-income')
        .style('opacity', 0)
        .text('Forth Income Quintile');

    vis.legendQ5 = vis.svgLine.append('circle')
        .attr('cx', vis.width*0.85)
        .attr('cy', group*3+gap*4)
        .attr('r', 5)
        .attr('class', 'legend legend-income')
        .style('opacity', 0)
        .style('fill', '#a8ddb5');

    vis.legendQ5Text = vis.svgLine.append('text')
        .attr('x', vis.width*0.85 + 15)
        .attr('y', 4 +group*3+gap*4)
        .attr('class', 'legend-text legend-income')
        .style('opacity', 0)
        .text('Fifth Income Quintile');


    vis.chooseAll();
}

/*
 *
 */
attainmentVis.prototype.chooseAll = function() {
    var vis = this;

    console.log(vis.data);

    vis.selectData = vis.data.filter(function(d){
        return d.var=="all";
    });
    console.log(vis.selectData);

    vis.wrangleData();
}


/*
 *  Data wrangling
 */

attainmentVis.prototype.wrangleData = function() {
    var vis = this;

    vis.selectedCountry = d3.select("#line-select-country").property("value");

    // filtering by country
    console.log(vis.selectData);
    console.log(vis.selectedCountry);

    // NOTE: Not doing average anymore but doing comparison with average of the developed countries
    // creating the var for world average for each age group


    // selecting the data to be used for the line graph
    if(vis.selectedCountry == "default") {
        vis.filteredData = vis.selectData; //need to change this to the world average for each education year
    } else {
        vis.filteredData = vis.selectData.filter(function(d){
            if(vis.selectedCountry == d.country) return true;
            else return false;
        })
    };
    console.log(vis.filteredData);


    vis.updateLineVis();
}


/*
 *  UpdateLineVis
 */
attainmentVis.prototype.updateLineVis = function() {
    var vis = this;

    vis.legend.style('opacity', function(){
        if(vis.selectedCountry=="default") { return 0; }
        else { return 1; }
    });
    vis.legendText.style('opacity', function(){
        if(vis.selectedCountry=="default") { return 0; }
        else { return 1; }
    });


    // update domain for axis
    vis.eduMin = d3.min(vis.filteredData, function(d) { return d.edyears; });
    vis.eduMax = d3.max(vis.filteredData, function(d) { return d.edyears; });

    vis.x.domain([vis.eduMin, vis.eduMax]);


    // adding Axes
    vis.addX.transition().duration(1000).call(vis.xAxis);
    vis.addY.transition().duration(1000).call(vis.yAxis);


    // adding lines
    vis.line = d3.line()
        .x(function(d){ return vis.x(d.edyears); })
        .y(function(d){ return vis.y(d.pct20_29); })
        .curve(d3.curveLinear);

    // vis.addLine = vis.svgLine
    //     // .append('path')
    //     .data(vis.filteredData)
    //     .attr("class", "line");

    vis.addLine
        // .enter().append('path')
        // .merge(vis.addLine)
        .transition().duration(1000)
        .attr('d', vis.line(vis.filteredData))
        .style('opacity', function(){
            if(vis.selectedCountry=="default") { return 0;
            } else { return 1; }
        });
        // .style('stroke', function(d){
        //     if(vis.filteredData.var_num=='all') { return '#663399';}
        //     if(vis.filteredData.var_num=='female') { return '#a52731';}
        //     if(vis.filteredData.var_num=='male') { return '#1d65af';}
        //     if(vis.filteredData.var_num=='urban') { return '#656565';}
        //     if(vis.filteredData.var_num=='rural') { return '#147f27';}
        //     if(vis.filteredData.var_num=='q1') { return '#08589e';}
        //     if(vis.filteredData.var_num=='q2') { return '#2b8cbe';}
        //     if(vis.filteredData.var_num=='q3') { return '#4eb3d3';}
        //     if(vis.filteredData.var_num=='q4') { return '#7bccc4';}
        //     else { return '#a8ddb5';}
        // });


    // dots
    vis.circles = vis.svgLine.selectAll('circle.points20')
        .data(vis.filteredData);

    vis.circles.enter()
        .append('circle')
        .merge(vis.circles)
        .attr('class', 'points points20')
        .attr('r', 3)
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
        // .style('fill', function(){
        //     if(vis.filteredData.var_num=='all') { return '#663399';}
        //     if(vis.filteredData.var_num=='female') { return '#a52731';}
        //     if(vis.filteredData.var_num=='male') { return '#1d65af';}
        //     if(vis.filteredData.var_num=='urban') { return '#656565';}
        //     if(vis.filteredData.var_num=='rural') { return '#147f27';}
        //     if(vis.filteredData.var_num=='q1') { return '#08589e';}
        //     if(vis.filteredData.var_num=='q2') { return '#2b8cbe';}
        //     if(vis.filteredData.var_num=='q3') { return '#4eb3d3';}
        //     if(vis.filteredData.var_num=='q4') { return '#7bccc4';}
        //     else { return '#a8ddb5';}
        // })
        .attr('title', function(d){
            return "<b>" + vis.selectedCountry + "</b>"+ "</br>" + showAge(d) + "</br> Group: All Population </br> Share: " + showShare(d) ;
        });

    vis.circles.transition().duration(1000);


    // exit().remove()
    vis.circles.exit().remove();
    vis.addLine.exit().remove();


    // initializing tool tips
    $('.points').tooltipsy({
        // alignTo: 'cursor',
        offset: [10, -3],
        css: {
            'padding': '10px',
            'max-width': '200px',
            'color': '#f4f4f4',
            'background-color': 'rgba(101, 101, 101, 1)',
            'border': '0.1px solid #656565',
            'border-radius': '10px',
            // '-moz-box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
            // '-webkit-box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
            // 'box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
            'text-shadow': 'none'
        }
    });


}

function showShare(d){
    return d.pct20_29.toPrecision(3);
}

function showAge(){ return "Age: 20-29"; }

/*
 *
 */
attainmentVis.prototype.chooseGender = function() {
    var vis = this;

    vis.selectData = vis.data.filter(function(d){
        return d.var=="female" || d.var=='male';
    });
    console.log(vis.selectData);

    vis.wrangleData();
}

attainmentVis.prototype.chooseUrban = function() {
    var vis = this;

    vis.selectData = vis.data.filter(function(d){
        return d.var=="urban" || d.var=='rural';
    });
    console.log(vis.selectData);

    vis.wrangleData();
}

attainmentVis.prototype.chooseIncome = function() {
    var vis = this;

    vis.selectData = vis.data.filter(function(d){
        return d.var=="q1" || d.var=='q2' || d.var=="q3" || d.var=='q4' || d.var=='q5';
    });
    console.log(vis.selectData);

    vis.wrangleData();
}