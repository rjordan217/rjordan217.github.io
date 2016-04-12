var Utils = require("./utils");
var MovingObject = require("./movingObject");
var Game = require("./game");

var Asteroid = function(pos, game) {
  var hash = {'pos': pos};
  hash['color'] = Asteroid.COLOR;
  hash['radius'] = Asteroid.RADIUS;
  hash['vel'] = Utils.randomVec(Asteroid.MAX_VEL * Math.random());
  hash['game'] = game;
  MovingObject.call(this, hash);
};

Utils.inherits(MovingObject, Asteroid);

// Asteroid.thumbnail = new Image(); TODO: sprites
// Asteroid.thumbnail.src = '../resources/puffy_edit.jpg';

Asteroid.prototype.draw = function(ctx){
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
};

Asteroid.COLOR = "#222222";
Asteroid.RADIUS = 20;
Asteroid.MAX_VEL = 10;


module.exports = Asteroid;
