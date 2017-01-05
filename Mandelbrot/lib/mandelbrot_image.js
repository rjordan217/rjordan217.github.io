var squareAndAddComplexNum = require('./complex_utils').squareAndAddComplexNum,
    magnitude = require('./complex_utils').magnitude,
    iterate = require('./complex_utils').iterate,
    inCardioid = require('./complex_utils').inCardioid,
    inMainDisk = require('./complex_utils').inMainDisk;

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
