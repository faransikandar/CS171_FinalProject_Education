var matrix;

// load data
queue()
    .defer(d3.csv, "data/data_coeffs.csv")
    .await(function(error, reg1Data) {
        console.log(reg1Data);

        matrix = new Matrix("matrix-viz", reg1Data);
    });

