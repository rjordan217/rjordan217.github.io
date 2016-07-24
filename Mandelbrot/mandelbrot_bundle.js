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

	var canvasEl = document.getElementById('mandelbrot-canvas'),
	    ctx = canvasEl.getContext('2d'),
	    GameView = __webpack_require__(1);
	
	DIM_X = 1200,
	DIM_Y = 900;
	var mandel = new GameView(canvasEl);
	setTimeout(mandel.launch.bind(mandel), 50);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var MandelbrotImage = __webpack_require__(2);
	
	var GameView = function(canvasEl) {
	  console.log("Initializing");
	  this.$canvasEl = $(canvasEl);
	  this.image = new MandelbrotImage(canvasEl.getContext('2d'));
	  console.log(this.image);
	};
	
	GameView.prototype.launch = function() {
	  console.log("Launching");
	  this.image.draw();
	  $('.loading').css("display", "none");
	  this.$canvasEl.css("display","block");
	};
	
	module.exports = GameView;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var squareAndAddComplexNum = __webpack_require__(3).squareAndAddComplexNum,
	    magnitude = __webpack_require__(3).magnitude,
	    iterate = __webpack_require__(3).iterate,
	    inCardioid = __webpack_require__(3).inCardioid,
	    inMainDisk = __webpack_require__(3).inMainDisk;
	
	var MandelbrotImage = function(ctx) {
	  this.ctx = ctx;
	};
	
	MandelbrotImage.prototype.draw = function () {
	  var ctx = this.ctx;
	  var id = ctx.createImageData(1,1); // only do this once per page
	  var d  = id.data;                       // only do this once per page
	  d[0] = 0;
	  d[1] = 0;
	  d[2] = 0;
	  d[3] = 255;
	  console.log("Drawing");
	  var xIter = -2,
	      rangeX = 3,
	      delX = rangeX / DIM_X,
	      yIter = 1,
	      rangeY = -2,
	      delY = rangeY / DIM_Y;
	
	  for(var x = 0; x < DIM_X; x++) {
	    xIter += delX;
	    for(var y = 0; y < DIM_Y; y++) {
	      yIter += delY;
	      if (inCardioid([xIter,yIter]) || inMainDisk([xIter, yIter])) {
	        d[2] = 0;
	      } else {
	        d[2] = iterate([xIter, yIter], 256);
	      }
	      ctx.putImageData( id, x, y );
	    }
	    yIter = 1;
	  }
	};
	
	module.exports = MandelbrotImage;


/***/ },
/* 3 */
/***/ function(module, exports) {

	function squareAndAddComplexNum(z, constantC) {
	  var a = z[0],
	  b = z[1],
	  c1 = constantC[0],
	  c2 = constantC[1];
	
	  return [a * a - b * b + c1, 2 * a * b + c2];
	}
	
	function magnitude(z) {
	  var a = z[0],
	  b = z[1];
	
	  return a * a + b * b;
	}
	
	module.exports = {
	  squareAndAddComplexNum: squareAndAddComplexNum,
	
	  magnitude: magnitude,
	
	  iterate: function(pos, numSteps) {
	    var iterator = [0,0];
	    for(var i = 0; i < numSteps; i++) {
	      iterator = squareAndAddComplexNum(iterator, pos);
	      if(magnitude(iterator) > 256) return (1 - i / numSteps) * 255;
	    }
	    return 0;
	  },
	
	  inCardioid: function(pos) {
	    var a = pos[0],
	    b = pos[1],
	    p = Math.sqrt((a - 1 / 4) * (a - 1 / 4) + b * b);
	
	    if(a < p - 2 * p * p + 1 / 4) {
	      return true;
	    }
	    return false;
	  },
	
	  inMainDisk: function(pos) {
	    var a = pos[0],
	    b = pos[1];
	
	    if (magnitude([a + 1, b]) < 1 / 16) return true;
	    return false;
	  }
	};


/***/ }
/******/ ]);
//# sourceMappingURL=mandelbrot_bundle.js.map