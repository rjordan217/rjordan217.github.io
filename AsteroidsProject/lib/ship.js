var Utils = require("./utils");
var MovingObject = require("./movingObject");
var Bullet = require("./bullet");
// var Game = require("./game");

var Ship = function(pos, game) {
  var hash = {'pos': pos};
  hash['color'] = Ship.COLOR;
  hash['radius'] = Ship.RADIUS;
  hash['vel'] = [0, 0];
  hash['game'] = game;
  MovingObject.call(this, hash);
};

Utils.inherits(MovingObject, Ship);

Ship.prototype.relocate = function(){
  this.pos = this.game.randomPosition();
  this.vel = [0, 0];
};

Ship.prototype.power = function(impulse){
  this.vel[0] += impulse[0];
  this.vel[1] += impulse[1];
};

Ship.prototype.fireBullet = function() {
  var bullet = new Bullet(this.pos, this.vel, this.game);
};

Ship.COLOR = "#00FF00";
Ship.RADIUS = 5;
Ship.MAX_VEL = 10;


module.exports = Ship;
