var VectorUtils = require('../../utils/vector_utils'),
    scaleVector = VectorUtils.scaleVector,
    addVectors = VectorUtils.addVectors;

function laamStart(t) {
  var vectorContributions = [];
  var ctrlPts = [[0,0],[-33,0],[-15,-60],[-20,-129]];
  vectorContributions.push(scaleVector(Math.pow(1 - t, 3), ctrlPts[0]));
  vectorContributions.push(scaleVector(3 * t * Math.pow(1 - t, 2), ctrlPts[1]));
  vectorContributions.push(scaleVector(3 * (1 - t) * Math.pow(t, 2), ctrlPts[2]));
  vectorContributions.push(scaleVector(Math.pow(t, 3), ctrlPts[3]));

  // If called at 10ms intervals, each parameterized chunk requires 1s
  return [addVectors(vectorContributions), t + .003];
}

function laamEnd(t) {
  var vectorContributions = [];
  var ctrlPts = [[0,0],[2,125],[2,137],[-60,133]];
  vectorContributions.push(scaleVector(Math.pow(1 - t, 3), ctrlPts[0]));
  vectorContributions.push(scaleVector(3 * t * Math.pow(1 - t, 2), ctrlPts[1]));
  vectorContributions.push(scaleVector(3 * (1 - t) * Math.pow(t, 2), ctrlPts[2]));
  vectorContributions.push(scaleVector(Math.pow(t, 3), ctrlPts[3]));

  if(t + .003 > 1) {
    return [[-60,10], t + .003];
  } else {
    return [addVectors(vectorContributions), t + .003];
  }
}

function tiltedAlif(t) {
  var vectorContributions = [];
  var ctrlPts = [[0,0],[24,49],[33,82],[41,121]];
  vectorContributions.push(scaleVector(Math.pow(1 - t, 3), ctrlPts[0]));
  vectorContributions.push(scaleVector(3 * t * Math.pow(1 - t, 2), ctrlPts[1]));
  vectorContributions.push(scaleVector(3 * (1 - t) * Math.pow(t, 2), ctrlPts[2]));
  vectorContributions.push(scaleVector(Math.pow(t, 3), ctrlPts[3]));

  // If called at 10ms intervals, each parameterized chunk requires 1s
  return [addVectors(vectorContributions), t + .003];
}

module.exports = [laamStart, laamEnd, tiltedAlif];
