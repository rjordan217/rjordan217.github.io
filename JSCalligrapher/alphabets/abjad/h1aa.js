var VectorUtils = require('../../utils/vector_utils'),
    scaleVector = VectorUtils.scaleVector,
    addVectors = VectorUtils.addVectors;

var haaFirstStroke = function(t) {
  var vectorContributions = [];
  var ctrlPts = [[0,0],[2,-19],[25,-12],[134,-15]];
  vectorContributions.push(scaleVector(Math.pow(1 - t, 3), ctrlPts[0]));
  vectorContributions.push(scaleVector(3 * t * Math.pow(1 - t, 2), ctrlPts[1]));
  vectorContributions.push(scaleVector(3 * (1 - t) * Math.pow(t, 2), ctrlPts[2]));
  vectorContributions.push(scaleVector(Math.pow(t, 3), ctrlPts[3]));

  // If called at 10ms intervals, each parameterized chunk requires 1s
  return [addVectors(vectorContributions), t + .003];
};

var haaSwoop = function(t) {
  var vectorContributions = [];
  var ctrlPts = [[0,0],[-263,49],[-102,239],[7,137]];
  vectorContributions.push(scaleVector(Math.pow(1 - t, 3), ctrlPts[0]));
  vectorContributions.push(scaleVector(3 * t * Math.pow(1 - t, 2), ctrlPts[1]));
  vectorContributions.push(scaleVector(3 * (1 - t) * Math.pow(t, 2), ctrlPts[2]));
  vectorContributions.push(scaleVector(Math.pow(t, 3), ctrlPts[3]));

  // If called at 10ms intervals, each parameterized chunk requires 1s
  return [addVectors(vectorContributions), t + .003];
};

module.exports = [haaFirstStroke, haaSwoop];
