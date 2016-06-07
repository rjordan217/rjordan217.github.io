var VectorUtils = require('../../utils/vector_utils'),
    scaleVector = VectorUtils.scaleVector,
    addVectors = VectorUtils.addVectors;

function haaFirstStroke(t) {
  var vectorContributions = [];
  var ctrlPts = [[0,0],[66,30],[50,71],[-22,67]];
  vectorContributions.push(scaleVector(Math.pow(1 - t, 3), ctrlPts[0]));
  vectorContributions.push(scaleVector(3 * t * Math.pow(1 - t, 2), ctrlPts[1]));
  vectorContributions.push(scaleVector(3 * (1 - t) * Math.pow(t, 2), ctrlPts[2]));
  vectorContributions.push(scaleVector(Math.pow(t, 3), ctrlPts[3]));

  // If called at 10ms intervals, each parameterized chunk requires 1s
  return [addVectors(vectorContributions), t + .003];
}

function haaLoop(t) {
  var vectorContributions = [];
  var ctrlPts = [[0,0],[-60,-11],[-15,-84],[27,-42]];
  vectorContributions.push(scaleVector(Math.pow(1 - t, 3), ctrlPts[0]));
  vectorContributions.push(scaleVector(3 * t * Math.pow(1 - t, 2), ctrlPts[1]));
  vectorContributions.push(scaleVector(3 * (1 - t) * Math.pow(t, 2), ctrlPts[2]));
  vectorContributions.push(scaleVector(Math.pow(t, 3), ctrlPts[3]));

  // If called at 10ms intervals, each parameterized chunk requires 1s
  return [addVectors(vectorContributions), t + .003];
}

function haaLastStroke(t) {
  var vectorContributions = [];
  var ctrlPts = [[0,0],[25,41],[-92,46],[-90,45]];
  vectorContributions.push(scaleVector(Math.pow(1 - t, 3), ctrlPts[0]));
  vectorContributions.push(scaleVector(3 * t * Math.pow(1 - t, 2), ctrlPts[1]));
  vectorContributions.push(scaleVector(3 * (1 - t) * Math.pow(t, 2), ctrlPts[2]));
  vectorContributions.push(scaleVector(Math.pow(t, 3), ctrlPts[3]));

  // If called at 10ms intervals, each parameterized chunk requires 1s
  return [addVectors(vectorContributions), t + .003];
}

module.exports = [haaFirstStroke, haaLoop, haaLastStroke];
