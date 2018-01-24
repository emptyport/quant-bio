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
      l: 20,
      r: 20,
      b: 20,
      t: 20,
      pad: 4
    }
  };

  Plotly.newPlot(div, graphData, layout);
}

function populateCovarianceTable(cov) {
  var table = document.getElementById("covariance-table");
  for(var i=0; i<cov.length; i++) {
    var row = document.createElement("tr");
    for(var j=0; j<cov[i].length; j++) {
      var cell = document.createElement("td");
      var content = document.createTextNode(cov[i][j].toFixed(3));
      cell.appendChild(content);
      row.appendChild(cell);
    }
    table.appendChild(row);
  }
}

function populateEigenvalueTable(eigenvalues) {
  var table = document.getElementById("eigenvalue-table");
  var sqrdEig = eigenvalues.map(function(x) {
    return Math.pow(x, 2);
  });
  var total = math.sum(sqrdEig);

  for(var i=0; i<eigenvalues.length; i++) {
    var row = document.createElement("tr");
    var cellPC = document.createElement("td");
    var cellEig = document.createElement("td");
    var cellVar = document.createElement("td");
    cellPC.innerHTML = i+1;
    cellEig.innerHTML = eigenvalues[i].toFixed(3);
    cellVar.innerHTML = (sqrdEig[i]/total*100).toFixed(1);
    row.appendChild(cellPC);
    row.appendChild(cellEig);
    row.appendChild(cellVar);
    table.appendChild(row);
  }
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
  populateCovarianceTable(cov._data);
  
  var eig = numeric.eig(cov._data);
  var eigenvalues = eig.lambda.x;
  var eigenvectors = eig.E.x;

  populateEigenvalueTable(eigenvalues);

  console.log(eigenvalues);
  console.log(eigenvectors);

  var newData = math.multiply(eigenvectors, matrix)._data;
}

loadData("data.txt", processData);

