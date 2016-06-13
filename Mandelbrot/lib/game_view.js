var MandelbrotImage = require('./mandelbrot_image'),
    ZoomSlider = require('./zoom_slider');

var GameView = function(canvasEl) {
  this.canvasEl = canvasEl;
  this.image = new MandelbrotImage(canvasEl.getContext('2d'));
  this.slider = new ZoomSlider();
};

module.exports = GameView;
