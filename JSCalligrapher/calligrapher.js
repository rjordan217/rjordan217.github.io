var drawCanvasEl = document.getElementById('drawing-canvas'),
    ctx = drawCanvasEl.getContext('2d'),
    editCanvasEl = document.getElementById('edit-canvas'),
    editCtx = editCanvasEl.getContext('2d'),
    parent = drawCanvasEl.parentNode,
    buttonDiv = document.getElementById('button-container'),
    currentCanvas = drawCanvasEl;

function generateButton(text, clickCB, parentEl) {
  var newButt = document.createElement('button');
  newButt.innerHTML = text;
  newButt.onclick = clickCB;
  parentEl.appendChild(newButt);
}

function toggleFocus(e) {
  if(e.target == drawCanvasEl) {
    drawCanvasEl.classList.add("in-focus");
    editCanvasEl.classList.remove("in-focus");
  } else if (e.target == editCanvasEl) {
    editCanvasEl.classList.add("in-focus");
    drawCanvasEl.classList.remove("in-focus");
  }
}

parent.onclick = toggleFocus;

var startPos = [ 7 * drawCanvasEl.width / 8, drawCanvasEl.height / 4];

var Brush = require('./lib/brush'),
    MultipleBeziers = require('./utils/multiple_beziers'),
    BezierPath = require('./utils/bezier_path');

GET_MOUSE_POS = function(e) {
  var rect = editCanvasEl.getBoundingClientRect();
  return [
    (e.clientX - rect.left) / editCanvasEl.clientWidth * editCanvasEl.width,
    (e.clientY - rect.top) / editCanvasEl.clientHeight * editCanvasEl.height
  ];
};

bezierTool = new MultipleBeziers(editCtx);
bezierTool.bindMouse(editCanvasEl);


var brush = new Brush(ctx, startPos, 3 * drawCanvasEl.height / 4),
    Arabic = require('./alphabets/arabic');

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

var processLetters = function(alphabet, args) {
  var fullInstructions = [];
  for(var i = 0; i < args.length; i++) {
    fullInstructions = fullInstructions.concat(alphabet[args[i]].deepDup())
  }
  return fullInstructions;
};

var phrase = processLetters(
  Arabic,
  ['alif1','haa1','lamalf23','tanwiin','space','waaw','siin1','haa2','lamalf23','tanwiin']
);

ctx.fillStyle = 'black'
brush.cgStart(phrase);

function calligraph() {
  var instructions = bezierTool.outputFullInstructions();
  var newPhrase = instructions.map(function(instrSet) {
    return [BezierPath(instrSet.ctrlPts, .003)];
  });
  ctx.clearRect(0,0,1200,800);
  brush = new Brush(ctx, bezierTool.beziers[0].controlPoints[0], 3 * drawCanvasEl.height / 4);
  brush.cgStart(newPhrase);
};

generateButton("Add Bezier",bezierTool.addBezier.bind(bezierTool),buttonDiv);
generateButton("Write it!",calligraph,buttonDiv);
