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

Asteroid.COLOR = "#222222";
Asteroid.RADIUS = 20;
Asteroid.MAX_VEL = 10;


module.exports = Asteroid;
