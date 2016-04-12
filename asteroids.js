// var GameView = require("lib/gameView");

var canvasEl = document.getElementById("game-canvas");
var nouveau = new GameView(canvasEl);
nouveau.bindKeyHandlers();
nouveau.start();
