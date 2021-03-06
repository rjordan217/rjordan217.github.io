/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

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
	
	var Brush = __webpack_require__(1),
	    MultipleBeziers = __webpack_require__(3),
	    BezierPath = __webpack_require__(5);
	
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
	    Arabic = __webpack_require__(6);
	
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


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var addVectors = __webpack_require__(2).addVectors;
	
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


/***/ },
/* 2 */
/***/ function(module, exports) {

	var VectorUtils = {
	  distance: function(pos1,pos2) {
	    var x1 = pos1[0],
	        y1 = pos1[1],
	        x2 = pos2[0],
	        y2 = pos2[1];
	
	    return Math.sqrt(Math.pow((x2 - x1),2) + Math.pow((y2 - y1),2));
	  },
	  
	  scaleVector: function(k, v) {
	    return [k * v[0], k * v[1]];
	  },
	
	  addVectors: function(rowVectors) {
	    var sumVector = [];
	    for(var i = 0; i < rowVectors[0].length; i++){ sumVector.push(0); }
	    rowVectors.forEach(function(vector) {
	      vector.forEach(function(el, idx) {
	        sumVector[idx] += el;
	      });
	    });
	    return sumVector;
	  },
	
	  diffVector: function(v1, v2) {
	    return [v2[0] - v1[0], v2[1] - v1[1]];
	  }
	};
	
	module.exports = VectorUtils;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var FindBezierTool = __webpack_require__(4),
	    diffVector = __webpack_require__(2).diffVector,
	    distance = __webpack_require__(2).distance;
	
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


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var diffVector = __webpack_require__(2).diffVector;
	
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


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var VectorUtils = __webpack_require__(2),
	    scaleVector = VectorUtils.scaleVector,
	    addVectors = VectorUtils.addVectors;
	
	var BezierPath = function(ctrlPts, timeChange) {
	  timeChange = timeChange || .001;
	  function parameterizedBezier(t) {
	    var vectorContributions = [];
	    vectorContributions.push(scaleVector(Math.pow(1 - t, 3), ctrlPts[0]));
	    vectorContributions.push(scaleVector(3 * t * Math.pow(1 - t, 2), ctrlPts[1]));
	    vectorContributions.push(scaleVector(3 * (1 - t) * Math.pow(t, 2), ctrlPts[2]));
	    vectorContributions.push(scaleVector(Math.pow(t, 3), ctrlPts[3]));
	
	    // If called at 10ms intervals, each parameterized chunk requires 1s
	    return [addVectors(vectorContributions), t + timeChange];
	  }
	
	  return parameterizedBezier;
	}
	
	module.exports = BezierPath;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var BezierPath = __webpack_require__(5);
	
	module.exports = {
	  alif1: __webpack_require__(7),
	  baa: [],
	  taa: [],
	  thaa: [],
	  jiim: [],
	  h1aa: __webpack_require__(8),
	  khaa: [],
	  daal: [],
	  dhaal: [],
	  raa: [],
	  zayn: [],
	  siin: __webpack_require__(9),
	  siin1: __webpack_require__(10),
	  shiin: [],
	  Saad: [],
	  Daad: [],
	  Taa: [],
	  Dhaa: [],
	  a3yn: [],
	  ghayn: [],
	  faa: [],
	  qaaf: [],
	  kaaf: [],
	  laam: [],
	  miim: [],
	  nun: __webpack_require__(11),
	  haa1: __webpack_require__(13),
	  haa2: __webpack_require__(14),
	  waaw: __webpack_require__(16),
	  yaa: [],
	  taamrbTa: [],
	  lamalf23: __webpack_require__(17),
	  alfmqSra: [],
	  hamza: [],
	  fatHa: __webpack_require__(18),
	  Damma: [],
	  ksra: [],
	  tanwiin: __webpack_require__(19),
	  space: __webpack_require__(20)
	};


/***/ },
/* 7 */
/***/ function(module, exports) {

	function alif(t) {
	  return [[0, t * 125], t + .003];
	}
	
	module.exports = [[alif, [-40, 0]]];


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var BezierPath = __webpack_require__(5);
	
	var haaFirstStroke = BezierPath([[0,0],[2,-19],[25,-12],[134,-15]], .003),
	    haaSwoop = BezierPath([[0,0],[-263,49],[-102,239],[7,137]], .003);
	
	module.exports = [[haaFirstStroke], [haaSwoop]];


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var BezierPath = __webpack_require__(5);
	
	var firstSwoop = BezierPath([[0,0],[7,47],[-31,45],[-29,8]], .003),
	    secondSwoop = BezierPath([[0,0],[3,40],[-40,47],[-33,1]], .003),
	    finalSwoop = BezierPath([[0,0],[7,110],[-98,120],[-88,40]], .003);
	
	module.exports = [[[0,-40], firstSwoop], [secondSwoop], [finalSwoop]];


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var BezierPath = __webpack_require__(5);
	
	var firstSwoop = BezierPath([[0,0],[7,47],[-31,45],[-29,8]], .003),
	    secondSwoop = BezierPath([[0,0],[3,40],[-40,47],[-33,1]], .003),
	    connector = BezierPath([[0,0],[3,31],[-20,35],[-30,31]], .003);
	
	module.exports = [[[0,-40], firstSwoop], [secondSwoop], [connector]];


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var BezierPath = __webpack_require__(5),
	    i3jam = __webpack_require__(12);
	
	var nunSwoop = BezierPath([[0,0],[35,105],[-125,100],[-90,0]], .003);
	
	module.exports = [[[0,-40], nunSwoop], [[40,-15], i3jam]];


/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = function (t) {
	  return [[18 * t, 18 * t], t + .033];
	};


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var BezierPath = __webpack_require__(5);
	
	var haaFirstStroke = BezierPath([[0,0],[66,30],[50,71],[-22,67]], .003),
	    haaLoop = BezierPath([[0,0],[-60,-11],[-15,-84],[27,-42]], .003),
	    haaLastStroke = BezierPath([[0,0],[25,41],[-92,46],[-90,45]], .003);
	
	module.exports = [[[-40, -60], haaFirstStroke], [haaLoop], [haaLastStroke]];


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var BezierPath = __webpack_require__(5),
	    runway = __webpack_require__(15)(30);
	
	var haaFirstStroke = BezierPath([[0,0],[-48,-39],[11,-114],[23,-35]], .003),
	    haaLoop = BezierPath([[0,0],[-19,36],[-73,79],[-24,97]], .003),
	    haaLastStroke = BezierPath([[0,0],[27,-10],[34,-73],[-37,-62]], .003);
	
	module.exports = [[runway], [haaFirstStroke], [haaLoop], [haaLastStroke]];


/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = function(length) {
	  function runway(t) {
	    return [[-length * t, 0], t + 1 / length];
	  }
	
	  return runway;
	};


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var BezierPath = __webpack_require__(5);
	
	var waawStart = BezierPath([[0,0],[-70,-10],[-40,-70],[2,-23]], .003),
	    waawEnd = BezierPath([[0,0],[11,21],[-28,108],[-96,80]], .003);
	    
	module.exports = [[waawStart], [waawEnd, [0, -57]]];


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var BezierPath = __webpack_require__(5);
	
	var laamStart = BezierPath([[0,0],[-33,0],[-15,-60],[-20,-129]], .003),
	    laamEnd = BezierPath([[0,0],[2,125],[2,137],[-60,133]], .003),
	    tiltedAlif = BezierPath([[0,0],[24,49],[33,82],[41,121]], .003);
	
	module.exports = [[laamStart], [laamEnd, [0, -125]], [tiltedAlif, [-80, 0]]];


/***/ },
/* 18 */
/***/ function(module, exports) {

	function fatHa(t) {
	  return [[0,1], t + .6];
	}
	
	module.exports = [[[-35, -130], fatHa, [35, 129]]];


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var fatHa = __webpack_require__(18)[0][1];
	
	module.exports = [[[35, -130], fatHa], [[0, -12], fatHa, [-35, 150]]];


/***/ },
/* 20 */
/***/ function(module, exports) {

	function space(t) {
	  return [[-50, 0], 1.01];
	}
	
	module.exports = [[space]];


/***/ }
/******/ ]);
//# sourceMappingURL=calligrapher_bundle.js.map