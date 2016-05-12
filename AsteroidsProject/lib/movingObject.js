var MovingObject = function(hash){
  this.pos = hash['pos'];
  this.vel = hash['vel'];
  this.radius = hash['radius'];
  this.color = hash['color'];
  this.game = hash['game'];
};

MovingObject.prototype.draw = function(ctx){
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

MovingObject.prototype.move = function(){
  var x = this.pos[0];
  var y = this.pos[1];
  var delX = this.vel[0];
  var delY = this.vel[1];
  this.pos[0] = x + delX;
  this.pos[1] = y + delY;
  var wrapped = this.game.wrap(this.pos);

  this.pos[0] = ((this.pos[0] > this.game.constructor.DIM_X ||
    this.pos[0] < 0) ? wrapped[0] : this.pos[0]);
  this.pos[1] = ((this.pos[1] > this.game.constructor.DIM_Y ||
    this.pos[1] < 0) ? wrapped[1] : this.pos[1]);
};

MovingObject.prototype.isCollidedWith = function(otherObject){
  var myRadius = this.radius;
  var theirRadius = otherObject.radius;
  var distance = function(pos1, pos2){
    var x1 = pos1[0];
    var x2 = pos2[0];
    var y1 = pos1[1];
    var y2 = pos2[1];

    return Math.sqrt((x2 - x1)*(x2-x1) + (y2 - y1)*(y2-y1));
  };
  return (distance(this.pos, otherObject.pos) <= myRadius + theirRadius);
};

module.exports = MovingObject;
