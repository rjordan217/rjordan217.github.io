var canvasEl = document.getElementById('drawing-canvas');
var ctx = canvasEl.getContext('2d');

var startPos = [ 7 * canvasEl.width / 8, canvasEl.height / 4];

var Brush = require('./lib/brush');
var MultipleBeziers = require('./utils/multiple_beziers');

GET_MOUSE_POS = function(e) {
  var rect = canvasEl.getBoundingClientRect();
  return [ e.clientX - rect.left, e.clientY - rect.top ];
};

canvasEl = document.getElementById('edit-canvas');
ctx = canvasEl.getContext('2d');

var bezierTool = new MultipleBeziers(ctx);
bezierTool.bindMouse(canvasEl);

var addButton = document.createElement("button");
addButton.onclick = bezierTool.addBezier.bind(bezierTool);
addButton.innerHTML = "Add Bezier";
canvasEl.parentNode.appendChild(addButton);

var BezierPath = require('./utils/bezier_path');

var printFuncButton = document.createElement("button");
printFuncButton.onclick = function() {
  bezierTool.beziers.forEach(function(bezier) {
    console.log(BezierPath(bezier.printRelativeControlPoints()).toString());
  });;
};
printFuncButton.innerHTML = "Print Béziers";
canvasEl.parentNode.appendChild(printFuncButton);

var brush = new Brush(ctx, startPos, 3 * canvasEl.height / 4);

var Arabic = require('./alphabets/arabic');

// var startButton = document.createElement("button"),
//     stopButton = document.createElement("button");
//
// startButton.innerHTML = "Start";
// stopButton.innerHTML = "Stop";

Array.prototype.deepDup = function() {
  var duplicate = [];
  this.forEach(function(el) {
    var toPush;
    if(el instanceof Array) {
      toPush = el.deepDup();
    } else {
      toPush = el;
    }
    duplicate.push(toPush);
  });
  return duplicate;
};

var phrase = Arabic.alif1.concat(
  Arabic.haa1.concat(
    Arabic.lamalf23.deepDup().concat(
      Arabic.tanwiin.deepDup().concat(
        Arabic.space.concat(
          Arabic.waaw.concat(
            Arabic.siin1.concat(
              Arabic.haa2.concat(
                Arabic.lamalf23.deepDup().concat(
                  Arabic.tanwiin.deepDup()
                )
              )
            )
          )
        )
      )
    )
  )
);

// startButton.onclick = brush.cgStart.bind(
//   brush,
//   phrase
// );
// stopButton.onclick = brush.cgStop.bind(brush);
//
// canvasEl.parentNode.appendChild(startButton);
// canvasEl.parentNode.appendChild(stopButton);


ctx.fillStyle = '#E9FBFF';
ctx.fillRect(0,0,900,500);
ctx.fillStyle = 'black'
brush.cgStart(phrase);
