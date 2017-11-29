var distViz;

// load data
queue()
    .defer(d3.csv, "data/avg_edyears25_35.csv")
    .await(function(error, edyearsData) {

        distViz = new DistViz("dist-viz", edyearsData);
    });

