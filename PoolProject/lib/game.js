var Patterns = require('./patterns'),
    Player = require('./player'),
    Hole = require('./hole'),
    Ball = require('./ball'),
    Cuestick = require('./cuestick');

TOP_LEFT = [DIM_X / 2 - REL_DIM, (DIM_Y - REL_DIM) / 2];
BOTTOM_RIGHT = [DIM_X / 2 + REL_DIM, (DIM_Y + REL_DIM) / 2];
BALL_RADIUS = REL_DIM * .04222;

var BallConstants = require('./ball_constants').NineBall;

var Game = function(ctx, scoreCB, gameLostCB, gameOverCB) {
  this.ctx = ctx;
  this.ctx.font = "" + (2 * BALL_RADIUS / 3) + "px Arial";
  this.scoreCB = scoreCB;
  this.gameLostCB = gameLostCB;
  this.gameOverCB = gameOverCB;

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
  this.currentPlayer = 0;

  this.patterns = new Patterns(ctx,this.drawTable.bind(this));

  this.cuestick = new Cuestick(this.cueball);
};

Game.prototype.addPlayers = function (playerNames) {
  this.players = [];
  var playerNumber = 1;
  playerNames.forEach(function(name) {
    this.players.push(new Player(playerNumber, name, this));
    playerNumber++;
  }.bind(this));
};

Game.prototype.startGame = function () {
  this.cuestick.bindKeys(this.drawTable.bind(this), this.runTurn.bind(this));
  this.updateScore();
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
        self.updateScore();
        self.updateNextTarget();
      });
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
};

Game.prototype.updateScore = function () {
  this.scoreCB(this.players[0].points, this.players[1].points);
};

Game.prototype.calculateWinner = function () {
  var currentsPoints = this.players[this.currentPlayer].points,
      otherPlayerIdx = (this.currentPlayer + 1) % 2,
      othersPoints = this.players[otherPlayerIdx].points;

  return (currentsPoints >= othersPoints ? this.currentPlayer : otherPlayerIdx);
};

Game.prototype.gameOver = function () {
  this.cuestick.disabled = true;
  this.gameOverCB(this.calculateWinner());
};

Game.prototype.gameLost = function () {
  this.gameLostCB(this.currentPlayer);
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
