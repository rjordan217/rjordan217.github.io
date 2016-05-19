var VectorUtils = require('./vector_utils');

var Cuestick = function(cueball) {
  this.centeredOn = cueball.pos.slice();
  this.cueball = cueball;
  this.angle = 0;
  this.drawn = 0;
  this.disabled = false;
};

Cuestick.prototype.rotate = function (direction) {
  this.angle += direction * Math.PI / 90;
};

Cuestick.prototype.drawBack = function (direction) {
  if(this.drawn <= 0 && direction === -1) {
    this.drawn = 0;
  } else if (this.drawn <= 100) {
    this.drawn += 1 * direction;
  }
};

Cuestick.prototype.impartMomentum = function (power) {
  this.cueball.vel = [ - power / 10 * Math.cos(this.angle), - power / 10 * Math.sin(this.angle) ];
};

Cuestick.prototype.fire = function(renderCB, turnCallback) {
  var self = this;
  var originalDrawn = this.drawn;
  this.disabled = true;

  function _fire(callback) {
    if(self.drawn > BALL_RADIUS) {
      self.drawn -= 10;
      callback();
      _fire(callback);
    } else {
      self.impartMomentum(originalDrawn);
      self.resetDrawn();
      turnCallback();
    }
  }
  _fire(renderCB);
};

Cuestick.prototype.resetDrawn = function () {
  this.drawn = 0;
};

Cuestick.prototype.keyBinder = function (renderCB, turnCB, e) {
  e.preventDefault();
  if(!this.disabled) {
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
  }
};

Cuestick.prototype.clickedBinder = function (renderCB, e) {
  e.preventDefault();
  this.clickedFunc = setInterval(function() {
    this.drawBack(1);
    renderCB();
  }.bind(this),25)
};

Cuestick.prototype.unclickedBinder = function (e) {
  e.preventDefault();
  clearInterval(this.clickedFunc);
};

Cuestick.prototype.doubleClickBinder = function (renderCB, e) {
  e.preventDefault();
  this.resetDrawn();
  renderCB();
};

Cuestick.prototype.hoverBinder = function (renderCB, e) {
  var mousePos = GET_MOUSE_POS(e);
  var radial = VectorUtils.radialOf(this.centeredOn, mousePos);
  this.angle = VectorUtils.directionOf(radial);
  renderCB();
};

Cuestick.prototype.bindKeys = function (renderCB, turnCB) {
  document.addEventListener(
    "keydown",
    this.keyBinder.bind(this,renderCB,turnCB),
    false
  );
  document.addEventListener(
    "mousedown",
    this.clickedBinder.bind(this, renderCB),
    false
  );
  document.addEventListener(
    "mouseup",
    this.unclickedBinder.bind(this),
    false
  );
  document.addEventListener(
    "mousemove",
    this.hoverBinder.bind(this, renderCB),
    false
  );
  document.addEventListener(
    "dblclick",
    this.doubleClickBinder.bind(this, renderCB),
    false
  );
};

Cuestick.prototype.updateCueball = function (newCueball) {
  this.centeredOn = newCueball.pos.slice();
  this.cueball = newCueball;
  this.drawn = 0;
  this.disabled = false;
};

Cuestick.prototype.draw = function (ctx) {
  ctx.translate(this.centeredOn[0], this.centeredOn[1]);
  ctx.rotate(this.angle);
  ctx.fillStyle = '#ffca66';
  ctx.fillRect(50 + this.drawn, -5, REL_DIM * 1.5, 10);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(50 + this.drawn, -5, 25, 10);
  ctx.fillStyle = '#ff00ff';
  ctx.fillRect(50 + this.drawn, -5, 5, 10);
  ctx.rotate(-this.angle);
  ctx.translate(-this.centeredOn[0], -this.centeredOn[1]);
};

module.exports = Cuestick;
