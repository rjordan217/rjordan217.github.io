var FindBezierTool = require('./find_bezier_tool'),
    diffVector = require('./vector_utils').diffVector,
    distance = require('./vector_utils').distance;

var MultipleBeziers = function(ctx) {
  this.ctx = ctx;
  this.beziers = [];
  this.currentIdx = 0;
};

MultipleBeziers.prototype.draw = function () {
  this.ctx.clearRect(0,0,1200,800);
  this.beziers.forEach(function(bezier){bezier.draw()});
};

MultipleBeziers.prototype.switchCurrent = function (newIdx) {
  this.beziers[this.currentIdx].deselect();
  this.currentIdx = newIdx;
  this.beziers[newIdx].select();
};

MultipleBeziers.prototype.addBezier = function () {
  this.beziers.push(new FindBezierTool(this.ctx));
  this.switchCurrent(this.beziers.length - 1);
  this.draw();
};

MultipleBeziers.prototype.bindMouse = function (el) {
  var self = this;
  function down(e) {
    var beziers = self.beziers,
        currIdx = self.currentIdx;
    if(beziers.length) {
      beziers[currIdx].clickedPoint = beziers[currIdx].detectClickRegion(e)
      if(beziers[currIdx].clickedPoint == null) {
        for(var idx = beziers.length - 1; idx >= 0; idx -= 1) {
          if(idx !== currIdx) {
            beziers[idx].clickedPoint = beziers[idx].detectClickRegion(e);
            if(beziers[idx].clickedPoint !== null) {
              self.switchCurrent(idx);
              break;
            }
          }
        }
      }
    }
    self.draw();
  }
  function move(e) {
    if(self.beziers[self.currentIdx]) self.beziers[self.currentIdx].moveWithMouse(e);
    self.draw();
  }
  function up(e) {
    self.beziers.forEach(function(bezier) {
      bezier.clickedPoint = null;
    });
  }
  if(window.isMobile) {
    el.addEventListener("touchstart", function(e){down(e.targetTouches[0])});
    el.addEventListener("touchmove", function(e){move(e.targetTouches[0])});
    el.addEventListener("touchend", function(e){up(e.targetTouches[0])});
  } else {
    el.addEventListener("mousedown", down);
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseup", up);
  }
};

MultipleBeziers.prototype.outputFullInstructions = function () {
  var instructions = [];

  for(var i = 0; i < this.beziers.length; i++) {
    var currentInstruction = {};
    currentInstruction['ctrlPts'] = this.beziers[i].printRelativeControlPoints();
    if(i < this.beziers.length - 1 &&
      distance(this.beziers[i].last(), this.beziers[i + 1].first()) > 5) {
      currentInstruction['offsetAfter'] = diffVector(
        this.beziers[i].last(),
        this.beziers[i + 1].first()
      );
    }
    instructions.push(currentInstruction);
  }
  return instructions;
};

MultipleBeziers.prototype.resetBeziers = function () {
  this.beziers.forEach(function(bezier) {
    bezier.ctx = null;
    bezier.controlPoints = null;
  });
  this.beziers = [];
  this.currentIdx = 0;
  this.draw();
};

module.exports = MultipleBeziers;
