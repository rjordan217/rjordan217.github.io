var VectorUtils = {
  distance: function(pos1,pos2) {
    var x1 = pos1[0],
        y1 = pos1[1],
        x2 = pos2[0],
        y2 = pos2[1];

    return Math.sqrt(Math.pow((x2 - x1),2) + Math.pow((y2 - y1),2));
  },
  
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
  },

  diffVector: function(v1, v2) {
    return [v2[0] - v1[0], v2[1] - v1[1]];
  }
};

module.exports = VectorUtils;
