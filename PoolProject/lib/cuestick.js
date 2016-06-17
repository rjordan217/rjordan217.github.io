var VectorUtils = require('./vector_utils');

var Cuestick = function(cueball) {
  this.centeredOn = cueball.pos.slice();
  this.cueball = cueball;
  this.angle = 0;
  this.drawn = 0;
  this.disabled = false;
  this.isClicked = false;
};

Cuestick.prototype.rotate = function (direction) {
  this.angle += direction * Math.PI / 90;
};

Cuestick.prototype.drawBack = function (direction) {
  if(this.drawn <= 0 && direction === -1) {
    this.drawn = 0;
  } else if (this.drawn <= 150) {
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
    if(self.drawn > -BALL_RADIUS) {
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

Cuestick.prototype.clickedBinder = function (renderCB, e) {
  e.preventDefault();
  if(!this.disabled) {
    this.isClicked = true;
  }
};

Cuestick.prototype.unclickedBinder = function (renderCB, turnCB, e) {
  e.preventDefault();
  if (!this.disabled && this.isClicked) this.fire(renderCB, turnCB);
  this.isClicked = false;
};

Cuestick.prototype.hoverBinder = function (renderCB, e) {
  if(!this.disabled) {
    var mousePos = GET_MOUSE_POS(e);
    var radial = VectorUtils.radialOf(this.centeredOn, mousePos);
    this.angle = VectorUtils.directionOf(radial);
    if (this.isClicked) {
      var drawAmt = VectorUtils.magnitudeOf(radial) / 2;
      if (drawAmt < 150) {
        this.drawn = drawAmt;
      } else {
        this.drawn = 150;
      }
    }
    renderCB();
  }
};

Cuestick.prototype.bindKeys = function (renderCB, turnCB) {

  this.mousedownListener = this.clickedBinder.bind(this, renderCB);
  document.addEventListener(
    "mousedown",
    this.mousedownListener,
    true
  );

  this.mouseupListener = this.unclickedBinder.bind(this, renderCB, turnCB);
  document.addEventListener(
    "mouseup",
    this.mouseupListener,
    true
  );

  this.mousemoveListener = this.hoverBinder.bind(this, renderCB);
  document.addEventListener(
    "mousemove",
    this.mousemoveListener,
    true
  );
};

Cuestick.prototype.unbindKeys = function () {
  document.removeEventListener("mousedown", this.mousedownListener, true);
  document.removeEventListener("mouseup", this.mouseupListener, true);
  document.removeEventListener("mousemove", this.mousemoveListener, true);
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
