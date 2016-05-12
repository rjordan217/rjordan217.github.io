var Cuestick = function(cueball) {
  this.centeredOn = cueball.pos;
  this.cueball = cueball;
  this.angle = 0;
  this.drawn = 0;
};

Cuestick.prototype.rotate = function (direction) {
  this.angle += direction * Math.PI / 90;
};

Cuestick.prototype.drawBack = function (direction) {
  if(this.drawn <= 0 && direction === -1) {
    this.drawn = 0;
  } else {
    this.drawn += 4 * direction;
  }
};

Cuestick.prototype.impartMomentum = function (power) {
  this.cueball.vel = [ - power / 40 * Math.cos(this.angle), - power / 40 * Math.sin(this.angle) ];
};

Cuestick.prototype.fire = function(renderCB, turnCallback) {
  var self = this;
  var originalDrawn = this.drawn;

  function _fire(callback) {
    if(self.drawn > -30) {
      self.drawn -= 10;
      callback();
      _fire(callback);
    } else {
      self.impartMomentum(originalDrawn);
      self.drawn = -50;
      turnCallback();
    }
  }
  _fire(renderCB);
};

Cuestick.prototype.keyBinder = function (renderCB, turnCB, e) {
  e.preventDefault();
  switch (e.keyCode) {
    case 40:
      this.drawBack(1);
      renderCB();
      break;
    case 38:
      this.drawBack(-1);
      renderCB();
      break;
    case 37:
      this.rotate(1);
      renderCB();
      break;
    case 39:
      this.rotate(-1);
      renderCB();
      break;
    case 32:
      this.fire(renderCB, turnCB);
      break;
  }
  console.log("Listening");
};

Cuestick.prototype.bindKeys = function (renderCB, turnCB) {
  this.toRemove = function(e) {
    this.keyBinder(renderCB, turnCB, e);
  }.bind(this);
  document.addEventListener("keydown", this.toRemove, false);
};

Cuestick.prototype.unbindKeys = function (renderCB, turnCB) {
  document.removeEventListener("keydown", this.toRemove, false);
};

Cuestick.prototype.draw = function (ctx) {
  ctx.translate(this.centeredOn[0], this.centeredOn[1]);
  ctx.rotate(this.angle);
  ctx.fillStyle = '#ffca66';
  ctx.fillRect(50 + this.drawn, -5, REL_DIM * 1.5, 10);
  ctx.rotate(-this.angle);
  ctx.translate(-this.centeredOn[0], -this.centeredOn[1]);
};

module.exports = Cuestick;
