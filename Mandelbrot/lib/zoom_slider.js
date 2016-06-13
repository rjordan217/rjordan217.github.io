var ZoomSlider = function() {
  this.sliderContainer = document.getElementById('slider-container');
  this.sliderButton = document.getElementById('slider-button');

  this.bindMouse();
};

var buttonClicked = false;

ZoomSlider.prototype.bindMouse = function() {
  function onClick(e) {
    e.preventDefault();
    e.stopPropagation();
    buttonClicked = true;
  }

  function onMoveWithClick(e) {
    if(buttonClicked) {
      if(e.target.id === "slider-container") {
        this.sliderButton.setAttribute("style", "margin-left:" + (e.offsetX - 10) + "px");
      }
    }
  }

  function onUnclick(e) {
    e.preventDefault();
    e.stopPropagation();
    buttonClicked = false;
  }

  this.sliderButton.addEventListener(
    "mousedown",
    onClick
  );

  this.sliderContainer.addEventListener(
    "mousemove",
    onMoveWithClick.bind(this)
  );

  document.addEventListener(
    "mouseup",
    onUnclick
  );
};

module.exports = ZoomSlider;
