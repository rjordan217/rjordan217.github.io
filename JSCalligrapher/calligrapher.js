var canvasEl = document.getElementById('canvas');
var ctx = canvasEl.getContext('2d');

ctx.fillStyle = 'black';
var startPos = [ 3 * canvasEl.width / 4, canvasEl.height / 4];

var Brush = require('./lib/brush');
var MultipleBeziers = require('./utils/multiple_beziers');

GET_MOUSE_POS = function(e) {
  var rect = canvasEl.getBoundingClientRect();
  return [ e.clientX - rect.left, e.clientY - rect.top ];
};

// var bezierTool = new MultipleBeziers(ctx);
// bezierTool.bindMouse(canvasEl);
//
// var addButton = document.createElement("button");
// addButton.onclick = bezierTool.addBezier.bind(bezierTool);
// addButton.innerHTML = "Add Bezier";
// canvasEl.parentNode.appendChild(addButton);
//
// var BezierPath = require('./utils/bezier_path');
//
// var printFuncButton = document.createElement("button");
// printFuncButton.onclick = function() {
//   bezierTool.beziers.forEach(function(bezier) {
//     console.log(BezierPath(bezier.printRelativeControlPoints()).toString());
//   });;
// };
// printFuncButton.innerHTML = "Print Béziers";
// canvasEl.parentNode.appendChild(printFuncButton);

var brush = new Brush(ctx, startPos, 3 * canvasEl.height / 4);

var Arabic = require('./alphabets/arabic');

var startButton = document.createElement("button"),
    stopButton = document.createElement("button");

startButton.innerHTML = "Start";
stopButton.innerHTML = "Stop";

startButton.onclick = brush.cgStart.bind(brush, Arabic.alif1.concat(Arabic.haa1.concat(Arabic.lamalf23)));
stopButton.onclick = brush.cgStop.bind(brush);

canvasEl.parentNode.appendChild(startButton);
canvasEl.parentNode.appendChild(stopButton);
