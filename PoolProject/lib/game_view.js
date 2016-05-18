var GameViewElements = require('./game_view_elements'),
    Game = require('./game');

var GameView = function(ctx) {
  this.$poolGame = $('.pool-game');
  this.playerNames = [];
  this.game = new Game(ctx);
  this.startPrompt();
  // TODO: Score-showing logic; pass callback to game to run every turn?
};

GameView.prototype.startPrompt = function () {
  var promptEls = GameViewElements.startPrompt;
  var $startPrompt = $(promptEls.container),
      $twoP = $(promptEls.twoPlayerStart),
      $clickForInstr = $(promptEls.displayInstructions);

  function getNames(e) {
    var $nameForm = $(promptEls.nameForm);

    e.preventDefault();
    $nameForm.prepend($('<h2 id="which-player">Player 1: Enter Name</h2>'));
    $nameForm.submit(this.submitName.bind(this));

    $startPrompt.empty();
    $startPrompt.append($nameForm);
  }

  function getInstructions(e) {
    e.preventDefault();

    var $instructions = $(promptEls.instructions);
    $startPrompt.empty();
    $startPrompt.append($instructions);
  }

  $twoP.on("click", getNames.bind(this));
  $clickForInstr.on("click", getInstructions);

  $startPrompt.append($twoP),
  $startPrompt.append($clickForInstr);

  this.$poolGame.append($startPrompt);
};

GameView.prototype.submitName = function (e) {
  e.preventDefault();
  var $nameInput = $('#player_name');
  this.playerNames.push($nameInput.val());
  if (this.playerNames.length < 2) {
    $nameInput.val("");
    $('#which-player').html('Player ' + (this.playerNames.length + 1) + ': Enter Name');
  } else {
    this.startGame();
  }
};

GameView.prototype.startGame = function () {
  $('.start-prompt').remove();
  console.log(this.playerNames);
  this.game.addPlayers(this.playerNames);
  this.game.startGame();
};

GameView.prototype.displayScore = function () {
  var $scoreboard = $(GameViewElements.scoreboard);
  $scoreboard.html("Meow");
  this.$poolGame.append($scoreboard);
};



module.exports = GameView;
