var Patterns = require('./patterns'),
    Player = require('./player'),
    Hole = require('./hole'),
    Ball = require('./ball'),
    Cuestick = require('./cuestick');

TOP_LEFT = [DIM_X / 2 - REL_DIM, (DIM_Y - REL_DIM) / 2];
BOTTOM_RIGHT = [DIM_X / 2 + REL_DIM, (DIM_Y + REL_DIM) / 2];
BALL_RADIUS = REL_DIM * .04222;

var BallConstants = require('./ball_constants').NineBall;

var Game = function(ctx) {
  this.ctx = ctx;
  this.ctx.font = "" + (2 * BALL_RADIUS / 3) + "px Arial";

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

  this.players = [ new Player(1,"Fred",this), new Player(2,"George",this) ];
  this.currentPlayer = 0;

  this.patterns = new Patterns(ctx,this.startTurn.bind(this));

  this.cuestick = new Cuestick(this.cueball);
  this.cuestick.bindKeys(this.drawTable.bind(this), this.runTurn.bind(this));
  this.startTurn();
};

Game.prototype.startTurn = function () {
  this.cuestick.updateCueball(this.cueball);
  this.drawTable();
};

Game.prototype.runTurn = function () {
  var anyAreMobile = 1;
  var self = this;
  var samePlayer = this.currentPlayer;
  var drawTable = this.drawTable.bind(this);
  var toClear;
  function callback() {
    cancelAnimationFrame(toClear);
    self.currentPlayer = (self.currentPlayer + 1) % 2;
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
      var playsAgain = true;
      sunkArray.forEach(function(ballObj) {
        if(ballObj.index === 0) {
          self.cueball.pos = [ DIM_X / 2 + REL_DIM / 2, DIM_Y / 2 ];
          self.cueball.isSunk = false;
          self.currentPlayer = (self.currentPlayer + 1) % 2;
          playsAgain = false;
        } else {
          self.ballArray.splice(ballObj.index - offset, 1);
          self.sunkBalls.push(ballObj.ball);
          self.players[samePlayer].sinkBall(ballObj.ball);
          if(playsAgain) self.currentPlayer = samePlayer;
          offset++;
        }
      });
      self.updateNextTarget();
      toClear = requestAnimationFrame(function() {
        drawTable();
        callback();
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

Game.prototype.updateNextTarget = function () {
  this.players[0].updateNextBall(this.ballArray[1].number);
  this.players[1].updateNextBall(this.ballArray[1].number);
  console.log(this.ballArray[1].number);
};

Game.prototype.gameOver = function () {
  console.log(this.players[this.currentPlayer].nickname + " lost!");
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

module.exports = Game;