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

	var canvasEl = document.getElementById('canvas');
	var ctx = canvasEl.getContext('2d');
	
	var startPos = [ 7 * canvasEl.width / 8, canvasEl.height / 4];
	
	var Brush = __webpack_require__(1);
	var MultipleBeziers = __webpack_require__(3);
	
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
	
	var Arabic = __webpack_require__(5);
	
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
	  }
	};
	
	module.exports = VectorUtils;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var FindBezierTool = __webpack_require__(4);
	
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
	
	module.exports = MultipleBeziers;


/***/ },
/* 4 */
/***/ function(module, exports) {

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
	
	var diffVector = function(v1,v2) {
	  return [v2[0] - v1[0], v2[1] - v1[1]];
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


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var BezierPath = __webpack_require__(6);
	
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
/* 6 */
/***/ function(module, exports) {

	var scaleVector = function(k, v) {
	  return [k * v[0], k * v[1]];
	};
	
	var addVectors = function(rowVectors) {
	  var sumVector = new Array(rowVectors[0].length);
	  sumVector.forEach(function(el){return 0;});
	  rowVectors.forEach(function(vector) {
	    vector.forEach(function(el, idx) {
	      sumVector[idx] += el;
	    });
	  });
	  return sumVector;
	};
	
	var BezierPath = function(ctrlPts) {
	  function parameterizedBezier(t) {
	    var vectorContributions = [];
	    vectorContributions.push(scaleVector(Math.pow(1 - t, 3), ctrlPts[0]));
	    vectorContributions.push(scaleVector(3 * t * Math.pow(1 - t, 2), ctrlPts[1]));
	    vectorContributions.push(scaleVector(3 * (1 - t) * Math.pow(t, 2), ctrlPts[2]));
	    vectorContributions.push(scaleVector(Math.pow(t, 3), ctrlPts[3]));
	
	    // If called at 10ms intervals, each parameterized chunk requires 1s
	    return [addVectors(vectorContributions), t + .001];
	  }
	
	  return parameterizedBezier;
	}
	
	module.exports = BezierPath;


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

	var VectorUtils = __webpack_require__(2),
	    scaleVector = VectorUtils.scaleVector,
	    addVectors = VectorUtils.addVectors;
	
	var haaFirstStroke = function(t) {
	  var vectorContributions = [];
	  var ctrlPts = [[0,0],[2,-19],[25,-12],[134,-15]];
	  vectorContributions.push(scaleVector(Math.pow(1 - t, 3), ctrlPts[0]));
	  vectorContributions.push(scaleVector(3 * t * Math.pow(1 - t, 2), ctrlPts[1]));
	  vectorContributions.push(scaleVector(3 * (1 - t) * Math.pow(t, 2), ctrlPts[2]));
	  vectorContributions.push(scaleVector(Math.pow(t, 3), ctrlPts[3]));
	
	  // If called at 10ms intervals, each parameterized chunk requires 1s
	  return [addVectors(vectorContributions), t + .003];
	};
	
	var haaSwoop = function(t) {
	  var vectorContributions = [];
	  var ctrlPts = [[0,0],[-263,49],[-102,239],[7,137]];
	  vectorContributions.push(scaleVector(Math.pow(1 - t, 3), ctrlPts[0]));
	  vectorContributions.push(scaleVector(3 * t * Math.pow(1 - t, 2), ctrlPts[1]));
	  vectorContributions.push(scaleVector(3 * (1 - t) * Math.pow(t, 2), ctrlPts[2]));
	  vectorContributions.push(scaleVector(Math.pow(t, 3), ctrlPts[3]));
	
	  // If called at 10ms intervals, each parameterized chunk requires 1s
	  return [addVectors(vectorContributions), t + .003];
	};
	
	module.exports = [[haaFirstStroke], [haaSwoop]];


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var VectorUtils = __webpack_require__(2),
	    scaleVector = VectorUtils.scaleVector,
	    addVectors = VectorUtils.addVectors;
	
	function firstSwoop(t) {
	  var vectorContributions = [];
	  var ctrlPts = [[0,0],[7,47],[-31,45],[-29,8]];
	  vectorContributions.push(scaleVector(Math.pow(1 - t, 3), ctrlPts[0]));
	  vectorContributions.push(scaleVector(3 * t * Math.pow(1 - t, 2), ctrlPts[1]));
	  vectorContributions.push(scaleVector(3 * (1 - t) * Math.pow(t, 2), ctrlPts[2]));
	  vectorContributions.push(scaleVector(Math.pow(t, 3), ctrlPts[3]));
	
	  return [addVectors(vectorContributions), t + .003];
	}
	
	function secondSwoop(t) {
	  var vectorContributions = [];
	  var ctrlPts = [[0,0],[3,40],[-40,47],[-33,1]];
	  vectorContributions.push(scaleVector(Math.pow(1 - t, 3), ctrlPts[0]));
	  vectorContributions.push(scaleVector(3 * t * Math.pow(1 - t, 2), ctrlPts[1]));
	  vectorContributions.push(scaleVector(3 * (1 - t) * Math.pow(t, 2), ctrlPts[2]));
	  vectorContributions.push(scaleVector(Math.pow(t, 3), ctrlPts[3]));
	
	  return [addVectors(vectorContributions), t + .003];
	}
	
	function finalSwoop(t) {
	  var vectorContributions = [];
	  var ctrlPts = [[0,0],[7,110],[-98,120],[-88,40]];
	  vectorContributions.push(scaleVector(Math.pow(1 - t, 3), ctrlPts[0]));
	  vectorContributions.push(scaleVector(3 * t * Math.pow(1 - t, 2), ctrlPts[1]));
	  vectorContributions.push(scaleVector(3 * (1 - t) * Math.pow(t, 2), ctrlPts[2]));
	  vectorContributions.push(scaleVector(Math.pow(t, 3), ctrlPts[3]));
	
	  return [addVectors(vectorContributions), t + .003];
	}
	
	module.exports = [[[0,-40], firstSwoop], [secondSwoop], [finalSwoop]];


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var VectorUtils = __webpack_require__(2),
	    scaleVector = VectorUtils.scaleVector,
	    addVectors = VectorUtils.addVectors;
	
	function firstSwoop(t) {
	  var vectorContributions = [];
	  var ctrlPts = [[0,0],[7,47],[-31,45],[-29,8]];
	  vectorContributions.push(scaleVector(Math.pow(1 - t, 3), ctrlPts[0]));
	  vectorContributions.push(scaleVector(3 * t * Math.pow(1 - t, 2), ctrlPts[1]));
	  vectorContributions.push(scaleVector(3 * (1 - t) * Math.pow(t, 2), ctrlPts[2]));
	  vectorContributions.push(scaleVector(Math.pow(t, 3), ctrlPts[3]));
	
	  return [addVectors(vectorContributions), t + .003];
	}
	
	function secondSwoop(t) {
	  var vectorContributions = [];
	  var ctrlPts = [[0,0],[3,40],[-40,47],[-33,1]];
	  vectorContributions.push(scaleVector(Math.pow(1 - t, 3), ctrlPts[0]));
	  vectorContributions.push(scaleVector(3 * t * Math.pow(1 - t, 2), ctrlPts[1]));
	  vectorContributions.push(scaleVector(3 * (1 - t) * Math.pow(t, 2), ctrlPts[2]));
	  vectorContributions.push(scaleVector(Math.pow(t, 3), ctrlPts[3]));
	
	  return [addVectors(vectorContributions), t + .003];
	}
	
	function connector(t) {
	  var vectorContributions = [];
	  var ctrlPts = [[0,0],[3,31],[-20,35],[-30,31]];
	  vectorContributions.push(scaleVector(Math.pow(1 - t, 3), ctrlPts[0]));
	  vectorContributions.push(scaleVector(3 * t * Math.pow(1 - t, 2), ctrlPts[1]));
	  vectorContributions.push(scaleVector(3 * (1 - t) * Math.pow(t, 2), ctrlPts[2]));
	  vectorContributions.push(scaleVector(Math.pow(t, 3), ctrlPts[3]));
	
	  return [addVectors(vectorContributions), t + .003];
	}
	
	module.exports = [[[0,-40], firstSwoop], [secondSwoop], [connector]];


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var VectorUtils = __webpack_require__(2),
	    scaleVector = VectorUtils.scaleVector,
	    addVectors = VectorUtils.addVectors,
	    i3jam = __webpack_require__(12);
	
	function nunSwoop(t) {
	  var vectorContributions = [];
	  var ctrlPts = [[0,0],[35,105],[-125,100],[-90,0]];
	  vectorContributions.push(scaleVector(Math.pow(1 - t, 3), ctrlPts[0]));
	  vectorContributions.push(scaleVector(3 * t * Math.pow(1 - t, 2), ctrlPts[1]));
	  vectorContributions.push(scaleVector(3 * (1 - t) * Math.pow(t, 2), ctrlPts[2]));
	  vectorContributions.push(scaleVector(Math.pow(t, 3), ctrlPts[3]));
	
	  return [addVectors(vectorContributions), t + .003];
	}
	
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

	var VectorUtils = __webpack_require__(2),
	    scaleVector = VectorUtils.scaleVector,
	    addVectors = VectorUtils.addVectors;
	
	function haaFirstStroke(t) {
	  var vectorContributions = [];
	  var ctrlPts = [[0,0],[66,30],[50,71],[-22,67]];
	  vectorContributions.push(scaleVector(Math.pow(1 - t, 3), ctrlPts[0]));
	  vectorContributions.push(scaleVector(3 * t * Math.pow(1 - t, 2), ctrlPts[1]));
	  vectorContributions.push(scaleVector(3 * (1 - t) * Math.pow(t, 2), ctrlPts[2]));
	  vectorContributions.push(scaleVector(Math.pow(t, 3), ctrlPts[3]));
	
	  // If called at 10ms intervals, each parameterized chunk requires 1s
	  return [addVectors(vectorContributions), t + .003];
	}
	
	function haaLoop(t) {
	  var vectorContributions = [];
	  var ctrlPts = [[0,0],[-60,-11],[-15,-84],[27,-42]];
	  vectorContributions.push(scaleVector(Math.pow(1 - t, 3), ctrlPts[0]));
	  vectorContributions.push(scaleVector(3 * t * Math.pow(1 - t, 2), ctrlPts[1]));
	  vectorContributions.push(scaleVector(3 * (1 - t) * Math.pow(t, 2), ctrlPts[2]));
	  vectorContributions.push(scaleVector(Math.pow(t, 3), ctrlPts[3]));
	
	  // If called at 10ms intervals, each parameterized chunk requires 1s
	  return [addVectors(vectorContributions), t + .003];
	}
	
	function haaLastStroke(t) {
	  var vectorContributions = [];
	  var ctrlPts = [[0,0],[25,41],[-92,46],[-90,45]];
	  vectorContributions.push(scaleVector(Math.pow(1 - t, 3), ctrlPts[0]));
	  vectorContributions.push(scaleVector(3 * t * Math.pow(1 - t, 2), ctrlPts[1]));
	  vectorContributions.push(scaleVector(3 * (1 - t) * Math.pow(t, 2), ctrlPts[2]));
	  vectorContributions.push(scaleVector(Math.pow(t, 3), ctrlPts[3]));
	
	  // If called at 10ms intervals, each parameterized chunk requires 1s
	  return [addVectors(vectorContributions), t + .003];
	}
	
	module.exports = [[[-40, -60], haaFirstStroke], [haaLoop], [haaLastStroke]];


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var VectorUtils = __webpack_require__(2),
	    scaleVector = VectorUtils.scaleVector,
	    addVectors = VectorUtils.addVectors,
	    runway = __webpack_require__(15)(30);
	
	function haaFirstStroke(t) {
	  var vectorContributions = [];
	  var ctrlPts = [[0,0],[-48,-39],[11,-114],[23,-35]];
	  vectorContributions.push(scaleVector(Math.pow(1 - t, 3), ctrlPts[0]));
	  vectorContributions.push(scaleVector(3 * t * Math.pow(1 - t, 2), ctrlPts[1]));
	  vectorContributions.push(scaleVector(3 * (1 - t) * Math.pow(t, 2), ctrlPts[2]));
	  vectorContributions.push(scaleVector(Math.pow(t, 3), ctrlPts[3]));
	
	  // If called at 10ms intervals, each parameterized chunk requires 1s
	  return [addVectors(vectorContributions), t + .003];
	}
	
	function haaLoop(t) {
	  var vectorContributions = [];
	  var ctrlPts = [[0,0],[-19,36],[-73,79],[-24,97]];
	  vectorContributions.push(scaleVector(Math.pow(1 - t, 3), ctrlPts[0]));
	  vectorContributions.push(scaleVector(3 * t * Math.pow(1 - t, 2), ctrlPts[1]));
	  vectorContributions.push(scaleVector(3 * (1 - t) * Math.pow(t, 2), ctrlPts[2]));
	  vectorContributions.push(scaleVector(Math.pow(t, 3), ctrlPts[3]));
	
	  // If called at 10ms intervals, each parameterized chunk requires 1s
	  return [addVectors(vectorContributions), t + .003];
	}
	
	function haaLastStroke(t) {
	  var vectorContributions = [];
	  var ctrlPts = [[0,0],[27,-10],[34,-73],[-37,-62]];
	  vectorContributions.push(scaleVector(Math.pow(1 - t, 3), ctrlPts[0]));
	  vectorContributions.push(scaleVector(3 * t * Math.pow(1 - t, 2), ctrlPts[1]));
	  vectorContributions.push(scaleVector(3 * (1 - t) * Math.pow(t, 2), ctrlPts[2]));
	  vectorContributions.push(scaleVector(Math.pow(t, 3), ctrlPts[3]));
	
	  // If called at 10ms intervals, each parameterized chunk requires 1s
	  return [addVectors(vectorContributions), t + .003];
	}
	
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

	var VectorUtils = __webpack_require__(2),
	    scaleVector = VectorUtils.scaleVector,
	    addVectors = VectorUtils.addVectors;
	
	function waawStart(t) {
	  var vectorContributions = [];
	  var ctrlPts = [[0,0],[-70,-10],[-40,-70],[2,-23]];
	  vectorContributions.push(scaleVector(Math.pow(1 - t, 3), ctrlPts[0]));
	  vectorContributions.push(scaleVector(3 * t * Math.pow(1 - t, 2), ctrlPts[1]));
	  vectorContributions.push(scaleVector(3 * (1 - t) * Math.pow(t, 2), ctrlPts[2]));
	  vectorContributions.push(scaleVector(Math.pow(t, 3), ctrlPts[3]));
	
	  return [addVectors(vectorContributions), t + .003];
	}
	
	function waawEnd(t) {
	  var vectorContributions = [];
	  var ctrlPts = [[0,0],[11,21],[-28,108],[-96,80]];
	  vectorContributions.push(scaleVector(Math.pow(1 - t, 3), ctrlPts[0]));
	  vectorContributions.push(scaleVector(3 * t * Math.pow(1 - t, 2), ctrlPts[1]));
	  vectorContributions.push(scaleVector(3 * (1 - t) * Math.pow(t, 2), ctrlPts[2]));
	  vectorContributions.push(scaleVector(Math.pow(t, 3), ctrlPts[3]));
	
	  return [addVectors(vectorContributions), t + .003];
	}
	
	module.exports = [[waawStart], [waawEnd, [0, -57]]];


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var VectorUtils = __webpack_require__(2),
	    scaleVector = VectorUtils.scaleVector,
	    addVectors = VectorUtils.addVectors;
	
	function laamStart(t) {
	  var vectorContributions = [];
	  var ctrlPts = [[0,0],[-33,0],[-15,-60],[-20,-129]];
	  vectorContributions.push(scaleVector(Math.pow(1 - t, 3), ctrlPts[0]));
	  vectorContributions.push(scaleVector(3 * t * Math.pow(1 - t, 2), ctrlPts[1]));
	  vectorContributions.push(scaleVector(3 * (1 - t) * Math.pow(t, 2), ctrlPts[2]));
	  vectorContributions.push(scaleVector(Math.pow(t, 3), ctrlPts[3]));
	
	  // If called at 10ms intervals, each parameterized chunk requires 1s
	  return [addVectors(vectorContributions), t + .003];
	}
	
	function laamEnd(t) {
	  var vectorContributions = [];
	  var ctrlPts = [[0,0],[2,125],[2,137],[-60,133]];
	  vectorContributions.push(scaleVector(Math.pow(1 - t, 3), ctrlPts[0]));
	  vectorContributions.push(scaleVector(3 * t * Math.pow(1 - t, 2), ctrlPts[1]));
	  vectorContributions.push(scaleVector(3 * (1 - t) * Math.pow(t, 2), ctrlPts[2]));
	  vectorContributions.push(scaleVector(Math.pow(t, 3), ctrlPts[3]));
	
	
	  return [addVectors(vectorContributions), t + .003];
	}
	
	function tiltedAlif(t) {
	  var vectorContributions = [];
	  var ctrlPts = [[0,0],[24,49],[33,82],[41,121]];
	  vectorContributions.push(scaleVector(Math.pow(1 - t, 3), ctrlPts[0]));
	  vectorContributions.push(scaleVector(3 * t * Math.pow(1 - t, 2), ctrlPts[1]));
	  vectorContributions.push(scaleVector(3 * (1 - t) * Math.pow(t, 2), ctrlPts[2]));
	  vectorContributions.push(scaleVector(Math.pow(t, 3), ctrlPts[3]));
	
	  // If called at 10ms intervals, each parameterized chunk requires 1s
	  return [addVectors(vectorContributions), t + .003];
	}
	
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