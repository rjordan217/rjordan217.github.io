var canvasEl = document.getElementById('pool-canvas');
var ctx = canvasEl.getContext('2d');


GET_MOUSE_POS = function(e) {
    var rect = canvasEl.getBoundingClientRect();
    return [ e.clientX - rect.left, e.clientY - rect.top ];
};

DIM_X = canvasEl.width;
DIM_Y = canvasEl.height;
var toSize = Math.min(DIM_X / 2, DIM_Y);
REL_DIM = toSize / 1.2;

var GameView = require('./lib/game_view');
var newGame = new GameView(ctx);
