var VectorUtils = {
  scaleVector: function(k, v) {
    return [k * v[0], k * v[1]];
  },

  addVectors: function(rowVectors) {
    var sumVector = [];
    for(var i = 0; i < rowVectors[0].length; i++){ sumVector.push(0); }
    rowVectors.forEach(function(vector) {
      vector.forEach(function(el, idx) {
        sumVector[idx] += el;
      });
    });
    return sumVector;
  }
};

module.exports = VectorUtils;
