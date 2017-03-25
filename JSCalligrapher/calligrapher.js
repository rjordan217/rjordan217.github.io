window.isMobile = false;
if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
    .test(navigator.userAgent)) window.isMobile = true;

var drawCanvasEl = document.getElementById('drawing-canvas'),
    ctx = drawCanvasEl.getContext('2d'),
    editCanvasEl = document.getElementById('edit-canvas'),
    editCtx = editCanvasEl.getContext('2d'),
    parent = drawCanvasEl.parentNode,
    buttonDiv = document.getElementById('button-container'),
    currentCanvas = drawCanvasEl,
    infoHeaders = document.getElementsByClassName('info-header'),
    infoContent = document.getElementsByClassName('info-section'),
    minimize = document.getElementById('minimize');

infoHeaders = Array.prototype.slice.call(infoHeaders, 0, infoHeaders.length);
infoContent = Array.prototype.slice.call(infoContent, 0, infoContent.length);

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
    return [BezierPath(instrSet.ctrlPts, .003), instrSet.offsetAfter];
  });
  ctx.clearRect(0,0,900,500);
  brush = new Brush(ctx, bezierTool.beziers[0].controlPoints[0], 3 * drawCanvasEl.height / 4);
  brush.cgStart(newPhrase);
};

document.getElementById('add-button').onclick = function() {
  bezierTool.addBezier();
  bezierTool.draw();
}
document.getElementById('draw-button').onclick = calligraph;
document.getElementById('reset-button').onclick = function() {
  bezierTool.resetBeziers();
  ctx.clearRect(0,0,900,500);
};

function displaySection(idx) {
  infoContent.forEach((el, i) => {
    if(idx == i) {
      el.style.display = "block";
    } else {
      el.style.display = "none";
    }
  });
}

infoHeaders.forEach((el, idx) => {
  el.onclick = (e) => {
    e.preventDefault();
    displaySection(idx);
  };
});
displaySection(0);

var movebar = document.getElementById('button-movebar'),
    movebarClicked = false,
    delX = 0,
    delY = 0;

function moveButtonsWithMouse(e) {
  var buttonsRect = movebar.getBoundingClientRect(),
      canvasRect = parent.getBoundingClientRect();

  buttonDiv.style.right = (canvasRect.right - (e.clientX + delX)) + "px";
  buttonDiv.style.top = ((e.clientY - delY) - canvasRect.top) + "px";
}

if(window.isMobile) {
  movebar.addEventListener('touchstart',function(e){
    e.preventDefault();

    var buttonsRect = movebar.getBoundingClientRect(),
        touchE = e.targetTouches[0];

    movebarClicked = true;
    delX = buttonsRect.right - touchE.clientX;
    delY = touchE.clientY - buttonsRect.top;
  })
  parent.addEventListener('touchmove',function(e) {
    if(movebarClicked) {
      e = e.targetTouches[0]
      moveButtonsWithMouse(e);
    }
  })
  document.addEventListener('touchend',function(e){movebarClicked = false;})
} else {
  movebar.onmousedown = function(e) {
    e.preventDefault();

    var buttonsRect = movebar.getBoundingClientRect();

    movebarClicked = true;
    delX = buttonsRect.right - e.clientX;
    delY = e.clientY - buttonsRect.top;
  }
  parent.onmousemove = function(e) {
    if(movebarClicked) moveButtonsWithMouse(e);
  }
  document.onmouseup = function(e) {
    e.preventDefault();
    movebarClicked = false;
  }
}

var minimized = false;
minimize.onclick = function(e) {
  e.preventDefault();
  if(e.stopPropagation) e.stopPropagation();
  if(e.cancelBubble !== undefined) e.cancelBubble = true;

  if(minimized) {
    buttonDiv.classList.remove('minimized');
    minimized = false;
    minimize.innerHTML = "—";
  } else {
    buttonDiv.classList.add('minimized')
    minimized = true;
    minimize.innerHTML = "▼";
  }
}
