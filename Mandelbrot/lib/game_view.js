var MandelbrotImage = require('./mandelbrot_image'),
    ColorGrad = require('./color_grad');

var GameView = function(mandelCanvEl,colorCanvEl) {
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
  )
};

GameView.prototype.launch = function() {
  this.mandelCanvEl.ondblclick = function(e) {
    this.image.zoomOnPosition(
      e.offsetX * this.mandelCanvEl.width / this.mandelCanvEl.clientWidth,
      e.offsetY * this.mandelCanvEl.height / this.mandelCanvEl.clientHeight
    )
    this.image.draw()
  }.bind(this)

  this.image.draw();
  [].forEach.call(
    document.getElementsByClassName('loading'),
    function(el) {el.style.display = "none"}
  );
  this.mandelCanvEl.style.display = "block";
  var zoomOut = document.getElementById("zoom-out")
  zoomOut.onclick = this.image.zoomOut.bind(this.image)
  this.mandelCanvEl.parentElement.appendChild(zoomOut)

  this.colorGrad.launch(
    this.colorCanvEl.width / this.colorCanvEl.clientWidth,
    this.colorCanvEl.height / this.colorCanvEl.clientHeight
  )
};

module.exports = GameView;
