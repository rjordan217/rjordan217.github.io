var Asteroid = require("./asteroid");
var Ship = require("./ship");
var Bullet = require("./bullet");


var Game = function(){
  this.asteroids = [];
  this.bullets = [];
  this.ship = new Ship(this.randomPosition(), this);
  this.allObjects = [this.ship];
};

Game.DIM_X = 800;
Game.DIM_Y = 400;
Game.NUM_ASTEROIDS = 4;

Game.prototype.addAsteroids = function(){
  for(var i = 0; i < Game.NUM_ASTEROIDS; i++){
    var newAsteroid = new Asteroid(this.randomPosition(), this);
    this.asteroids.push(newAsteroid);
    this.allObjects.push(newAsteroid);
  }
};

Game.prototype.add = function(object) {
  if (object instanceof Asteroid){
    this.asteroids.push(object);
  } else if(object instanceof Bullet){
    this.bullets.push(object);
  }
  this.allObjects.push(object);
};

// Game.prototype.obliterate = function(object){
//   if (object instanceof Asteroid){
//     this.asteroids.push(object);
//   } else if(object instanceof Bullet){
//     this.bullets.push(object);
//   }
//   this.allObjects.push(object);
// };

Game.prototype.randomPosition = function(){
  var X = Math.random() * Game.DIM_X;
  var Y = Math.random() * Game.DIM_Y;
  return [X, Y];

};

Game.prototype.draw = function(ctx, background){
  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  ctx.drawImage(background, 0, 0);
  this.allObjects.forEach(function(object){
    object.draw(ctx);
  });
};

Game.prototype.moveObjects = function(){
  this.allObjects.forEach(function(object){
    object.move();
  });
};

Game.prototype.wrap = function(pos){
  var X;
  var Y;
  if (pos[0] < 0) {
    X = Game.DIM_X + pos[0];
  } else {
    X = -Game.DIM_X + pos[0];
  }

  if (pos[1] < 0) {
    Y = Game.DIM_Y + pos[1];
  } else {
    Y = -Game.DIM_Y + pos[1];
  }

  return [X, Y];
};

Game.prototype.checkCollisions = function(){
  var thisGame = this;
  thisGame.asteroids.forEach(function(asteroid){
    if(asteroid.isCollidedWith(thisGame.ship)){
      thisGame.ship.relocate();
    }
  });
};

Game.prototype.step = function() {
  this.moveObjects();
  this.checkCollisions();
};

Game.prototype.remove = function(idx) {
  this.allObjects.splice(idx,1);
};

module.exports = Game;
