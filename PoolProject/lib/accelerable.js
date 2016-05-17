var VectorUtils = require('./vector_utils');

var Accelerable = {
  accelerate: function(rate) {
    this.vel[0] += rate[0];
    this.vel[1] += rate[1];
  },
  friction: function() {
    var frictionDir = Math.PI + VectorUtils.directionOf(this.vel);
    this.vel[0] += .03 * Math.cos(frictionDir);
    this.vel[1] += .03 * Math.sin(frictionDir);
    if (Math.abs(this.vel[0]) < .1) {
      this.vel[0] = 0;
    }
    if (Math.abs(this.vel[1]) < .1) {
      this.vel[1] = 0;
    }
  }
};

module.exports = Accelerable;
