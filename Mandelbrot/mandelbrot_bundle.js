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

	setTimeout(function() {
	  var canvasEl = document.getElementById('mandelbrot-canvas'),
	      ctx = canvasEl.getContext('2d'),
	      GameView = __webpack_require__(1);
	
	  var DIM_X = canvasEl.width,
	      DIM_Y = canvasEl.height;
	
	  var id = ctx.createImageData(1,1); // only do this once per page
	  var d  = id.data;                        // only do this once per page
	  d[0] = 0;
	  d[1] = 0;
	  d[2] = 0;
	  d[3] = 255;
	
	  var xIter = -2,
	      rangeX = 3,
	      delX = rangeX / DIM_X,
	      yIter = 1,
	      rangeY = -2,
	      delY = rangeY / DIM_Y;
	
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
	
	  function iterate(pos, numSteps) {
	    var iterator = [0,0];
	    for(var i = 0; i < numSteps; i++) {
	      iterator = squareAndAddComplexNum(iterator, pos);
	      if(magnitude(iterator) > 256) return (1 - i / numSteps) * 255;
	    }
	    return 0;
	  }
	
	  function inCardioid(pos) {
	    var a = pos[0],
	        b = pos[1],
	        p = Math.sqrt((a - 1 / 4) * (a - 1 / 4) + b * b);
	
	    if(a < p - 2 * p * p + 1 / 4) {
	      return true;
	    }
	    return false;
	  }
	
	  function inMainDisk(pos) {
	    var a = pos[0],
	        b = pos[1];
	
	    if (magnitude([a + 1, b]) < 1 / 16) return true;
	    return false;
	  }
	
	  for(var x = 0; x < DIM_X; x++) {
	    xIter += delX;
	    for(var y = 0; y < DIM_Y; y++) {
	      yIter += delY;
	      if (inCardioid([xIter,yIter]) || inMainDisk([xIter, yIter])) {
	        d[3] = 0;
	      } else {
	        d[3] = iterate([xIter, yIter], 1000);
	      }
	      ctx.putImageData( id, x, y );
	    }
	    yIter = 1;
	  }
	}, 1000);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var MandelbrotImage = __webpack_require__(2),
	    ZoomSlider = __webpack_require__(3);
	
	var GameView = function(canvasEl) {
	  this.canvasEl = canvasEl;
	  this.image = new MandelbrotImage(canvasEl.getContext('2d'));
	  this.slider = new ZoomSlider();
	};
	
	module.exports = GameView;


/***/ },
/* 2 */
/***/ function(module, exports) {

	var MandelbrotImage = function(ctx) {
	  this.ctx = ctx;
	};
	
	// var id = ctx.createImageData(1,1); // only do this once per page
	// var d  = id.data;                        // only do this once per page
	// d[0] = 0;
	// d[1] = 0;
	// d[2] = 0;
	// d[3] = 255;
	//
	// var xIter = -2,
	//     rangeX = 3,
	//     delX = rangeX / DIM_X,
	//     yIter = 1,
	//     rangeY = -2,
	//     delY = rangeY / DIM_Y;
	//
	// function squareAndAddComplexNum(z, constantC) {
	//   var a = z[0],
	//       b = z[1],
	//       c1 = constantC[0],
	//       c2 = constantC[1];
	//
	//   return [a * a - b * b + c1, 2 * a * b + c2];
	// }
	//
	// function magnitude(z) {
	//   var a = z[0],
	//       b = z[1];
	//
	//   return a * a + b * b;
	// }
	//
	// function iterate(pos, numSteps) {
	//   var iterator = [0,0];
	//   for(var i = 0; i < numSteps; i++) {
	//     iterator = squareAndAddComplexNum(iterator, pos);
	//     if(magnitude(iterator) > 256) return (1 - i / numSteps) * 255;
	//   }
	//   return 0;
	// }
	//
	// function inCardioid(pos) {
	//   var a = pos[0],
	//       b = pos[1],
	//       p = Math.sqrt((a - 1 / 4) * (a - 1 / 4) + b * b);
	//
	//   if(a < p - 2 * p * p + 1 / 4) {
	//     return true;
	//   }
	//   return false;
	// }
	//
	// function inMainDisk(pos) {
	//   var a = pos[0],
	//       b = pos[1];
	//
	//   if (magnitude([a + 1, b]) < 1 / 16) return true;
	//   return false;
	// }
	//
	// for(var x = 0; x < DIM_X; x++) {
	//   xIter += delX;
	//   for(var y = 0; y < DIM_Y; y++) {
	//     yIter += delY;
	//     if (inCardioid([xIter,yIter]) || inMainDisk([xIter, yIter])) {
	//       d[2] = 0;
	//     } else {
	//       d[2] = iterate([xIter, yIter], 256);
	//     }
	//     ctx.putImageData( id, x, y );
	//   }
	//   yIter = 1;
	// }
	
	module.exports = MandelbrotImage;


/***/ },
/* 3 */
/***/ function(module, exports) {

	var ZoomSlider = function() {
	  this.sliderContainer = document.getElementById('slider-container');
	  this.sliderButton = document.getElementById('slider-button');
	
	  this.bindMouse();
	};
	
	var buttonClicked = false;
	
	ZoomSlider.prototype.bindMouse = function() {
	  function onClick(e) {
	    e.preventDefault();
	    e.stopPropagation();
	    buttonClicked = true;
	  }
	
	  function onMoveWithClick(e) {
	    if(buttonClicked) {
	      if(e.target.id === "slider-container") {
	        this.sliderButton.setAttribute("style", "margin-left:" + (e.offsetX - 10) + "px");
	      }
	    }
	  }
	
	  function onUnclick(e) {
	    e.preventDefault();
	    e.stopPropagation();
	    buttonClicked = false;
	  }
	
	  this.sliderButton.addEventListener(
	    "mousedown",
	    onClick
	  );
	
	  this.sliderContainer.addEventListener(
	    "mousemove",
	    onMoveWithClick.bind(this)
	  );
	
	  document.addEventListener(
	    "mouseup",
	    onUnclick
	  );
	};
	
	module.exports = ZoomSlider;


/***/ }
/******/ ]);
//# sourceMappingURL=mandelbrot_bundle.js.map