var GameView = require("./lib/gameView");

var canvasEl = document.getElementById("asteroids-canvas");
var ctx = canvasEl.getContext('2d');
ctx.font = "30px Arial";
ctx.fillText("Start Fishteroids", canvasEl.width / 2 - 125,canvasEl.height / 2 - 15);
canvasEl.addEventListener("click", function() {
  var nouveau = new GameView(canvasEl);
  nouveau.bindKeyHandlers();
  nouveau.start();
});
