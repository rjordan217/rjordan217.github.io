var diffVector = require('./vector_utils').diffVector;

var FindBezierTool = function(ctx) {
  this.ctx = ctx;
  if(window.isMobile) {
    this.controlPoints = [[26,26],[116,26],[206,26],[296,26]];
    this.cptsRad = 15;
  } else {
    this.controlPoints = [[16,16],[46,16],[76, 16],[106,16]];
    this.cptsRad = 5;
  }
  this.clickedPoint = null;
  this.offsetBeforePoint = null;
  this.offsetAfterPoint = null;
  this.color = 'black';
};

FindBezierTool.prototype.select = function () {
  this.color = '#1969c0'
};

FindBezierTool.prototype.deselect = function () {
  this.color = 'black';
};

FindBezierTool.prototype.first = function () {
  return this.controlPoints[0];
};

FindBezierTool.prototype.last = function () {
  return this.controlPoints[3];
};

FindBezierTool.prototype.drawControlPoints = function () {
  var ctx = this.ctx;
  ctx.fillStyle = this.color;
  ctx.strokeStyle = 'black';
  for (var i = 0; i < 4; i++) {
    ctx.fillStyle = (this.clickedPoint == i ? '#8a2b2b' : this.color);
    ctx.beginPath();
    ctx.arc(
      this.controlPoints[i][0],
      this.controlPoints[i][1],
      this.cptsRad,
      0,
      2 * Math.PI,
      false
    );
    ctx.fill();
    ctx.stroke();
  }
};

FindBezierTool.prototype.drawBezier = function () {
  var ctx = this.ctx,
      preDrawWidth = ctx.lineWidth;
  if(window.isMobile) ctx.lineWidth = 3;
  ctx.strokeStyle = this.color;
  ctx.beginPath();
  var ctrlPts = this.controlPoints;
  ctx.moveTo(ctrlPts[0][0], ctrlPts[0][1]);
  ctx.bezierCurveTo(
    ctrlPts[1][0],
    ctrlPts[1][1],
    ctrlPts[2][0],
    ctrlPts[2][1],
    ctrlPts[3][0],
    ctrlPts[3][1]
  );
  ctx.stroke();
  if(window.isMobile) ctx.lineWidth = preDrawWidth;
};

var dist = function(pos1, pos2) {
  return Math.sqrt(Math.pow(pos2[0] - pos1[0],2) + Math.pow(pos2[1] - pos1[1],2));
};

FindBezierTool.prototype.detectClickRegion = function (e) {
  var checkPos = GET_MOUSE_POS(e);
  for (var i = 0; i < 4; i++) {
    if (dist(checkPos, this.controlPoints[i]) < 5) {
      return i;
    }
  }
  return null;
};

FindBezierTool.prototype.moveWithMouse = function (e) {
  if(this.clickedPoint !== null) {
    var moveTo = GET_MOUSE_POS(e);
    this.controlPoints[this.clickedPoint] = moveTo;
  }
};

FindBezierTool.prototype.draw = function () {
  this.drawControlPoints();
  this.drawBezier();
};

FindBezierTool.prototype.printRelativeControlPoints = function () {
  var startPoint = this.controlPoints[0];
  return this.controlPoints.map(function(ctrlPt, idx) {
    return diffVector(startPoint, ctrlPt);
  }.bind(this));
};

module.exports = FindBezierTool;
