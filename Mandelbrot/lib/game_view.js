var MandelbrotImage = require('./mandelbrot_image');

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
