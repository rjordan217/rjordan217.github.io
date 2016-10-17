var addVectors = require('../utils/vector_utils').addVectors;

var Brush = function(ctx, startPos, baseline, brushSize) {
  this.ctx = ctx;
  this.startPos = startPos;
  this.currentPos = startPos.slice();
  this.baseline = baseline;
  this.brushSize = brushSize || [25, 1];
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

Brush.prototype.cgStrokePath = function (pathFun, startOfStroke, isSpace) {
  if(this.time <= 1) {
    if (!isSpace) this.cgStroke();
    var del = pathFun(this.time);
    this.currentPos = addVectors([startOfStroke, del[0]]);
    this.time = del[1];
  } else {
    this.time = 0;
    return true;
  }
};


Brush.prototype.cgStart = function(funcsToDraw) {
  function processOffsets(funcWithOffsets) {
    if(funcWithOffsets[0] instanceof Function) {
      funcWithOffsets.unshift([0,0]);
    }
    if(funcWithOffsets.length < 3) {
      funcWithOffsets.push([0,0]);
    }
    return funcWithOffsets;
  }

  var self = this;

  function drawAndCallNext() {
    if(funcsToDraw.length > 0) {
      var funcAndOffsets = processOffsets(funcsToDraw.shift());

      var offsetBefore = funcAndOffsets.shift(),
          currentFunc = funcAndOffsets.shift(),
          offsetAfter = funcAndOffsets.shift();

      self.currentPos = addVectors([self.currentPos, offsetBefore]);
      var originalPos = self.currentPos;
      var isSpace = (currentFunc.name === "space");

      self.strokeInterval = setInterval(function() {
        if(self.cgStrokePath(currentFunc, originalPos, isSpace) && self.strokeInterval) {
          clearInterval(self.strokeInterval);
          offsetAfter = offsetAfter || [0,0];
          self.currentPos = addVectors([self.currentPos, offsetAfter]);
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
