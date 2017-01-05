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
	    GameView = __webpack_require__(1),
	    mandel = new GameView(canvasEl);
	    
	setTimeout(mandel.launch.bind(mandel), 50);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var MandelbrotImage = __webpack_require__(2);
	
	var GameView = function(canvasEl) {
	  this.$canvasEl = $(canvasEl);
	  this.image = new MandelbrotImage(
	    canvasEl.getContext('2d'),
	    canvasEl.width,
	    canvasEl.height
	  );
	};
	
	GameView.prototype.launch = function() {
	  // this.$canvasEl.ondoubleclick = function(e) {
	  //   var width = this.$canvasEl.width
	  //   var height = this.$canvasEl.height
	  //   this.image.zoomOnPosition(e.offsetX / width,e.offsetY / height)
	  //   this.image.draw()
	  // }.bind(this) // TODO: Fix this
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
	
	var MandelbrotImage = function(ctx,pxWidth,pxHeight) {
	  this.ctx = ctx;
	  this.upperLeft = [-2,1]
	  this.bottomRight = [1,-1]
	  this.pxWidth = pxWidth
	  this.pxHeight = pxHeight
	  this.zoomLevel = 0
	  // With zoom, can save previous zoom images to prevent reload time
	};
	
	MandelbrotImage.prototype.zoomOnPosition = function (x,y) {
	  this.zoomLevel++
	
	  var rangeX = this.bottomRight[0] - this.upperLeft[0],
	      rangeY = this.bottomRight[1] - this.upperLeft[1]
	
	  var scaledUL = [],
	      scaledBR = []
	
	
	};
	
	MandelbrotImage.prototype.setChunkData = function (tl,delX,delY,chunk) {
	  var d  = chunk.data
	
	  var currentPos = tl.slice(0,2),
	      i = 0;
	
	  while(i < d.length) {
	    d[i++] = 0
	    d[i++] = 0
	    if(inCardioid(currentPos) || inMainDisk(currentPos)) {
	      d[i++] = 0
	    } else {
	      d[i++] = iterate(currentPos,256)
	    }
	    d[i++] = 255
	    if(Math.round(i / 4) % chunk.width == 0) {
	      currentPos[1] += delY
	      currentPos[0] = tl[0]
	    } else {
	      currentPos[0] += delX
	    }
	  }
	};
	
	MandelbrotImage.prototype.draw = function () {
	  var numXChunks = 4,
	      numYChunks = 3,
	      tl = this.upperLeft,
	      br = this.bottomRight,
	      rangeX = br[0] - tl[0],
	      rangeY = br[1] - tl[1],
	      delX = rangeX / numXChunks,
	      delY = rangeY / numYChunks,
	      chunkDelX = rangeX / this.pxWidth,
	      chunkDelY = rangeY / this.pxHeight,
	      chunkTL
	
	  function _chunk(i,j,chunk) {
	    if(i == numXChunks) {
	      i = 0
	      j++
	    }
	    if(j == numYChunks) return;
	
	    chunkTL = [tl[0] + i * delX, tl[1] + j * delY]
	    this.setChunkData(chunkTL,chunkDelX,chunkDelY,chunk)
	    this.ctx.putImageData(chunk,i * this.pxWidth / numXChunks,j * this.pxHeight / numYChunks)
	    setTimeout(_chunk.bind(this,i + 1, j, chunk),5) // Prevents thread-blocking for too long
	  }
	
	  var chunk = this.ctx.createImageData(
	    this.pxWidth / numXChunks,
	    this.pxHeight / numYChunks
	  )
	  _chunk.call(this,0,0,chunk)
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