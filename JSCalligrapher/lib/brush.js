var addVectors = require('../utils/vector_utils').addVectors;

var Brush = function(ctx, startPos, baseline, brushSize) {
  this.ctx = ctx;
  this.startPos = startPos;
  this.currentPos = startPos.slice();
  this.baseline = baseline;
  this.brushSize = brushSize || [30, 1];
  this.time = 0;
}

Brush.prototype.cgStroke = function () {
  var ctx = this.ctx;

  ctx.translate(this.currentPos[0],this.currentPos[1]);
  ctx.rotate(- Math.PI / 4);

  ctx.fillRect(0, 0, this.brushSize[0], this.brushSize[1]);

  ctx.rotate(Math.PI / 4);
  ctx.translate(-this.currentPos[0], -this.currentPos[1]);
};

Brush.prototype.cgStrokeDown = function (toOffset) {
  toOffset = toOffset || 0;
  if (this.currentPos[1] <= this.baseline + toOffset) {
    this.cgStroke();
    this.currentPos[1] += 1;
  } else {
    return true;
  }
};

Brush.prototype.cgStrokePath = function (pathFun, startOfStroke) {
  if(this.time <= 1) {
    this.cgStroke();
    var del = pathFun(this.time);
    this.currentPos = addVectors([startOfStroke, del[0]]);
    this.time = del[1];
  } else {
    this.time = 0;
    return true;
  }
};

Brush.prototype.cgStart = function(funcsToDraw) {
  var self = this;
  function drawAndCallNext() {
    if(funcsToDraw.length > 0) {
      var originalPos = self.currentPos;
      var currentFunc = funcsToDraw.shift();
      self.strokeInterval = setInterval(function() {
        if(self.cgStrokePath(currentFunc, originalPos) && self.strokeInterval) {
          clearInterval(self.strokeInterval);
          drawAndCallNext();
        }
      }, 1);
    }
  }
  drawAndCallNext();
};

Brush.prototype.cgStop = function() {
  clearInterval(this.strokeInterval);
};

module.exports = Brush;
