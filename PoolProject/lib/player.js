var Player = function(id, nickname, game) {
  this.id = id;
  this.nickname = nickname || "Player " + id;
  this.nextBallNumber = 1;
  this.points = 0;
  this.game = game;
};

Player.prototype.sinkBall = function (ball, gameOverCB) {
  if(ball.number === this.nextBallNumber) {
    this.points++;
    if(ball.number === 9) this.game.gameOver();
  } else if (ball.number === 9) {
    this.points = 0;
    this.game.gameLost();
  }
};

Player.prototype.updateNextBall = function (nextNumber) {
  this.nextBallNumber = nextNumber;
};

module.exports = Player;
