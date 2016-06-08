var VectorUtils = require('../../utils/vector_utils'),
    scaleVector = VectorUtils.scaleVector,
    addVectors = VectorUtils.addVectors,
    i3jam = require('./i3jam.js');

function nunSwoop(t) {
  var vectorContributions = [];
  var ctrlPts = [[0,0],[35,105],[-125,100],[-90,0]];
  vectorContributions.push(scaleVector(Math.pow(1 - t, 3), ctrlPts[0]));
  vectorContributions.push(scaleVector(3 * t * Math.pow(1 - t, 2), ctrlPts[1]));
  vectorContributions.push(scaleVector(3 * (1 - t) * Math.pow(t, 2), ctrlPts[2]));
  vectorContributions.push(scaleVector(Math.pow(t, 3), ctrlPts[3]));

  return [addVectors(vectorContributions), t + .003];
}

module.exports = [[[0,-40], nunSwoop], [[40,-15], i3jam]];
