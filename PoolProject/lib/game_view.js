var GameViewElements = require('./game_view_elements'),
    Game = require('./game');

var GameView = function() {
  this.$poolGame = $('.pool-game');
  this.$overlay = $(GameViewElements.overlay);
  this.$scoreboard = $(GameViewElements.scoreboard);
  this.launch();
};

GameView.prototype.launch = function () {
  var $canvasEl = $(GameViewElements.canvasEl),
      canvasEl = $canvasEl[0];

  this.$poolGame.empty();
  this.$poolGame.append($canvasEl);

  this.playerNames = [];

  GET_MOUSE_POS = function(e) {
    var rect = canvasEl.getBoundingClientRect();
    return [ e.clientX - rect.left, e.clientY - rect.top ];
  };

  this.game = new Game(
    canvasEl.getContext('2d'),
    this.displayScore.bind(this),
    this.gameLost.bind(this),
    this.gameOver.bind(this)
  );
  this.$poolGame.append(this.$overlay);
  this.startPrompt();
};

GameView.prototype.startPrompt = function () {
  var promptEls = GameViewElements.startPrompt;
  var $startPrompt = $(promptEls.container),
      $twoP = $(promptEls.twoPlayerStart),
      $clickForInstr = $(promptEls.displayInstructions);

  function getNames(e) {
    var $nameForm = $(promptEls.nameForm);

    e.preventDefault();
    $nameForm.prepend($('<h2 id="which-player">Player 1</h2>'));
    $nameForm.submit(this.submitName.bind(this));

    $startPrompt.empty();
    $startPrompt.append($nameForm);
  }

  $twoP.on("click", getNames.bind(this));
  $clickForInstr.on("click", this.showInstructions.bind(this, $startPrompt, true));

  $startPrompt.append($twoP),
  $startPrompt.append($clickForInstr);

  this.$poolGame.append($startPrompt);
};

GameView.prototype.submitName = function (e) {
  e.preventDefault();
  var $nameInput = $('#player_name');
  var nextName = $nameInput.val() || "Player" + (this.playerNames.length + 1);
  this.playerNames.push(nextName);
  if (this.playerNames.length < 2) {
    $nameInput.val("");
    $('#which-player').html('Player ' + (this.playerNames.length + 1));
  } else {
    this.startGame(this.canvasEl);
  }
};

GameView.prototype.startGame = function () {
  $('.start-prompt').remove();
  this.$overlay.remove();

  this.addHelpButton();

  this.game.addPlayers(this.playerNames);
  this.game.startGame();
};

GameView.prototype.addHelpButton = function () {
  var $container = $(GameViewElements.startPrompt.container),
      $helpButton = $(GameViewElements.helpButton);

  $helpButton.on("mousedown", function(e) {
    e.stopPropagation();
    this.game.disableCuestick();
    this.$poolGame.append(this.$overlay);
    this.showInstructions($container, false, e);
    this.$poolGame.append($container);
  }.bind(this));

  this.$poolGame.append($helpButton);
};

GameView.prototype.showInstructions = function ($container, fromStartPrompt, e) {
  e.preventDefault();

  var $instructions = $(GameViewElements.startPrompt.instructions),
      $backButton = $(GameViewElements.backButton);

  $backButton.on("click", function(e) {
    e.preventDefault();
    $container.remove();
    if(fromStartPrompt) {
      this.startPrompt();
    } else {
      this.$overlay.remove();
      this.game.enableCuestick();
    }
  }.bind(this));

  $instructions.prepend($backButton);

  $container.empty();
  $container.append($instructions);
};

GameView.prototype.displayScore = function (player1Score, player2Score, currentPlayer) {
  function firstName(fullName) {
    return fullName.match(/\w+/)[0];
  }

  var firstIsCurrent = (0 == currentPlayer),
      secIsCurrent = !firstIsCurrent;

  var scoresAndCurrentPlayer = (firstIsCurrent ? "▶ " : "") +
    firstName(this.playerNames[0]) + ": " + player1Score + "<br>" +
    (secIsCurrent ? "▶ " : "") + firstName(this.playerNames[1]) + ": " + player2Score;

  this.$scoreboard.html(
    "<h3>Scores</h3><p>" + scoresAndCurrentPlayer + "</p>"
  );
  this.$poolGame.append(this.$scoreboard);
};

GameView.prototype.gameLost = function (loserIdx) {
  var $gameLost = $(GameViewElements.gameLost);
  $gameLost.append('<h2>Sorry, ' + this.playerNames[loserIdx] + ', you lost!</h2>');

  this.$poolGame.append(this.$overlay);
  this.$poolGame.append($gameLost);

  setTimeout(function() {
    $gameLost.remove();
    this.gameOver((loserIdx + 1) % 2);
  }.bind(this), 5000);
};

GameView.prototype.gameOver = function (winnerIdx) {
  var $gameOverPrompt = $(GameViewElements.gameOverPrompt),
      $playAgainButton = $(GameViewElements.playAgainButton);

  $gameOverPrompt.html("<h2>Congratulations, " + this.playerNames[winnerIdx] +
    "!<br>You won!</h2>");
  $playAgainButton.on("click", function(e) {
    e.preventDefault();
    this.launch();
  }.bind(this));
  $gameOverPrompt.append($playAgainButton);

  this.$poolGame.append($gameOverPrompt);
  this.$poolGame.append(this.$overlay);
};

module.exports = GameView;
