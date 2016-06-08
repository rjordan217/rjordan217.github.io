var VectorUtils = require('../../utils/vector_utils'),
    scaleVector = VectorUtils.scaleVector,
    addVectors = VectorUtils.addVectors,
    runway = require('./runway')(30);

function haaFirstStroke(t) {
  var vectorContributions = [];
  var ctrlPts = [[0,0],[-48,-39],[11,-114],[23,-35]];
  vectorContributions.push(scaleVector(Math.pow(1 - t, 3), ctrlPts[0]));
  vectorContributions.push(scaleVector(3 * t * Math.pow(1 - t, 2), ctrlPts[1]));
  vectorContributions.push(scaleVector(3 * (1 - t) * Math.pow(t, 2), ctrlPts[2]));
  vectorContributions.push(scaleVector(Math.pow(t, 3), ctrlPts[3]));

  // If called at 10ms intervals, each parameterized chunk requires 1s
  return [addVectors(vectorContributions), t + .003];
}

function haaLoop(t) {
  var vectorContributions = [];
  var ctrlPts = [[0,0],[-19,36],[-73,79],[-24,97]];
  vectorContributions.push(scaleVector(Math.pow(1 - t, 3), ctrlPts[0]));
  vectorContributions.push(scaleVector(3 * t * Math.pow(1 - t, 2), ctrlPts[1]));
  vectorContributions.push(scaleVector(3 * (1 - t) * Math.pow(t, 2), ctrlPts[2]));
  vectorContributions.push(scaleVector(Math.pow(t, 3), ctrlPts[3]));

  // If called at 10ms intervals, each parameterized chunk requires 1s
  return [addVectors(vectorContributions), t + .003];
}

function haaLastStroke(t) {
  var vectorContributions = [];
  var ctrlPts = [[0,0],[27,-10],[34,-73],[-37,-62]];
  vectorContributions.push(scaleVector(Math.pow(1 - t, 3), ctrlPts[0]));
  vectorContributions.push(scaleVector(3 * t * Math.pow(1 - t, 2), ctrlPts[1]));
  vectorContributions.push(scaleVector(3 * (1 - t) * Math.pow(t, 2), ctrlPts[2]));
  vectorContributions.push(scaleVector(Math.pow(t, 3), ctrlPts[3]));

  // If called at 10ms intervals, each parameterized chunk requires 1s
  return [addVectors(vectorContributions), t + .003];
}

module.exports = [[runway], [haaFirstStroke], [haaLoop], [haaLastStroke]];
