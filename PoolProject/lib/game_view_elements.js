var GameViewElements = {
  scoreboard: '<div class="scoreboard"></div>',
  overlay: '<div class="overlay"></div>',
  backButton: '<button class="back-button">◀</button>',
  startPrompt: {
    container: '<ul class="start-prompt"><h1>9 Ball Pool</h1></ul>',
    twoPlayerStart: '<li id="start-two-game">Start 2P Game</li>',
    displayInstructions: '<li id="display-instructions">Display Instructions</li>',
    nameForm: '<form>\
      <label class="enter-name">Enter Name: <input type="text" id="player_name" /></label>\
      <input type="submit" />\
    </form>',
    instructions: '<div class="instructions">\
      <h3>Instructions</h3>\
      <p>9-ball pool is a two player game in which players try to sink the balls\
 in numerical order to get points, ending with the 9 ball. At the end of the \
 game, the player with the most points wins.<br><br>Some caveats:<br>\
   -  To get points for sinking a ball, the cueball must strike it first that turn.<br>\
   -  Sinking the 9 ball before all other balls have been sunk results in immediate loss.<br><br>\
Controls: <br>\
  -  Reposition Cuestick: move cursor or use arrow keys when mouse stationary for \
more precision.<br>\
  -  Draw Back Cuestick: click and hold<br>\
  -  Reset Cuestick: double click<br>\
  -  Fire Cuestick: press *space*<br>\
  <span class="center">***</span></p>\
    </div>'
  },
  gameLost: '<div class="game-lost"><h2>You hit in the 9 ball!</h2></div>',
  gameOverPrompt: '<div class="game-over"></div>'
};

module.exports = GameViewElements;
