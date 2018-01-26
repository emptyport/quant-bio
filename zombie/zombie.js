function runZombieSimulation(x, r, steps, title, div) {
  var A = [ 
        [0, 3, 0.1],
        [1-r, 0.6, 0],
        [0, 0.3, 0.4]
      ];

  var simResults = new Array(steps+1).fill(new Array(3));
  simResults[0] = x;

  for(var i=1; i<steps+1; i++) {
    var newX = math.multiply(A, simResults[i-1]);
    simResults[i] = newX;
  }

  var numDays = 101; // 100 days plus day 0
  var days = Array.apply(null, {length: numDays}).map(Number.call, Number)

  plotZombieGraph(simResults, days, title, div);

}

function plotZombieGraph(simResults, days, title, div) {
  var data = math.transpose(simResults);
  var dataHuman = data[0];
  var dataFastZombie = data[1];
  var dataSlowZombie = data[2];

  var traceHuman = {
    x: days,
    y: dataHuman,
    mode: 'lines',
    name: 'Infected Humans'
  };

  var traceFastZombie = {
    x: days,
    y: dataFastZombie,
    mode: 'lines',
    name: 'Fast Zombies'
  };

  var traceSlowZombie = {
    x: days,
    y: dataSlowZombie,
    mode: 'lines',
    name: 'Slow Zombies'
  };

  var plotData = [traceHuman, traceFastZombie, traceSlowZombie];

  var layout = {
    title: title,
  };

  Plotly.newPlot(div, plotData, layout);
}

function setRFromMaxEigenvalue(maxEigenvalue) {
  var difference = 99999;
  var closestR = -1;

  for(var r=0; r<=1; r+=0.001) {
    var A = [ 
      [0, 3, 0.1],
      [1-r, 0.6, 0],
      [0, 0.3, 0.4]
    ];
    var eig = numeric.eig(A);
    var eigenvalues = eig.lambda.x;
    var positiveEigenvalues = math.abs(eigenvalues);
    var maxVal = math.max(positiveEigenvalues);
    var currentDifference = math.abs(maxVal - maxEigenvalue);
    if(currentDifference < difference) {
      closestR = r;
      difference = currentDifference;
    }
  }
  return closestR.toFixed(3);  
}


runZombieSimulation([20,0,0], 0.5, 100, 'Population curves with r=0.5', 'initial-plot');

var r1 = setRFromMaxEigenvalue(0.98);
runZombieSimulation([20,0,0], r1, 100, 'Population curves with r='+r1, 'r1-plot');

var r2 = setRFromMaxEigenvalue(1);
runZombieSimulation([20,0,0], r2, 100, 'Population curves with r='+r2, 'r2-plot');

var r3 = setRFromMaxEigenvalue(1.02);
runZombieSimulation([20,0,0], r3, 100, 'Population curves with r='+r3, 'r3-plot');
