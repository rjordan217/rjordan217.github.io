var Utils = require("./utils");
var MovingObject = require("./movingObject");
var Game = require("./game");

var Bullet = function(pos, vel, game) {
  var hash = {
    'pos': [pos[0],pos[1]],
    'game': game
  };
  if (vel[0] === 0 && vel[1] === 0) {
    hash['vel'] = Utils.randomVec(1.2);
  } else {
    hash['vel'] = [vel[0] * 1.2,vel[1] * 1.2];
  }
  hash['color'] = Bullet.COLOR;
  hash['radius'] = Bullet.RADIUS;
  MovingObject.call(this, hash);
  game.add(this);
};

Utils.inherits(MovingObject, Bullet);

Bullet.prototype.move = function() {
  var x = this.pos[0];
  var y = this.pos[1];
  var delX = this.vel[0];
  var delY = this.vel[1];
  this.pos[0] = x + delX;
  this.pos[1] = y + delY;
};

Bullet.COLOR = "#FF0000";
Bullet.RADIUS = 5;



module.exports = Bullet;
