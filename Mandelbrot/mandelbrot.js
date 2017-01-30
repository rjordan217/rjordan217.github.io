var mandelCanvEl = document.getElementById('mandelbrot-canvas'),
    colorGradEl = document.getElementById('color-canvas'),
    GameView = require('./lib/game_view'),
    mandel = new GameView(mandelCanvEl,colorGradEl);

setTimeout(mandel.launch.bind(mandel), 50);

var infoHeaders = document.getElementsByClassName('info-header'),
    infoContent = document.getElementsByClassName('info-section');

infoHeaders = Array.prototype.slice.call(infoHeaders, 0, infoHeaders.length);
infoContent = Array.prototype.slice.call(infoContent, 0, infoContent.length);


function displaySection(idx) {
  infoContent.forEach(function(el, i) {
    if(idx == i) {
      el.style.display = "block";
    } else {
      el.style.display = "none";
    }
  });
}

infoHeaders.forEach(function(el, idx) {
  el.onclick = function(e) {
    e.preventDefault();
    displaySection(idx);
  };
});
displaySection(0);
