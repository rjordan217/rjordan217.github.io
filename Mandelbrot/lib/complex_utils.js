function squareAndAddComplexNum(z, constantC) {
  var a = z[0],
  b = z[1],
  c1 = constantC[0],
  c2 = constantC[1];

  return [a * a - b * b + c1, 2 * a * b + c2];
}

function magnitude(z) {
  var a = z[0],
  b = z[1];

  return a * a + b * b;
}

module.exports = {
  squareAndAddComplexNum: squareAndAddComplexNum,

  magnitude: magnitude,

  iterate: function(pos, numSteps) {
    var iterator = [0,0];
    for(var i = 0; i < numSteps; i++) {
      iterator = squareAndAddComplexNum(iterator, pos);
      if(magnitude(iterator) > 256) return (1 - i / numSteps) * 255;
    }
    return 0;
  },

  inCardioid: function(pos) {
    var a = pos[0],
    b = pos[1],
    p = Math.sqrt((a - 1 / 4) * (a - 1 / 4) + b * b);

    if(a < p - 2 * p * p + 1 / 4) {
      return true;
    }
    return false;
  },

  inMainDisk: function(pos) {
    var a = pos[0],
    b = pos[1];

    if (magnitude([a + 1, b]) < 1 / 16) return true;
    return false;
  }
};
