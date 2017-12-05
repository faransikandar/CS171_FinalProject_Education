// MAIN JS

// FULLPAGE parameters
$(document).ready(function() {
    $('#fullpage').fullpage({
        anchors: ['firstPage', 'secondPage', '3rdPage', '4thPage', '5thPage'],
        sectionsColor: ['whitesmoke', 'white', 'whitesmoke', 'whitesmoke', 'whitesmoke'],
        navigation: true,
        navigationPosition: 'right',
        navigationTooltips: ['1', '2', '3', '4', '5']
    });
});



var choropleth, ranking, attainment;


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
        // d.avg13_doc_attain = +d.avg13_doc_attain;
        d.avg13_ter_enroll = +d.avg13_ter_enroll;
        d.avg13_gov_edu = +d.avg13_gov_edu;
    });

    eduData = data;


    // creating new instances for the other js vis files
    choropleth = new choroplethMap("#map", geoJSON, eduData);
    // ranking = new rankingVis('#ranking', eduData);

}

// LINE GRAPH
d3.csv('data/cleaned/DHS_all.csv', function(data){

    // destringing data
    data.forEach(function(d){
        d.edyears = +d.edyears;
        d.pct15_19 = +d.pct15_19;
        d.pct15_19_female = +d.pct15_19_female;
        d.pct15_19_male = +d.pct15_19_male;
        d.pct15_19_urban = +d.pct15_19_urban;
        d.pct15_19_rural = +d.pct15_19_rural;
        d.pct15_19_q1 = +d.pct15_19_q1;
        d.pct15_19_q2 = +d.pct15_19_q2;
        d.pct15_19_q3 = +d.pct15_19_q3;
        d.pct15_19_q4 = +d.pct15_19_q4;
        d.pct15_19_q5 = +d.pct15_19_q5;
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
        d.pct30_39 = +d.pct30_39;
        d.pct30_39_male = +d.pct30_39_male;
        d.pct30_39_female = +d.pct30_39_female;
        d.pct30_39_urban = +d.pct30_39_urban;
        d.pct30_39_rural = +d.pct30_39_rural;
        d.pct30_39_q1 = +d.pct30_39_q1;
        d.pct30_39_q2 = +d.pct30_39_q2;
        d.pct30_39_q3 = +d.pct30_39_q3;
        d.pct30_39_q4 = +d.pct30_39_q4;
        d.pct30_39_q5 = +d.pct30_39_q5;
        d.pct40_49 = +d.pct40_49;
        d.pct40_49_male = +d.pct40_49_male;
        d.pct40_49_female = +d.pct40_49_female;
        d.pct40_49_urban = +d.pct40_49_urban;
        d.pct40_49_rural = +d.pct40_49_rural;
        d.pct40_49_q1 = +d.pct40_49_q1;
        d.pct40_49_q2 = +d.pct40_49_q2;
        d.pct40_49_q3 = +d.pct40_49_q3;
        d.pct40_49_q4 = +d.pct40_49_q4;
        d.pct40_49_q5 = +d.pct40_49_q5;
    });

    allDHS = data;

    // creating new instance for the attainment profile vis
    attainment = new attainmentVis("#line-area", allDHS);



});

// MATRIX
var matrix;

// load data
queue()
    .defer(d3.csv, "data/data_coeffs.csv")
    .await(function(error, reg1Data) {
        console.log(reg1Data);

        matrix = new Matrix("matrix-viz", reg1Data);
    });

