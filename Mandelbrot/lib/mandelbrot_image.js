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
