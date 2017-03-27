var MandelbrotImage = require('./mandelbrot_image'),
    ColorGrad = require('./color_grad');

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
  function zoomIn(e) {
    this.image.zoomOnPosition(
      e.offsetX * this.mandelCanvEl.width / this.mandelCanvEl.clientWidth,
      e.offsetY * this.mandelCanvEl.height / this.mandelCanvEl.clientHeight
    )
    this.image.draw()
    this.toggleZoom()
  }

  if(window.isMobile) {
    this.mandelCanvEl.addEventListener('touchstart',function(e) {
      this.dblTapped = this.dblTapped || false;
      if(this.dblTapped) {
        var rect = e.target.getBoundingClientRect();
        e.offsetX = e.targetTouches[0].clientX - rect.left;
        e.offsetY = e.targetTouches[0].clientY - rect.top;
        zoomIn.call(this,e);
        this.dblTapped = false;
      }
      setTimeout(function(){this.dblTapped = false}.bind(this),200)
      this.dblTapped = true;
    }.bind(this))
  } else {
    this.mandelCanvEl.ondblclick = zoomIn.bind(this)
  }

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
