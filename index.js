function loadData(filename, callback) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var data = xhttp.responseText.split("\n");
      callback(data);
    }
  };
    
  xhttp.open("GET", filename, true);
  xhttp.send();
}

function plotData3D(x,y,z,div) {
  console.log("Plotting...");

  var trace = {
    x: x,
    y: y,
    z: z,
    mode: 'markers',
    marker: {
      size: 5,
      color: 'rgb(127, 127, 127)',
      symbol: 'circle',
      line: {
        color: 'rgb(204, 204, 204)',
        width: 1
      },
      opacity: 0.8,
    },
    type: 'scatter3d'
  };

  var graphData = [trace];
  var layout = {
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0
    }
  };

  Plotly.newPlot(div, graphData, layout);
}

function plotHeatMap(data) {
  var heatmap = [
    {
      z: data,
      type: 'heatmap',
    }
  ];

  Plotly.newPlot('heatmap-plot', heatmap);
}

function processData(data) {
  var x = data[0].split("\t");
  var y = data[1].split("\t");
  var z = data[2].split("\t");
  plotData3D(x, y, z, 'scatter-plot');

  var matrix = math.matrix([x, y, z]);
  var matrixT = math.transpose(matrix);
  nrows = math.size(matrixT)._data[0];

  var cov = math.multiply(matrix, matrixT);
  cov = math.divide(cov, nrows);
  // The plotly heatmap starts from bottom left instead of
  // top left. I don't like that and I can't get it to change
  // so I'm leaving this part out for now.
  //plotHeatMap(cov._data);
  var eig = numeric.eig(cov._data);
  console.log(eig);
  var eigenvalues = eig.lambda.x;
  var eigenvectors = eig.E.x;

  console.log(eigenvalues);
  console.log(eigenvectors);

  var newData = math.multiply(eigenvectors, matrix)._data;
  console.log(newData);
  plotData3D(newData[0], newData[1], newData[2], 'pca-plot');
}


loadData("data.txt", processData);
