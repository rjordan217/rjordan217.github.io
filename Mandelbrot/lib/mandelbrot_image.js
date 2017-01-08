var squareAndAddComplexNum = require('./complex_utils').squareAndAddComplexNum,
    magnitude = require('./complex_utils').magnitude,
    iterate = require('./complex_utils').iterate,
    inCardioid = require('./complex_utils').inCardioid,
    inMainDisk = require('./complex_utils').inMainDisk;

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
