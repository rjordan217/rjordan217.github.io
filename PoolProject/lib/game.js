var Patterns = require('./patterns'),
    Hole = require('./hole'),
    Ball = require('./ball'),
    Cuestick = require('./cuestick');

TOP_LEFT = [DIM_X / 2 - REL_DIM, (DIM_Y - REL_DIM) / 2];
BOTTOM_RIGHT = [DIM_X / 2 + REL_DIM, (DIM_Y + REL_DIM) / 2];
BALL_RADIUS = REL_DIM * .04222;

var BallConstants = require('./ball_constants');

var Game = function(ctx) {
  this.ctx = ctx;

  this.ballArray = [];
  BallConstants.map(function(ballConstant) {
    return {
      color: ballConstant.color.slice(0,ballConstant.color.length),
      number: ballConstant.number,
      pos: ballConstant.pos.slice(0,2)
    };
  }).forEach(function(ball) {
    this.ballArray.push(new Ball(ball));
  }.bind(this));
  this.cueball = this.ballArray[0];

  this.holeArray = [];
  var HOLES = ['ul', 'um', 'ur', 'll', 'lm', 'lr'];
  HOLES.forEach(function(holeId) {
    this.holeArray.push(new Hole(holeId));
  }.bind(this));

  this.sunkBalls = [];

  this.patterns = new Patterns(ctx,this.startTurn.bind(this));
};

Game.prototype.startTurn = function () {
  this.cuestick = new Cuestick(this.cueball);
  this.bindKeyHandlers();
  this.drawTable();
};

Game.prototype.runTurn = function () {
  this.unbindKeys();

  var anyAreMobile = 1;
  var self = this;
  var drawTable = this.drawTable.bind(this);
  var toClear;
  function callback() {
    cancelAnimationFrame(toClear);
    var ballArray = self.ballArray;
    var holeArray = self.holeArray;
    if (anyAreMobile) {
      var sunkArray = [];
      anyAreMobile = 0;
      ballArray.forEach(function(ball,idx) {
        if (ball.runCourse(ballArray,holeArray)) anyAreMobile++;
        if (ball.isSunk) sunkArray.push({index: idx,ball: ball});
      });
      ballArray.forEach(function(ball) {
        ball.resetCollidedWith();
      });
      ballArray.forEach(function(ball) {
        ball.ensurePointCollision(ballArray);
      });
      var offset = 0;
      sunkArray.forEach(function(ballObj) {
        self.ballArray.splice(ballObj.index - offset, 1);
        ballArray = self.ballArray;
        if(ballObj.index === 0) {
          self.cueball = new Ball(
            {number: 0,pos: [ DIM_X / 2 + REL_DIM / 2, DIM_Y / 2 ],color: '#ffffff'}
          );
          self.ballArray.unshift(self.cueball);
        } else {
          self.sunkBalls.push(ballObj.ball);
          offset++;
        }
      });
      toClear = requestAnimationFrame(function() {
        drawTable();
        callback();
        self.cuestick = null;
      });
    } else {
      toClear = requestAnimationFrame(function() {
        drawTable();
        self.startTurn();
      });
    }
  }
  toClear = requestAnimationFrame(callback);
};

Game.prototype.drawTable = function () {
  var ctx = this.ctx;
  ctx.clearRect(0,0,DIM_X,DIM_Y);
  ctx.fillStyle = this.patterns.woodPattern;
  ctx.fillRect(0, 0, DIM_X, DIM_Y);
  ctx.fill();
  ctx.fillStyle = this.patterns.feltPattern;
  ctx.fillRect( TOP_LEFT[0], TOP_LEFT[1], 2 * REL_DIM, REL_DIM );
  ctx.fill();

  this.holeArray.forEach(function(hole) {
    hole.draw(ctx);
  });

  this.ballArray.forEach(function(ball) {
    ball.draw(ctx);
  });

  if(this.cuestick) {
    this.cuestick.draw(ctx);
  }
};

Game.prototype.bindKeyHandlers = function () {
  this.cuestick.bindKeys(this.drawTable.bind(this), this.runTurn.bind(this));
};

Game.prototype.unbindKeys = function () {
  this.cuestick.unbindKeys();
};

module.exports = Game;
