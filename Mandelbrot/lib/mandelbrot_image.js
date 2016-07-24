var squareAndAddComplexNum = require('./complex_utils').squareAndAddComplexNum,
    magnitude = require('./complex_utils').magnitude,
    iterate = require('./complex_utils').iterate,
    inCardioid = require('./complex_utils').inCardioid,
    inMainDisk = require('./complex_utils').inMainDisk;

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
