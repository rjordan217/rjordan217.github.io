var GameViewElements = require('./game_view_elements'),
    Game = require('./game');

var GameView = function(ctx) {
  this.$poolGame = $('.pool-game');
  this.playerNames = [];
  this.game = new Game(
    ctx,
    this.displayScore.bind(this),
    this.gameLost.bind(this),
    this.gameOver.bind(this)
  );
  this.$overlay = $(GameViewElements.overlay);
  this.$scoreboard = $(GameViewElements.scoreboard);
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

  function getInstructions(e) {
    e.preventDefault();

    var $instructions = $(promptEls.instructions),
        $backButton = $(GameViewElements.backButton);

    $backButton.on("click", function(e) {
      e.preventDefault();
      $startPrompt.remove();
      this.startPrompt();
    }.bind(this));

    $instructions.prepend($backButton);

    $startPrompt.empty();
    $startPrompt.append($instructions);
  }

  $twoP.on("click", getNames.bind(this));
  $clickForInstr.on("click", getInstructions.bind(this));

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
    $('#which-player').html('Player ' + (this.playerNames.length + 1));
  } else {
    this.startGame();
  }
};

GameView.prototype.startGame = function () {
  $('.start-prompt').remove();
  this.$overlay.remove();
  this.game.addPlayers(this.playerNames);
  this.game.startGame();
};

GameView.prototype.displayScore = function (player1Score, player2Score) {
  function firstName(fullName) {
    return fullName.match(/\w+/)[0];
  }
  this.$scoreboard.html(
    "<h3>Scores</h3><p>" + firstName(this.playerNames[0]) + ": " +
    player1Score + ", " + firstName(this.playerNames[1]) + ": " + player2Score
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
  var $gameOverPrompt = $(GameViewElements.gameOverPrompt);
  $gameOverPrompt.html("<h2>Congratulations, " + this.playerNames[winnerIdx] +
    "!<br>You won!</h2>");
  this.$poolGame.append($gameOverPrompt);
  this.$poolGame.append(this.$overlay);
};

module.exports = GameView;
