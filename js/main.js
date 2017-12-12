// MAIN JS

// FULLPAGE parameters
$(document).ready(function() {
    $('#fullpage').fullpage({
        anchors: ['firstPage', 'secondPage', '3rdPage', '4thPage', '5thPage', '6thPage', '7thPage', '8thPage', '9thPage'],
        sectionsColor: ['whitesmoke', 'whitesmoke', 'white', 'whitesmoke', 'whitesmoke', 'whitesmoke', 'whitesmoke', 'whitesmoke'],
        navigation: true,
        navigationPosition: 'right',
        navigationTooltips: ['1', '2', '3', '4', '5', '6', '7', '8', '9']
    });
});


var choropleth, attainment;

// CHOROPLETH + RANKING DATA
queue()
    .defer(d3.json, 'data/worldmap.json')
    .defer(d3.csv, 'data/mapeducation.csv')
    .await(createMap);

function createMap(error, map, data){
    // projecting the maps
    geoJSON = topojson.feature(map, map.objects.countries).features;

    // destringing data in "data"
    data.forEach(function(d){
        d.avg13_literacy1524 = +d.avg13_literacy1524;
        d.avg13_pri_compt = +d.avg13_pri_compt;
        d.avg13_pri_attain = +d.avg13_pri_attain;
        d.avg13_pri_enroll = +d.avg13_pri_enroll;
        d.avg13_pri_teacher = +d.avg13_pri_teacher;
        d.avg13_sec_low_attain = +d.avg13_sec_low_attain;
        d.avg13_sec_up_attain = +d.avg13_sec_up_attain;
        d.avg13_sec_post_attain = +d.avg13_sec_post_attain;
        d.avg13_sec_enroll = +d.avg13_pri_enroll;
        d.avg13_sec_teacher = +d.avg13_sec_teacher;
        d.avg13_bac_attain = +d.avg13_bac_attain;
        d.avg13_mas_attain = +d.avg13_mas_attain;
        d.avg13_ter_enroll = +d.avg13_ter_enroll;
        d.avg13_gov_edu = +d.avg13_gov_edu;
    });

    eduData = data;

    // creating new instances for the other js vis files
    choropleth = new choroplethMap("#map", geoJSON, eduData);
    // ranking = new rankingVis('#ranking', eduData);

}

// LINE GRAPH
queue()
    .defer(d3.csv, 'data/cleaned/DHS_all_original.csv')
    .defer(d3.csv, 'data/cleaned/USAedattain_short.csv')
    .await(attainData);

function attainData(error, data, usData){
    // destringing data
    data.forEach(function(d){
        d.edyears = +d.edyears;
        d.pct20_29 = +d.pct20_29;
        d.pct20_29_male = +d.pct20_29_male;
        d.pct20_29_female = +d.pct20_29_female;
        d.pct20_29_urban = +d.pct20_29_urban;
        d.pct20_29_rural = +d.pct20_29_rural;
        d.pct20_29_q1 = +d.pct20_29_q1;
        d.pct20_29_q2 = +d.pct20_29_q2;
        d.pct20_29_q3 = +d.pct20_29_q3;
        d.pct20_29_q4 = +d.pct20_29_q4;
        d.pct20_29_q5 = +d.pct20_29_q5;

    });

    allDHS = data;

    // destring US data
    usData.forEach(function(d){
        d.edyears = +d.edyears;
        d.pct20_29 = +d.pct20_29;
        d.pct20_29_male = +d.pct20_29_male;
        d.pct20_29_female = +d.pct20_29_female;
        d.pct20_29_urban = +d.pct20_29_urban;
        d.pct20_29_rural = +d.pct20_29_rural;
        d.pct20_29_q1 = +d.pct20_29_q1;
        d.pct20_29_q2 = +d.pct20_29_q2;
        d.pct20_29_q3 = +d.pct20_29_q3;
        d.pct20_29_q4 = +d.pct20_29_q4;
        d.pct20_29_q5 = +d.pct20_29_q5;

    });

    console.log(usData);

    // creating new instance for the attainment profile vis
    attainment = new attainmentVis("#line-area", data, usData);
};


// DISTRIBUTION
var distViz;

// load data
queue()
    .defer(d3.csv, "data/cleaned/avg_edyears25_35.csv")
    .await(function(error, data) {

        distViz = new DistViz("discrete-scatterplot", data);
    });

var view1 = $("#view1");
var view2 = $("#view2");
var view3 = $("#view3");

var dist_triggers = [view1, view2, view3];

dist_triggers.forEach(function(trigger) {
    trigger.click(function() {
        console.log(trigger);
        var yvar = trigger.text();
        if (yvar=="Default") {
            d3.select("#discrete-scatterplot").selectAll(".distLines").remove();
            d3.select("#discrete-scatterplot").selectAll(".rectAfrica").remove();
            d3.select("#discrete-scatterplot").selectAll(".rectAsia").remove();
            d3.select("#discrete-scatterplot").selectAll(".rectAmericas").remove();
            d3.select("#discrete-scatterplot").selectAll(".rectEurope").remove();
            d3.select("#discrete-scatterplot").selectAll(".dist-legend").remove();
            d3.select("#discrete-scatterplot").selectAll(".dist-legend2").remove();
            d3.select("#discrete-scatterplot").selectAll(".dist-instruct").remove();
            distViz.updateVis();
        }
        if (yvar=="General region") {
            d3.select("#discrete-scatterplot").selectAll(".monoLines").remove();
            d3.select("#discrete-scatterplot").selectAll(".rectAfrica").remove();
            d3.select("#discrete-scatterplot").selectAll(".rectAsia").remove();
            d3.select("#discrete-scatterplot").selectAll(".rectAmericas").remove();
            d3.select("#discrete-scatterplot").selectAll(".rectEurope").remove();
            d3.select("#discrete-scatterplot").selectAll(".dist-legend").remove();
            d3.select("#discrete-scatterplot").selectAll(".dist-legend2").remove();
            d3.select("#discrete-scatterplot").selectAll(".dist-instruct").remove();
            distViz.updateVis2();
        }
        if (yvar=="Stacked region") {
            d3.select("#discrete-scatterplot").selectAll(".distLines").remove();
            d3.select("#discrete-scatterplot").selectAll(".dist-legend2").remove();
            d3.select("#discrete-scatterplot").selectAll(".monoLines").remove();
            d3.select("#discrete-scatterplot").selectAll(".dist-instruct").remove();
            distViz.updateVis3();
        }
        /*if (distViz != null) {
            distViz.updateVis();
        }*/
        return false;
    });
});


$(".btn-group > a").click(function(){
    $(this).addClass("active");
    $(this).siblings().removeClass("active");
    //$(this).parent().parent().siblings().children().children().not(this).removeClass("active");
});




// MATRIX
var matrix;

// load data
queue()
    .defer(d3.csv, "data/ref_coeffs.csv")
    .await(function(error, reg1Data) {
        console.log(reg1Data);

        matrix = new Matrix("matrix-viz", reg1Data);
    });


var value1 = $("#value");
var value2 = $("#value2");

var age_triggers = [value1, value2];

age_triggers.forEach(function(age_trigger) {
    age_trigger.click(function() {
        console.log(age_trigger);
        var yvar = age_trigger.text();
        if (yvar=="Enrollment in secondary school") { yvar = "value";}
        if (yvar=="Enrollment in higher education") { yvar = "value2";}
        if (matrix != null) {
            matrix.yvar = yvar;
            matrix.updateVis();
        }
        return false;
    });
});


$(".btn-group > a").click(function(){
    $(this).addClass("active");
    $(this).siblings().removeClass("active");
    //$(this).parent().parent().siblings().children().children().not(this).removeClass("active");
});

$(".btn-group2 > span").click(function(){
    $(this).addClass("active");
    $(this).siblings().removeClass("active");
    //$(this).parent().parent().siblings().children().children().not(this).removeClass("active");
});