var canvasEl = document.getElementById('mandelbrot-canvas'),
    ctx = canvasEl.getContext('2d'),
    GameView = require('./lib/game_view');

DIM_X = 1200,
DIM_Y = 900;
var mandel = new GameView(canvasEl);
setTimeout(mandel.launch.bind(mandel), 50);
