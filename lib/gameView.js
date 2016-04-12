var Game = require("./game");
var key = require("../keymaster-master/keymaster");

var GameView = function(canvasEl) {
  this.ctx = canvasEl.getContext("2d");
  this.game = new Game();
  this.game.addAsteroids();
  this.background = new Image();
  this.background.onload = function () {
    this.ctx.drawImage(this.background, 0, 0);
  }.bind(this);
  this.background.src = './lava.jpg';
};

GameView.prototype.start = function(){
  setInterval(function() {
    this.game.step();
    this.game.draw(this.ctx, this.background);
  }.bind(this),20);
};

GameView.prototype.bindKeyHandlers = function(){
  key('w', function(){ this.ship.power([0,-1]); }.bind(this.game));
  key('a', function(){ this.ship.power([-1,0]); }.bind(this.game));
  key('s', function(){ this.ship.power([0,1]); }.bind(this.game));
  key('d', function(){ this.ship.power([1,0]); }.bind(this.game));
  key('space', function(){ this.ship.fireBullet(); }.bind(this.game));
};

module.exports = GameView;
