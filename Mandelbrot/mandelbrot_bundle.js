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
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

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
      if(magnitude(iterator) > 8) return (1 - i / numSteps) * 255;
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


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var MandelbrotImage = __webpack_require__(3),
    ColorGrad = __webpack_require__(2);

var GameView = function(mandelCanvEl,colorCanvEl,zoomButton) {
  this.mandelCanvEl = mandelCanvEl;
  this.image = new MandelbrotImage(
    mandelCanvEl.getContext('2d'),
    mandelCanvEl.width,
    mandelCanvEl.height
  );
  this.colorCanvEl = colorCanvEl;
  this.colorGrad = new ColorGrad(
    colorCanvEl.getContext('2d'),
    this.image.updateColor.bind(this.image)
  );
  this.zoomOut = zoomButton;
};

GameView.prototype.launch = function() {
  this.mandelCanvEl.ondblclick = function(e) {
    this.image.zoomOnPosition(
      e.offsetX * this.mandelCanvEl.width / this.mandelCanvEl.clientWidth,
      e.offsetY * this.mandelCanvEl.height / this.mandelCanvEl.clientHeight
    )
    this.image.draw()
    this.toggleZoom()
  }.bind(this)

  this.image.draw();
  this.toggleZoom();

  this.zoomOut.onclick = function(){
    this.image.zoomOut()
    this.toggleZoom()
  }.bind(this)

  this.colorGrad.launch(
    this.colorCanvEl.width / this.colorCanvEl.clientWidth,
    this.colorCanvEl.height / this.colorCanvEl.clientHeight
  )
};

GameView.prototype.toggleZoom = function () {
  this.zoomOut.disabled = !this.image.zoomLevel
};

module.exports = GameView;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

var colors = ['#f00','#ff0','#0f0','#0ff','#00f','#f0f','#f00']

var ColorGrad = function(ctx,updateCB) {
  this.ctx = ctx
  this.grad = ctx.createLinearGradient(0,0,ctx.canvas.width,0)
  for(var i = 0; i < 7; i++) {
    this.grad.addColorStop(i / 6, colors[i])
  }
  this.updateColor = updateCB
}

ColorGrad.prototype.launch = function(xCorrection,yCorrection) {
  function resetColor(e) {
    var colorData = this.ctx.getImageData(
      Math.round(e.offsetX * xCorrection),
      Math.round(e.offsetY * yCorrection),
      1,
      1
    ).data.slice(0,3)
    if(colorData[0] || colorData[1] || colorData[2]) this.updateColor(colorData);
  }
  this.ctx.fillStyle = this.grad
  this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height)
  this.ctx.canvas.onclick = resetColor.bind(this)
};

module.exports = ColorGrad;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var squareAndAddComplexNum = __webpack_require__(0).squareAndAddComplexNum,
    magnitude = __webpack_require__(0).magnitude,
    iterate = __webpack_require__(0).iterate,
    inCardioid = __webpack_require__(0).inCardioid,
    inMainDisk = __webpack_require__(0).inMainDisk;

function unitColorVect(rgbArray) {
  var floatArray = [] // rgbArray is UIntClampedArray, so .map will not return floats
  rgbArray.forEach(function(el) {floatArray.push(el / 255)})
  return floatArray;
}

function rotateColorData(ctx,originalData,newColorVect) {
  var newData = ctx.createImageData(originalData.width,originalData.height),
      newD = newData.data,
      d = originalData.data,
      i = 0,
      colorMag;

  while(i < d.length) {
    colorMag = Math.max(d[i],d[i + 1],d[i + 2]);
    newD[i++] = newColorVect[0] * colorMag;
    newD[i++] = newColorVect[1] * colorMag;
    newD[i++] = newColorVect[2] * colorMag;
    newD[i++] = 255;
  }

  return newData
}

var MandelbrotImage = function(ctx,pxWidth,pxHeight) {
  this.ctx = ctx;
  this.upperLeft = [-2,1]
  this.bottomRight = [1,-1]
  this.pxWidth = pxWidth
  this.pxHeight = pxHeight
  this.zoomLevel = 0
  this.previousZooms = []
  this.color = [0,0,1]
};

MandelbrotImage.prototype.range = function (axis) {
  return this.bottomRight[axis] - this.upperLeft[axis]
};

MandelbrotImage.prototype.zoomOnPosition = function (x,y) {
  var ctx = this.ctx;

  this.zoomLevel++
  this.previousZooms.push({
    ul: this.upperLeft.slice(0,2),
    br: this.bottomRight.slice(0,2),
    data: ctx.getImageData(0,0,this.pxWidth,this.pxHeight)
  })

  var rangeX = this.range(0),
      rangeY = this.range(1),
      cartX = this.upperLeft[0] + x * rangeX / this.pxWidth,
      cartY = this.upperLeft[1] + y * rangeY / this.pxHeight,
      newWidth = rangeX / 10,
      newHeight = rangeY / 10,
      scaledUL = [cartX - newWidth / 2, cartY - newHeight / 2],
      scaledBR = [cartX + newWidth / 2, cartY + newHeight / 2]

  this.upperLeft = scaledUL
  this.bottomRight = scaledBR

  this.draw()
};

MandelbrotImage.prototype.zoomOut = function() {
  if(this.zoomLevel) {
    var prevZoom = this.previousZooms.pop()
    this.upperLeft = prevZoom.ul
    this.bottomRight = prevZoom.br
    this.ctx.putImageData(prevZoom.data,0,0)
    this.zoomLevel--
  }
};

MandelbrotImage.prototype.setChunkData = function (tl,delX,delY,chunk) {
  var d  = chunk.data

  var currentPos = tl.slice(0,2),
      i = 0,
      colorR = this.color[0],
      colorG = this.color[1],
      colorB = this.color[2],
      colorMagnitude;

  while(i < d.length) {
    if(inCardioid(currentPos) || inMainDisk(currentPos)) {
      colorMagnitude = 0
    } else {
      colorMagnitude = iterate(currentPos,256 * (this.zoomLevel + 1))
    }
    d[i++] = colorR * colorMagnitude
    d[i++] = colorG * colorMagnitude
    d[i++] = colorB * colorMagnitude
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
      rangeX = this.range(0),
      rangeY = this.range(1),
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

MandelbrotImage.prototype.updateColor = function (rgbArray) {
  var originalData = this.ctx.getImageData(0,0,this.pxWidth,this.pxHeight),
      newColorVect = unitColorVect(rgbArray),
      newData = rotateColorData(this.ctx,originalData,newColorVect);


  this.color = newColorVect;
  this.ctx.putImageData(newData,0,0);

  for (var i = 0; i < this.previousZooms.length; i++) {
    this.previousZooms[i].data = rotateColorData(
      this.ctx,
      this.previousZooms[i].data,
      newColorVect
    )
  }
};

module.exports = MandelbrotImage;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var mandelCanvEl = document.getElementById('mandelbrot-canvas'),
    colorGradEl = document.getElementById('color-canvas'),
    zoomButton = document.getElementById('zoom-out'),
    GameView = __webpack_require__(1),
    mandel = new GameView(mandelCanvEl,colorGradEl,zoomButton);

setTimeout(mandel.launch.bind(mandel), 50);

var infoHeaders = document.getElementsByClassName('info-header'),
    infoContent = document.getElementsByClassName('info-section');

infoHeaders = Array.prototype.slice.call(infoHeaders, 0, infoHeaders.length);
infoContent = Array.prototype.slice.call(infoContent, 0, infoContent.length);


function displaySection(idx) {
  infoContent.forEach(function(el, i) {
    if(idx == i) {
      el.style.display = "block";
    } else {
      el.style.display = "none";
    }
  });
}

infoHeaders.forEach(function(el, idx) {
  el.onclick = function(e) {
    e.preventDefault();
    displaySection(idx);
  };
});
displaySection(0);


/***/ })
/******/ ]);
//# sourceMappingURL=mandelbrot_bundle.js.map