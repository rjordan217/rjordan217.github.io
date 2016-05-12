var VectorUtils = require('./vector_utils');

var Collidable = {
  move: function() {
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];
  },


  changeXDir: function() {
    this.vel[0] *= -1;
  },

  changeYDir: function() {
    this.vel[1] *= -1;
  },

  changeDirByAngle: function(angle) {
    var rads = angle / 180 * Math.PI;
    var xVel = this.vel[0];
    var yVel = this.vel[1];
    var original;
    var speed = VectorUtils.magnitude(this.vel);
    if (xVel !== 0) {
      original = Math.atan2(yVel, xVel);
      if (xVel < 0) original += Math.PI;
    } else {
      if (yVel < 0) {
        original = - Math.PI;
      } else {
        original = Math.PI;
      }
    }
    this.vel[0] = speed * Math.cos(original + rads);
    this.vel[1] = speed * Math.sin(original + rads);
  },

  collidedWithBall: function(otherBall) {
    var distancia = VectorUtils.distance(this.pos, otherBall.pos)
    if (distancia < (this.radius + otherBall.radius)) {
      if (this.pos[0] !== otherBall.pos[0] || this.pos[1] !== otherBall.pos[1]) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  },

  collidedWithXWall: function() {
    if(this.isSunk) {
      return false;
    }
    var x = this.pos[0],
        radius = this.radius;
    if (x - radius < TOP_LEFT[0]) {
      this.pos[0] = TOP_LEFT[0] + radius;
      return true;
    }
    if(x + radius > BOTTOM_RIGHT[0]) {
      this.pos[0] = BOTTOM_RIGHT[0] - radius;
      return true;
    }
    return false;
  },

  collidedWithYWall: function() {
    if(this.isSunk) {
      return false;
    }
    var y = this.pos[1],
        radius = this.radius;
    if (y - radius < TOP_LEFT[1]) {
      this.pos[1] = TOP_LEFT[1] + radius;
      return true;
    }
    if(y + radius > BOTTOM_RIGHT[1]) {
      this.pos[1] = BOTTOM_RIGHT[1] - radius;
      return true;
    }
    return false;
  },

  isInHole: function(hole) {
    if (VectorUtils.distance(this.pos, hole.pos) < hole.radius + this.radius / 2) {
      return true;
    } else {
      return false;
    }
  },

  exchangeMomentum: function(otherBall) {
    var velDiff1 = VectorUtils.vectorDiff(this.vel, otherBall.vel),
        locDiff1 = VectorUtils.vectorDiff(this.pos, otherBall.pos),
        radMagSq = Math.pow(VectorUtils.magnitudeOf(locDiff1),2),
        velDiff2 = VectorUtils.negativeOf(velDiff1),
        locDiff2 = VectorUtils.negativeOf(locDiff1),
        coef = VectorUtils.dotProduct(velDiff1,locDiff1) / radMagSq;

    this.vel = VectorUtils.vectorDiff(this.vel, VectorUtils.scale(coef, locDiff1));
    otherBall.vel = VectorUtils.vectorDiff(otherBall.vel, VectorUtils.scale(coef, locDiff2));
  },

  ensurePointCollision: function(ballArray) {
    ballArray.forEach(function(otherBall) {
      if (this.collidedWithBall(otherBall)) {
        var distance = VectorUtils.distance(this.pos, otherBall.pos),
        scaledToRad = VectorUtils.scale(this.radius / distance, VectorUtils.radialOf(this.pos, otherBall.pos));

        this.pos = VectorUtils.vectorSum(this.pos,VectorUtils.negativeOf(scaledToRad));
        otherBall.pos = VectorUtils.vectorSum(otherBall.pos,scaledToRad);
      }
    }.bind(this));
  }
};

module.exports = Collidable;
