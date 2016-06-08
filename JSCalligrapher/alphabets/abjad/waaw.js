var VectorUtils = require('../../utils/vector_utils'),
    scaleVector = VectorUtils.scaleVector,
    addVectors = VectorUtils.addVectors;

function waawStart(t) {
  var vectorContributions = [];
  var ctrlPts = [[0,0],[-70,-10],[-40,-70],[2,-23]];
  vectorContributions.push(scaleVector(Math.pow(1 - t, 3), ctrlPts[0]));
  vectorContributions.push(scaleVector(3 * t * Math.pow(1 - t, 2), ctrlPts[1]));
  vectorContributions.push(scaleVector(3 * (1 - t) * Math.pow(t, 2), ctrlPts[2]));
  vectorContributions.push(scaleVector(Math.pow(t, 3), ctrlPts[3]));

  return [addVectors(vectorContributions), t + .003];
}

function waawEnd(t) {
  var vectorContributions = [];
  var ctrlPts = [[0,0],[11,21],[-28,108],[-96,80]];
  vectorContributions.push(scaleVector(Math.pow(1 - t, 3), ctrlPts[0]));
  vectorContributions.push(scaleVector(3 * t * Math.pow(1 - t, 2), ctrlPts[1]));
  vectorContributions.push(scaleVector(3 * (1 - t) * Math.pow(t, 2), ctrlPts[2]));
  vectorContributions.push(scaleVector(Math.pow(t, 3), ctrlPts[3]));

  return [addVectors(vectorContributions), t + .003];
}

module.exports = [[waawStart], [waawEnd, [0, -57]]];
