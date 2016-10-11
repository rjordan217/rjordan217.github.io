var VectorUtils = require('./vector_utils'),
    scaleVector = VectorUtils.scaleVector,
    addVectors = VectorUtils.addVectors;

var BezierPath = function(ctrlPts, timeChange) {
  timeChange = timeChange || .001;
  function parameterizedBezier(t) {
    var vectorContributions = [];
    vectorContributions.push(scaleVector(Math.pow(1 - t, 3), ctrlPts[0]));
    vectorContributions.push(scaleVector(3 * t * Math.pow(1 - t, 2), ctrlPts[1]));
    vectorContributions.push(scaleVector(3 * (1 - t) * Math.pow(t, 2), ctrlPts[2]));
    vectorContributions.push(scaleVector(Math.pow(t, 3), ctrlPts[3]));

    // If called at 10ms intervals, each parameterized chunk requires 1s
    return [addVectors(vectorContributions), t + timeChange];
  }

  return parameterizedBezier;
}

module.exports = BezierPath;
