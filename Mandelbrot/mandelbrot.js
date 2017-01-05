var canvasEl = document.getElementById('mandelbrot-canvas'),
    ctx = canvasEl.getContext('2d'),
    GameView = require('./lib/game_view'),
    mandel = new GameView(canvasEl);
    
setTimeout(mandel.launch.bind(mandel), 50);
