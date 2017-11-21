// MAIN JS

var choropleth, ranking;


// CHOROPLETH + RANKING DATA
queue()
    .defer(d3.json, 'data/worldmap.json')
    .defer(d3.csv, 'data/mapeducation.csv')
    .await(createVis);


function createVis(error, map, data){

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
        d.avg13_doc_attain = +d.avg13_doc_attain;
        d.avg13_ter_enroll = +d.avg13_ter_enroll;
        d.avg13_gov_edu = +d.avg13_gov_edu;
    });

    eduData = data;


    // creating new instances for the other js vis files
    choropleth = new choroplethMap("#map", geoJSON, eduData);
    ranking = new rankingVis('#ranking', eduData);

}


