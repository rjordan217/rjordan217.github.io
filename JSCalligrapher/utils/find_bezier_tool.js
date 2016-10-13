var diffVector = require('./vector_utils').diffVector;

var FindBezierTool = function(ctx) {
  this.ctx = ctx;
  this.controlPoints = [[16,16],[46,16],[76, 16],[106,16]];
  this.clickedPoint = null;
};

FindBezierTool.prototype.drawControlPoints = function () {
  var ctx = this.ctx;
  for (var i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.arc(
      this.controlPoints[i][0],
      this.controlPoints[i][1],
      5,
      0,
      2 * Math.PI,
      false
    );
    ctx.fill();
  }
};

FindBezierTool.prototype.drawBezier = function () {
  var ctx = this.ctx;

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
  this.ctx.font = "20px Palatino";
  var relPointsToLog = [];
  var startPoint = this.controlPoints[0];
  this.controlPoints.forEach(function(ctrlPt, idx) {
    var relPoint = diffVector(startPoint, ctrlPt);
    relPointsToLog.push(relPoint);
    this.ctx.fillText(
      "Control Point " + idx + ": " + relPoint.toString() + "\n",
      800,
      600 + 25 * idx
    );
  }.bind(this));
  console.log("Control Points: " + relPointsToLog);
  return relPointsToLog;
};

module.exports = FindBezierTool;
