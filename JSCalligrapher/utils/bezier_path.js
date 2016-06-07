var scaleVector = function(k, v) {
  return [k * v[0], k * v[1]];
};

var addVectors = function(rowVectors) {
  var sumVector = new Array(rowVectors[0].length);
  sumVector.forEach(function(el){return 0;});
  rowVectors.forEach(function(vector) {
    vector.forEach(function(el, idx) {
      sumVector[idx] += el;
    });
  });
  return sumVector;
};

var BezierPath = function(ctrlPts) {
  function parameterizedBezier(t) {
    var vectorContributions = [];
    vectorContributions.push(scaleVector(Math.pow(1 - t, 3), ctrlPts[0]));
    vectorContributions.push(scaleVector(3 * t * Math.pow(1 - t, 2), ctrlPts[1]));
    vectorContributions.push(scaleVector(3 * (1 - t) * Math.pow(t, 2), ctrlPts[2]));
    vectorContributions.push(scaleVector(Math.pow(t, 3), ctrlPts[3]));

    // If called at 10ms intervals, each parameterized chunk requires 1s
    return [addVectors(vectorContributions), t + .001];
  }

  return parameterizedBezier;
}

module.exports = BezierPath;
