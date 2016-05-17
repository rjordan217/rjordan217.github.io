var Player = function(id, nickname, game) {
  this.id = id;
  this.nickname = nickname || "Player " + id;
  this.nextBallNumber = 1;
  this.points = 0;
  this.game = game;
};

Player.prototype.sinkBall = function (ball, gameOverCB) {
  if(ball.number === this.nextBall) {
    this.points++;
    if(ball.number === 9) this.game.gameWon();
  } else if (ball.number === 9) {
    this.game.gameOver();
  }
};

Player.prototype.updateNextBall = function (nextNumber) {
  this.nextBallNumber = nextNumber;
};

Player.prototype.gameLost = function (gameOverCB) {
  this.points = 0;
  gameOverCB();
};

module.exports = Player;
