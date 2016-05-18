var Utils = require('./utils'),
    Collidable = require('./collidable'),
    VectorUtils = require('./vector_utils'),
    Accelerable = require('./accelerable');

var Ball = function(options) {
  this.number = options.number;
  this.isSunk = false;
  this.pos = options.pos;
  this.color = options.color;
  this.radius = BALL_RADIUS;
  this.vel = [0, 0];
  this.collidedWith = [];
  this.textOffset = BALL_RADIUS / 3;
};

Utils.implementsModule(Ball, Collidable);
Utils.implementsModule(Ball, Accelerable);

Ball.prototype.runCourse = function (ballArray, holeArray) {
  if (Math.abs(this.vel[0]) > 0 || Math.abs(this.vel[1]) > 0) {
    this.move();
    if(this.collidedWithXWall()) {
      this.changeXDir();
    }
    if(this.collidedWithYWall()) {
      this.changeYDir();
    }
    ballArray.forEach(function(otherBall) {
      if(this.collidedWithBall(otherBall) && !otherBall.collidedWith.includes(this)) {
        this.collidedWith.push(otherBall);
        this.exchangeMomentum(otherBall);
      }
    }.bind(this));
    holeArray.forEach(function(hole) {
      if(this.isInHole(hole)) {
        this.sink(hole);
      }
    }.bind(this));
    this.friction();

    return true;
  } else {
    return false;
  }
};

Ball.prototype.resetCollidedWith = function () {
  this.collidedWith = [];
};

Ball.prototype.sink = function (hole) {
  var distancia = VectorUtils.distance(this.pos,hole.pos);
  this.isSunk = true;
  this.vel = [0,0];
};


Ball.prototype.draw = function (ctx) {
  ctx.fillStyle = this.color;
  ctx.beginPath();

  ctx.arc(
    this.pos[0],
    this.pos[1],
    this.radius,
    0,
    2 * Math.PI,
    false
  );

  ctx.fill();

  if(this.number) {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();

    ctx.arc(
      this.pos[0],
      this.pos[1],
      this.radius / 2,
      0,
      2 * Math.PI,
      false
    );

    ctx.fill();

    ctx.fillStyle = "#000000";
    ctx.fillText(
      this.number,
      this.pos[0] - 3.5,
      this.pos[1] + 4.5
    );

    if(this.number > 8) {
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();

      ctx.arc(
        this.pos[0],
        this.pos[1],
        this.radius,
        -Math.PI / 3,
        Math.PI / 3,
        false
      );
      ctx.fill();

      ctx.beginPath();
      ctx.arc(
        this.pos[0],
        this.pos[1],
        this.radius,
        2 * Math.PI / 3,
        4 * Math.PI / 3,
        false
      );

      ctx.fill();
    }
  }

};

module.exports = Ball;
