var canvasEl = document.getElementById('pool-canvas');
var ctx = canvasEl.getContext('2d');

ctx.font = "30px Arial";
ctx.fillText("Start Pool", canvasEl.width / 2 - 50,canvasEl.height / 2 - 15);

DIM_X = canvasEl.width;
DIM_Y = canvasEl.height;
var toSize = Math.min(DIM_X / 2, DIM_Y);
REL_DIM = toSize / 1.2;

var Game = require('./lib/game');
canvasEl.addEventListener("click", function() {
  var juego = new Game(ctx);
  juego.startTurn();
})
