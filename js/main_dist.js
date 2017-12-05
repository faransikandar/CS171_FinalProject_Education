var distViz;

// load data
queue()
    .defer(d3.csv, "data/cleaned/avg_edyears25_35.csv")
    .await(function(error, data) {

        distViz = new DistViz("discrete-scatterplot", data);

        console.log(data)

    });

