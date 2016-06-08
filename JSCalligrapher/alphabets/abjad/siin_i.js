var VectorUtils = require('../../utils/vector_utils'),
    scaleVector = VectorUtils.scaleVector,
    addVectors = VectorUtils.addVectors;

function firstSwoop(t) {
  var vectorContributions = [];
  var ctrlPts = [[0,0],[7,47],[-31,45],[-29,8]];
  vectorContributions.push(scaleVector(Math.pow(1 - t, 3), ctrlPts[0]));
  vectorContributions.push(scaleVector(3 * t * Math.pow(1 - t, 2), ctrlPts[1]));
  vectorContributions.push(scaleVector(3 * (1 - t) * Math.pow(t, 2), ctrlPts[2]));
  vectorContributions.push(scaleVector(Math.pow(t, 3), ctrlPts[3]));

  return [addVectors(vectorContributions), t + .003];
}

function secondSwoop(t) {
  var vectorContributions = [];
  var ctrlPts = [[0,0],[3,40],[-40,47],[-33,1]];
  vectorContributions.push(scaleVector(Math.pow(1 - t, 3), ctrlPts[0]));
  vectorContributions.push(scaleVector(3 * t * Math.pow(1 - t, 2), ctrlPts[1]));
  vectorContributions.push(scaleVector(3 * (1 - t) * Math.pow(t, 2), ctrlPts[2]));
  vectorContributions.push(scaleVector(Math.pow(t, 3), ctrlPts[3]));

  return [addVectors(vectorContributions), t + .003];
}

function connector(t) {
  var vectorContributions = [];
  var ctrlPts = [[0,0],[3,31],[-20,35],[-30,31]];
  vectorContributions.push(scaleVector(Math.pow(1 - t, 3), ctrlPts[0]));
  vectorContributions.push(scaleVector(3 * t * Math.pow(1 - t, 2), ctrlPts[1]));
  vectorContributions.push(scaleVector(3 * (1 - t) * Math.pow(t, 2), ctrlPts[2]));
  vectorContributions.push(scaleVector(Math.pow(t, 3), ctrlPts[3]));

  return [addVectors(vectorContributions), t + .003];
}

module.exports = [[[0,-40], firstSwoop], [secondSwoop], [connector]];
