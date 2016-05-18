var GameViewElements = {
  scoreboard: '<div class="scoreboard"></div>',
  startPrompt: {
    container: '<ul class="start-prompt"></ul>',
    twoPlayerStart: '<li id="start-two-game">Start 2P Game</li>',
    displayInstructions: '<li id="display-instructions">Display Instructions</li>',
    nameForm: '<form>\
      <label class="enter-name">Name: <input type="text" id="player_name" /></label>\
      <input type="submit" />\
    </form>',
    instructions: '<div class="instructions">Instructionzzz</div>'
  },
  gameOverPrompt: '<div class="game-over"></div>'
};

module.exports = GameViewElements;
