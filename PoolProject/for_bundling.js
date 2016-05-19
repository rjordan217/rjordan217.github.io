DIM_X = 1100;
DIM_Y = 700;
var toSize = Math.min(DIM_X / 2, DIM_Y);

REL_DIM = toSize / 1.2;

var GameView = require('./lib/game_view');
var newGame = new GameView();
