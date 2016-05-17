var VectorUtils = {
  distance: function(pos1,pos2) {
    var x1 = pos1[0],
        y1 = pos1[1],
        x2 = pos2[0],
        y2 = pos2[1];

    return Math.sqrt(Math.pow((x2 - x1),2) + Math.pow((y2 - y1),2));
  },

  directionOf: function(vector) {
      return Math.atan2(vector[1],vector[0]);
  },

  magnitudeOf: function(vector) {
    return Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
  },

  radialOf: function(v1,v2) {
    return [ v2[0] - v1[0], v2[1] - v1[1] ];
  },

  vectorSum: function(v1,v2) {
    return [ v1[0] + v2[0], v1[1] + v2[1] ];
  },

  vectorDiff: function(v1,v2) {
    return [ v1[0] - v2[0], v1[1] - v2[1] ];
  },

  negativeOf: function(vector) {
    return [ -vector[0], -vector[1] ];
  },

  dotProduct: function(v1,v2) {
    return v1[0] * v2[0] + v1[1] * v2[1];
  },

  scale: function(factor, vector) {
    return [ factor * vector[0], factor * vector[1] ];
  }
};

module.exports = VectorUtils;
