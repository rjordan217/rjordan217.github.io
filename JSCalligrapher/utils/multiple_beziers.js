var FindBezierTool = require('./find_bezier_tool');

var MultipleBeziers = function(ctx) {
  this.ctx = ctx;
  this.beziers = [];
};

MultipleBeziers.prototype.addBezier = function () {
  this.beziers.push(new FindBezierTool(this.ctx));
};

MultipleBeziers.prototype.draw = function () {
  this.ctx.clearRect(0,0,1200,800);
  this.beziers.forEach(function(bezier){bezier.draw()});
};

MultipleBeziers.prototype.bindMouse = function (el) {
  el.addEventListener("mousedown", function(e) {
    this.beziers.forEach(function(bezier) {
      bezier.clickedPoint = bezier.detectClickRegion(e);
    });
  }.bind(this));
  el.addEventListener("mousemove", function(e) {
    this.beziers.forEach(function(bezier) {
      bezier.moveWithMouse(e);
    });
    this.draw();
  }.bind(this));
  el.addEventListener("mouseup", function(e) {
    this.beziers.forEach(function(bezier) {
      bezier.clickedPoint = null;
      bezier.printRelativeControlPoints();
    });
  }.bind(this));
};

MultipleBeziers.prototype.outputFullInstructions = function () {
  var instructions = [];

  for(var i = 0; i < this.beziers.length; i++) {
    var currentInstruction = {};
    currentInstruction['ctrlPts'] = this.beziers[i].printRelativeControlPoints();
    // currentInstruction['offsetAfter'] = this.beziers[i].offsetAfter;
    // currentInstruction['offsetBefore'] = this.beziers[i].offsetBefore;
    instructions.push(currentInstruction);
  }
  return instructions;
};

module.exports = MultipleBeziers;
