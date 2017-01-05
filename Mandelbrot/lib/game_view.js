var MandelbrotImage = require('./mandelbrot_image');

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
