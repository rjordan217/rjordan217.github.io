/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	DIM_X = 1100;
	DIM_Y = 700;
	var toSize = Math.min(DIM_X / 2, DIM_Y);
	
	REL_DIM = toSize / 1.2;
	
	var GameView = __webpack_require__(1);
	var newGame = new GameView();


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var GameViewElements = __webpack_require__(2),
	    Game = __webpack_require__(3);
	
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
	  this.game.addPlayers(this.playerNames);
	  this.game.startGame();
	};
	
	GameView.prototype.displayScore = function (player1Score, player2Score) {
	  function firstName(fullName) {
	    return fullName.match(/\w+/)[0];
	  }
	  this.$scoreboard.html(
	    "<h3>Scores</h3><p>" + firstName(this.playerNames[0]) + ": " +
	    player1Score + "<br>" + firstName(this.playerNames[1]) + ": " + player2Score
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


/***/ },
/* 2 */
/***/ function(module, exports) {

	var GameViewElements = {
	  canvasEl: '<canvas id="pool-canvas" width="' + DIM_X + '" height="' + DIM_Y + '"></canvas>',
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
	  gameOverPrompt: '<div class="game-over"></div>',
	  playAgainButton: '<button class="play-again">Play Again</button>'
	};
	
	module.exports = GameViewElements;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Patterns = __webpack_require__(4),
	    Player = __webpack_require__(5),
	    Hole = __webpack_require__(6),
	    Ball = __webpack_require__(7),
	    Cuestick = __webpack_require__(12);
	
	TOP_LEFT = [DIM_X / 2 - REL_DIM, (DIM_Y - REL_DIM) / 2];
	BOTTOM_RIGHT = [DIM_X / 2 + REL_DIM, (DIM_Y + REL_DIM) / 2];
	BALL_RADIUS = REL_DIM * .04222;
	
	var BallConstants = __webpack_require__(13).NineBall;
	
	var Game = function(ctx, scoreCB, gameLostCB, gameOverCB) {
	  this.ctx = ctx;
	  this.ctx.font = "" + (2 * BALL_RADIUS / 3) + "px Arial";
	  this.scoreCB = scoreCB;
	  this.gameLostCB = gameLostCB;
	  this.gameOverCB = gameOverCB;
	
	  this.ballArray = [];
	  BallConstants.map(function(ballConstant) {
	    return {
	      color: ballConstant.color.slice(0,ballConstant.color.length),
	      number: ballConstant.number,
	      pos: ballConstant.pos.slice(0,2)
	    };
	  }).forEach(function(ball) {
	    this.ballArray.push(new Ball(ball));
	  }.bind(this));
	  this.cueball = this.ballArray[0];
	
	  this.holeArray = [];
	  var HOLES = ['ul', 'um', 'ur', 'll', 'lm', 'lr'];
	  HOLES.forEach(function(holeId) {
	    this.holeArray.push(new Hole(holeId));
	  }.bind(this));
	
	  this.sunkBalls = [];
	  this.currentPlayer = 0;
	
	  this.patterns = new Patterns(ctx,this.drawTable.bind(this));
	
	  this.cuestick = new Cuestick(this.cueball);
	
	  FORCE_OVER = this.gameOver.bind(this);
	};
	
	Game.prototype.addPlayers = function (playerNames) {
	  this.players = [];
	  var playerNumber = 1;
	  playerNames.forEach(function(name) {
	    this.players.push(new Player(playerNumber, name, this));
	    playerNumber++;
	  }.bind(this));
	};
	
	Game.prototype.startGame = function () {
	  this.cuestick.bindKeys(this.drawTable.bind(this), this.runTurn.bind(this));
	  this.updateScore();
	  this.startTurn();
	};
	
	Game.prototype.startTurn = function () {
	  this.cuestick.updateCueball(this.cueball);
	  this.drawTable();
	};
	
	Game.prototype.runTurn = function () {
	  var anyAreMobile = 1;
	  var self = this;
	  var samePlayer = this.currentPlayer;
	  var drawTable = this.drawTable.bind(this);
	  var toClear;
	  function callback() {
	    cancelAnimationFrame(toClear);
	    self.currentPlayer = (self.currentPlayer + 1) % 2;
	    var ballArray = self.ballArray;
	    var holeArray = self.holeArray;
	    if (anyAreMobile) {
	      var sunkArray = [];
	      anyAreMobile = 0;
	      ballArray.forEach(function(ball,idx) {
	        if (ball.runCourse(ballArray,holeArray)) anyAreMobile++;
	        if (ball.isSunk) sunkArray.push({index: idx,ball: ball});
	      });
	      ballArray.forEach(function(ball) {
	        ball.resetCollidedWith();
	      });
	      ballArray.forEach(function(ball) {
	        ball.ensurePointCollision(ballArray);
	      });
	      var offset = 0;
	      var playsAgain = true;
	      sunkArray.forEach(function(ballObj) {
	        if(ballObj.index === 0) {
	          self.cueball.pos = [ DIM_X / 2 + REL_DIM / 2, DIM_Y / 2 ];
	          self.cueball.isSunk = false;
	          self.currentPlayer = (self.currentPlayer + 1) % 2;
	          playsAgain = false;
	        } else {
	          self.ballArray.splice(ballObj.index - offset, 1);
	          self.sunkBalls.push(ballObj.ball);
	          self.players[samePlayer].sinkBall(ballObj.ball);
	          if(playsAgain) self.currentPlayer = samePlayer;
	          offset++;
	        }
	        self.updateScore();
	        self.updateNextTarget();
	      });
	      toClear = requestAnimationFrame(function() {
	        drawTable();
	        callback();
	      });
	    } else {
	      toClear = requestAnimationFrame(function() {
	        drawTable();
	        self.startTurn();
	      });
	    }
	  }
	  toClear = requestAnimationFrame(callback);
	};
	
	Game.prototype.updateNextTarget = function () {
	  this.players[0].updateNextBall(this.ballArray[1].number);
	  this.players[1].updateNextBall(this.ballArray[1].number);
	};
	
	Game.prototype.updateScore = function () {
	  this.scoreCB(this.players[0].points, this.players[1].points);
	};
	
	Game.prototype.calculateWinner = function () {
	  var currentsPoints = this.players[this.currentPlayer].points,
	      otherPlayerIdx = (this.currentPlayer + 1) % 2,
	      othersPoints = this.players[otherPlayerIdx].points;
	
	  return (currentsPoints >= othersPoints ? this.currentPlayer : otherPlayerIdx);
	};
	
	Game.prototype.gameOver = function () {
	  this.cuestick.disabled = true;
	  this.cuestick.unbindKeys();
	  this.drawTable();
	  this.gameOverCB(this.calculateWinner());
	};
	
	Game.prototype.gameLost = function () {
	  this.cuestick.disabled = true;
	  this.cuestick.unbindKeys();
	  this.drawTable();
	  this.gameLostCB(this.currentPlayer);
	};
	
	Game.prototype.drawTable = function () {
	  var ctx = this.ctx;
	  ctx.clearRect(0,0,DIM_X,DIM_Y);
	  ctx.fillStyle = this.patterns.woodPattern;
	  ctx.fillRect(0, 0, DIM_X, DIM_Y);
	  ctx.fill();
	  ctx.fillStyle = this.patterns.feltPattern;
	  ctx.fillRect( TOP_LEFT[0], TOP_LEFT[1], 2 * REL_DIM, REL_DIM );
	  ctx.fill();
	
	  this.holeArray.forEach(function(hole) {
	    hole.draw(ctx);
	  });
	
	  this.ballArray.forEach(function(ball) {
	    ball.draw(ctx);
	  });
	
	  if(this.cuestick) {
	    this.cuestick.draw(ctx);
	  }
	};
	
	module.exports = Game;


/***/ },
/* 4 */
/***/ function(module, exports) {

	var Patterns = function(ctx, imagesLoadedCB) {
	  var woodImage = new Image();
	  woodImage.src ='./res/wood-pattern.png';
	  var greenFelt = new Image();
	  greenFelt.src = './res/pool_table.jpeg';
	  var imagesLoaded = 0;
	  woodImage.onload = function() {
	    this.woodPattern = ctx.createPattern(woodImage, 'repeat');
	    imagesLoaded++;
	    if(imagesLoaded === 2) imagesLoadedCB();
	  }.bind(this);
	  greenFelt.onload = function() {
	    this.feltPattern = ctx.createPattern(greenFelt, 'repeat');
	    imagesLoaded++;
	    if(imagesLoaded === 2) imagesLoadedCB();
	  }.bind(this);
	};
	
	module.exports = Patterns;


/***/ },
/* 5 */
/***/ function(module, exports) {

	var Player = function(id, nickname, game) {
	  this.id = id;
	  this.nickname = nickname || "Player " + id;
	  this.nextBallNumber = 1;
	  this.points = 0;
	  this.game = game;
	};
	
	Player.prototype.sinkBall = function (ball, gameOverCB) {
	  if(ball.number === this.nextBallNumber) {
	    this.points++;
	    if(ball.number === 9) this.game.gameOver();
	  } else if (ball.number === 9) {
	    this.points = 0;
	    this.game.gameLost();
	  }
	};
	
	Player.prototype.updateNextBall = function (nextNumber) {
	  this.nextBallNumber = nextNumber;
	};
	
	module.exports = Player;


/***/ },
/* 6 */
/***/ function(module, exports) {

	var Hole = function(position) {
	  this.radius = REL_DIM * .08444; // 114 mm / 1.35 m ~= diameter / table width
	  this.pos = [];
	  this.idString = position;
	  switch (position) {
	    case 'ul':
	      this.pos.push(DIM_X / 2 - REL_DIM);
	      this.pos.push((DIM_Y - REL_DIM) / 2);
	      break;
	    case 'um':
	      this.pos.push(DIM_X / 2);
	      this.pos.push((DIM_Y - REL_DIM) / 2);
	      break;
	    case 'ur':
	      this.pos.push(DIM_X / 2 + REL_DIM);
	      this.pos.push((DIM_Y - REL_DIM) / 2);
	      break;
	    case 'll':
	      this.pos.push(DIM_X / 2 - REL_DIM);
	      this.pos.push((DIM_Y + REL_DIM) / 2);
	      break;
	    case 'lm':
	      this.pos.push(DIM_X / 2);
	      this.pos.push((DIM_Y + REL_DIM) / 2);
	      break;
	    case 'lr':
	      this.pos.push(DIM_X / 2 + REL_DIM);
	      this.pos.push((DIM_Y + REL_DIM) / 2);
	      break;
	  }
	};
	
	Hole.prototype.draw = function (ctx) {
	  ctx.fillStyle = "#000000";
	  ctx.beginPath();
	
	  ctx.arc(
	    this.pos[0],
	    this.pos[1],
	    this.radius,
	    0,
	    2 * Math.PI,
	    false
	  );
	
	  ctx.fill();
	};
	
	module.exports = Hole;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var Utils = __webpack_require__(8),
	    Collidable = __webpack_require__(9),
	    VectorUtils = __webpack_require__(10),
	    Accelerable = __webpack_require__(11);
	
	var Ball = function(options) {
	  this.number = options.number;
	  this.isSunk = false;
	  this.pos = options.pos;
	  this.color = options.color;
	  this.radius = BALL_RADIUS;
	  this.vel = [0, 0];
	  this.collidedWith = [];
	  this.textOffset = BALL_RADIUS / 3;
	};
	
	Utils.implementsModule(Ball, Collidable);
	Utils.implementsModule(Ball, Accelerable);
	
	Ball.prototype.runCourse = function (ballArray, holeArray) {
	  if (Math.abs(this.vel[0]) > 0 || Math.abs(this.vel[1]) > 0) {
	    this.move();
	    if(this.collidedWithXWall()) {
	      this.changeXDir();
	    }
	    if(this.collidedWithYWall()) {
	      this.changeYDir();
	    }
	    ballArray.forEach(function(otherBall) {
	      if(this.collidedWithBall(otherBall) && !otherBall.collidedWith.includes(this)) {
	        this.collidedWith.push(otherBall);
	        this.exchangeMomentum(otherBall);
	      }
	    }.bind(this));
	    holeArray.forEach(function(hole) {
	      if(this.isInHole(hole)) {
	        this.sink(hole);
	      }
	    }.bind(this));
	    this.friction();
	
	    return true;
	  } else {
	    return false;
	  }
	};
	
	Ball.prototype.resetCollidedWith = function () {
	  this.collidedWith = [];
	};
	
	Ball.prototype.sink = function (hole) {
	  var distancia = VectorUtils.distance(this.pos,hole.pos);
	  this.isSunk = true;
	  this.vel = [0,0];
	};
	
	
	Ball.prototype.draw = function (ctx) {
	  ctx.fillStyle = this.color;
	  ctx.beginPath();
	
	  ctx.arc(
	    this.pos[0],
	    this.pos[1],
	    this.radius,
	    0,
	    2 * Math.PI,
	    false
	  );
	
	  ctx.fill();
	
	  if(this.number) {
	    ctx.fillStyle = '#ffffff';
	    ctx.beginPath();
	
	    ctx.arc(
	      this.pos[0],
	      this.pos[1],
	      this.radius / 2,
	      0,
	      2 * Math.PI,
	      false
	    );
	
	    ctx.fill();
	
	    ctx.fillStyle = "#000000";
	    ctx.fillText(
	      this.number,
	      this.pos[0] - 3.5,
	      this.pos[1] + 4.5
	    );
	
	    if(this.number > 8) {
	      ctx.fillStyle = "#ffffff";
	      ctx.beginPath();
	
	      ctx.arc(
	        this.pos[0],
	        this.pos[1],
	        this.radius,
	        -Math.PI / 3,
	        Math.PI / 3,
	        false
	      );
	      ctx.fill();
	
	      ctx.beginPath();
	      ctx.arc(
	        this.pos[0],
	        this.pos[1],
	        this.radius,
	        2 * Math.PI / 3,
	        4 * Math.PI / 3,
	        false
	      );
	
	      ctx.fill();
	    }
	  }
	
	  var pos = this.pos,
	  rad = this.radius;
	  gradient = ctx.createLinearGradient(pos[0] - rad, pos[1] - rad, pos[0] + rad, pos[1] + rad);
	
	  gradient.addColorStop(0, 'rgba(0,0,0,0)');
	  gradient.addColorStop(1, 'rgba(0,0,0,.3)');
	
	  ctx.fillStyle = gradient;
	
	  ctx.beginPath();
	
	  ctx.arc(
	    this.pos[0],
	    this.pos[1],
	    this.radius,
	    0,
	    2 * Math.PI,
	    false
	  );
	
	  ctx.fill();
	
	};
	
	module.exports = Ball;


/***/ },
/* 8 */
/***/ function(module, exports) {

	var Utils = {
	  inherits: function(Parent, Child) {
	    var Surrogate = function(){};
	    Surrogate.prototype = Parent.prototype;
	    Child.prototype = new Surrogate();
	    Child.prototype.constructor = Child;
	  },
	  implementsModule: function(inheritor, modulo) {
	    Object.keys(modulo).forEach(function(key) {
	      inheritor.prototype[key] = modulo[key];
	    });
	  }
	};
	
	module.exports = Utils;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var VectorUtils = __webpack_require__(10);
	
	var Collidable = {
	  move: function() {
	    this.pos[0] += this.vel[0];
	    this.pos[1] += this.vel[1];
	  },
	
	
	  changeXDir: function() {
	    this.vel[0] *= -1;
	  },
	
	  changeYDir: function() {
	    this.vel[1] *= -1;
	  },
	
	  changeDirByAngle: function(angle) {
	    var rads = angle / 180 * Math.PI;
	    var xVel = this.vel[0];
	    var yVel = this.vel[1];
	    var original;
	    var speed = VectorUtils.magnitude(this.vel);
	    if (xVel !== 0) {
	      original = Math.atan2(yVel, xVel);
	      if (xVel < 0) original += Math.PI;
	    } else {
	      if (yVel < 0) {
	        original = - Math.PI;
	      } else {
	        original = Math.PI;
	      }
	    }
	    this.vel[0] = speed * Math.cos(original + rads);
	    this.vel[1] = speed * Math.sin(original + rads);
	  },
	
	  collidedWithBall: function(otherBall) {
	    var distancia = VectorUtils.distance(this.pos, otherBall.pos)
	    if (distancia < (this.radius + otherBall.radius)) {
	      if (this.pos[0] !== otherBall.pos[0] || this.pos[1] !== otherBall.pos[1]) {
	        return true;
	      } else {
	        return false;
	      }
	    } else {
	      return false;
	    }
	  },
	
	  collidedWithXWall: function() {
	    if(this.isSunk) {
	      return false;
	    }
	    var x = this.pos[0],
	        radius = this.radius;
	    if (x - radius < TOP_LEFT[0]) {
	      this.pos[0] = TOP_LEFT[0] + radius;
	      return true;
	    }
	    if(x + radius > BOTTOM_RIGHT[0]) {
	      this.pos[0] = BOTTOM_RIGHT[0] - radius;
	      return true;
	    }
	    return false;
	  },
	
	  collidedWithYWall: function() {
	    if(this.isSunk) {
	      return false;
	    }
	    var y = this.pos[1],
	        radius = this.radius;
	    if (y - radius < TOP_LEFT[1]) {
	      this.pos[1] = TOP_LEFT[1] + radius;
	      return true;
	    }
	    if(y + radius > BOTTOM_RIGHT[1]) {
	      this.pos[1] = BOTTOM_RIGHT[1] - radius;
	      return true;
	    }
	    return false;
	  },
	
	  isInHole: function(hole) {
	    if (VectorUtils.distance(this.pos, hole.pos) < hole.radius) {
	      return true;
	    } else {
	      return false;
	    }
	  },
	
	  exchangeMomentum: function(otherBall) {
	    var velDiff1 = VectorUtils.vectorDiff(this.vel, otherBall.vel),
	        locDiff1 = VectorUtils.vectorDiff(this.pos, otherBall.pos),
	        radMagSq = Math.pow(VectorUtils.magnitudeOf(locDiff1),2),
	        velDiff2 = VectorUtils.negativeOf(velDiff1),
	        locDiff2 = VectorUtils.negativeOf(locDiff1),
	        coef = VectorUtils.dotProduct(velDiff1,locDiff1) / radMagSq;
	
	    this.vel = VectorUtils.vectorDiff(this.vel, VectorUtils.scale(coef, locDiff1));
	    otherBall.vel = VectorUtils.vectorDiff(otherBall.vel, VectorUtils.scale(coef, locDiff2));
	  },
	
	  ensurePointCollision: function(ballArray) {
	    ballArray.forEach(function(otherBall) {
	      if (this.collidedWithBall(otherBall)) {
	        var distance = VectorUtils.distance(this.pos, otherBall.pos),
	        scaledRad = VectorUtils.scale(2 * this.radius / distance, VectorUtils.radialOf(this.pos, otherBall.pos));
	
	        this.pos = VectorUtils.vectorSum(otherBall.pos,VectorUtils.negativeOf(scaledRad));
	      }
	    }.bind(this));
	  }
	};
	
	module.exports = Collidable;


/***/ },
/* 10 */
/***/ function(module, exports) {

	var VectorUtils = {
	  distance: function(pos1,pos2) {
	    var x1 = pos1[0],
	        y1 = pos1[1],
	        x2 = pos2[0],
	        y2 = pos2[1];
	
	    return Math.sqrt(Math.pow((x2 - x1),2) + Math.pow((y2 - y1),2));
	  },
	
	  directionOf: function(vector) {
	      return Math.atan2(vector[1],vector[0]);
	  },
	
	  magnitudeOf: function(vector) {
	    return Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
	  },
	
	  radialOf: function(v1,v2) {
	    return [ v2[0] - v1[0], v2[1] - v1[1] ];
	  },
	
	  vectorSum: function(v1,v2) {
	    return [ v1[0] + v2[0], v1[1] + v2[1] ];
	  },
	
	  vectorDiff: function(v1,v2) {
	    return [ v1[0] - v2[0], v1[1] - v2[1] ];
	  },
	
	  negativeOf: function(vector) {
	    return [ -vector[0], -vector[1] ];
	  },
	
	  dotProduct: function(v1,v2) {
	    return v1[0] * v2[0] + v1[1] * v2[1];
	  },
	
	  scale: function(factor, vector) {
	    return [ factor * vector[0], factor * vector[1] ];
	  }
	};
	
	module.exports = VectorUtils;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var VectorUtils = __webpack_require__(10);
	
	var Accelerable = {
	  accelerate: function(rate) {
	    this.vel[0] += rate[0];
	    this.vel[1] += rate[1];
	  },
	  friction: function() {
	    var frictionDir = Math.PI + VectorUtils.directionOf(this.vel);
	    this.vel[0] += .03 * Math.cos(frictionDir);
	    this.vel[1] += .03 * Math.sin(frictionDir);
	    if (Math.abs(this.vel[0]) < .1) {
	      this.vel[0] = 0;
	    }
	    if (Math.abs(this.vel[1]) < .1) {
	      this.vel[1] = 0;
	    }
	  }
	};
	
	module.exports = Accelerable;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var VectorUtils = __webpack_require__(10);
	
	var Cuestick = function(cueball) {
	  this.centeredOn = cueball.pos.slice();
	  this.cueball = cueball;
	  this.angle = 0;
	  this.drawn = 0;
	  this.disabled = false;
	};
	
	Cuestick.prototype.rotate = function (direction) {
	  this.angle += direction * Math.PI / 90;
	};
	
	Cuestick.prototype.drawBack = function (direction) {
	  if(this.drawn <= 0 && direction === -1) {
	    this.drawn = 0;
	  } else if (this.drawn <= 100) {
	    this.drawn += 1 * direction;
	  }
	};
	
	Cuestick.prototype.impartMomentum = function (power) {
	  this.cueball.vel = [ - power / 10 * Math.cos(this.angle), - power / 10 * Math.sin(this.angle) ];
	};
	
	Cuestick.prototype.fire = function(renderCB, turnCallback) {
	  var self = this;
	  var originalDrawn = this.drawn;
	  this.disabled = true;
	
	  function _fire(callback) {
	    if(self.drawn > -BALL_RADIUS) {
	      self.drawn -= 10;
	      callback();
	      _fire(callback);
	    } else {
	      self.impartMomentum(originalDrawn);
	      self.resetDrawn();
	      turnCallback();
	    }
	  }
	  _fire(renderCB);
	};
	
	Cuestick.prototype.resetDrawn = function () {
	  this.drawn = 0;
	};
	
	Cuestick.prototype.keyBinder = function (renderCB, turnCB, e) {
	  e.preventDefault();
	  if(!this.disabled) {
	    switch (e.keyCode) {
	      case 40:
	        this.drawBack(1);
	        renderCB();
	        break;
	      case 38:
	        this.drawBack(-1);
	        renderCB();
	        break;
	      case 37:
	        this.rotate(1);
	        renderCB();
	        break;
	      case 39:
	        this.rotate(-1);
	        renderCB();
	        break;
	      case 32:
	        this.fire(renderCB, turnCB);
	        break;
	    }
	  }
	};
	
	Cuestick.prototype.clickedBinder = function (renderCB, e) {
	  e.preventDefault();
	  if(!this.disabled) {
	    this.clickedFunc = setInterval(function() {
	      this.drawBack(1);
	      renderCB();
	    }.bind(this),25)
	  }
	};
	
	Cuestick.prototype.unclickedBinder = function (e) {
	  e.preventDefault();
	  clearInterval(this.clickedFunc);
	};
	
	Cuestick.prototype.doubleClickBinder = function (renderCB, e) {
	  e.preventDefault();
	  if(!this.disabled) {
	    this.resetDrawn();
	    renderCB();
	  }
	};
	
	Cuestick.prototype.hoverBinder = function (renderCB, e) {
	  if(!this.disabled) {
	    var mousePos = GET_MOUSE_POS(e);
	    var radial = VectorUtils.radialOf(this.centeredOn, mousePos);
	    this.angle = VectorUtils.directionOf(radial);
	    renderCB();
	  }
	};
	
	Cuestick.prototype.bindKeys = function (renderCB, turnCB) {
	  this.keydownListener = this.keyBinder.bind(this,renderCB,turnCB);
	  document.addEventListener(
	    "keydown",
	    this.keydownListener,
	    true
	  );
	
	  this.mousedownListener = this.clickedBinder.bind(this, renderCB);
	  document.addEventListener(
	    "mousedown",
	    this.mousedownListener,
	    true
	  );
	
	  this.mouseupListener = this.unclickedBinder.bind(this);
	  document.addEventListener(
	    "mouseup",
	    this.mouseupListener,
	    true
	  );
	
	  this.mousemoveListener = this.hoverBinder.bind(this, renderCB);
	  document.addEventListener(
	    "mousemove",
	    this.mousemoveListener,
	    true
	  );
	
	  this.dblclickListener = this.doubleClickBinder.bind(this, renderCB);
	  document.addEventListener(
	    "dblclick",
	    this.dblclickListener,
	    true
	  );
	};
	
	Cuestick.prototype.unbindKeys = function () {
	  document.removeEventListener("keydown", this.keydownListener, true);
	  document.removeEventListener("mousedown", this.mousedownListener, true);
	  document.removeEventListener("mouseup", this.mouseupListener, true);
	  document.removeEventListener("mousemove", this.mousemoveListener, true);
	  document.removeEventListener("dblclick", this.dblclickListener, true);
	};
	
	Cuestick.prototype.updateCueball = function (newCueball) {
	  this.centeredOn = newCueball.pos.slice();
	  this.cueball = newCueball;
	  this.drawn = 0;
	  this.disabled = false;
	};
	
	Cuestick.prototype.draw = function (ctx) {
	  ctx.translate(this.centeredOn[0], this.centeredOn[1]);
	  ctx.rotate(this.angle);
	  ctx.fillStyle = '#ffca66';
	  ctx.fillRect(50 + this.drawn, -5, REL_DIM * 1.5, 10);
	  ctx.fillStyle = '#ffffff';
	  ctx.fillRect(50 + this.drawn, -5, 25, 10);
	  ctx.fillStyle = '#ff00ff';
	  ctx.fillRect(50 + this.drawn, -5, 5, 10);
	  ctx.rotate(-this.angle);
	  ctx.translate(-this.centeredOn[0], -this.centeredOn[1]);
	};
	
	module.exports = Cuestick;


/***/ },
/* 13 */
/***/ function(module, exports) {

	var TIP_OF_TRIANGLE = DIM_X / 2 - REL_DIM / 2;
	var Y_BASE = DIM_Y / 2;
	var DEL_X = BALL_RADIUS * Math.sqrt(3);
	
	var BallConstants = {
	  FifteenBall: [
	    { // Cueball
	      number: 0,
	      pos: [ DIM_X / 2 + REL_DIM / 2, Y_BASE ],
	      color: '#ffffff'
	    },
	    { // 1
	      number: 1,
	      pos: [ TIP_OF_TRIANGLE + 4, Y_BASE ],
	      color: 'yellow'
	    },
	    { // 2
	      number: 2,
	      pos: [ TIP_OF_TRIANGLE - DEL_X + 3, Y_BASE - BALL_RADIUS ],
	      color: 'blue'
	    },
	    { // 3
	      number: 3,
	      pos: [ TIP_OF_TRIANGLE - DEL_X + 3, Y_BASE + BALL_RADIUS ],
	      color: 'rgb(255,70,30)'
	    },
	    { // 4
	      number: 4,
	      pos: [ TIP_OF_TRIANGLE - 2 * DEL_X + 2, Y_BASE - 2 * BALL_RADIUS ],
	      color: 'rgb(255,0,255)'
	    },
	    { // 5
	      number: 5,
	      pos: [ TIP_OF_TRIANGLE - 2 * DEL_X + 2, Y_BASE ],
	      color: 'orange'
	    },
	    { // 6
	      number: 6,
	      pos: [ TIP_OF_TRIANGLE - 2 * DEL_X + 2, Y_BASE + 2 * BALL_RADIUS ],
	      color: 'rgb(0,200,0)'
	    },
	    { // 7
	      number: 7,
	      pos: [ TIP_OF_TRIANGLE - 3 * DEL_X + 1, Y_BASE - 3 * BALL_RADIUS ],
	      color: 'rgb(200,0,0)'
	    },
	    { // 8
	      number: 8,
	      pos: [ TIP_OF_TRIANGLE - 3 * DEL_X + 1, Y_BASE - BALL_RADIUS ],
	      color: '#000000'
	    },
	    { // 9
	      number: 9,
	      pos: [ TIP_OF_TRIANGLE - 3 * DEL_X + 1, Y_BASE + BALL_RADIUS ],
	      color: 'yellow'
	    },
	    { // 10
	      number: 10,
	      pos: [ TIP_OF_TRIANGLE - 3 * DEL_X + 1, Y_BASE + 3 * BALL_RADIUS ],
	      color: 'blue'
	    },
	    { // 11
	      number: 11,
	      pos: [ TIP_OF_TRIANGLE - 4 * DEL_X, Y_BASE - 4 * BALL_RADIUS ],
	      color: 'rgb(255,140,60)'
	    },
	    { // 12
	      number: 12,
	      pos: [ TIP_OF_TRIANGLE - 4 * DEL_X, Y_BASE - 2 * BALL_RADIUS ],
	      color: 'rgb(255,0,255)'
	    },
	    { // 13
	      number: 13,
	      pos: [ TIP_OF_TRIANGLE - 4 * DEL_X, Y_BASE ],
	      color: 'orange'
	    },
	    { // 14
	      number: 14,
	      pos: [ TIP_OF_TRIANGLE - 4 * DEL_X, Y_BASE + 2 * BALL_RADIUS ],
	      color: 'rgb(0,200,0)'
	    },
	    { // 15
	      number: 15,
	      pos: [ TIP_OF_TRIANGLE - 4 * DEL_X, Y_BASE + 4 * BALL_RADIUS ],
	      color: 'rgb(200,0,0)'
	    }
	  ],
	  NineBall: [
	    { // Cueball
	      number: 0,
	      pos: [ DIM_X / 2 + REL_DIM / 2, Y_BASE ],
	      color: '#ffffff'
	    },
	    { // 1
	      number: 1,
	      pos: [ TIP_OF_TRIANGLE + 4, Y_BASE ],
	      color: 'yellow'
	    },
	    { // 2
	      number: 2,
	      pos: [ TIP_OF_TRIANGLE - DEL_X + 3, Y_BASE - BALL_RADIUS ],
	      color: 'blue'
	    },
	    { // 3
	      number: 3,
	      pos: [ TIP_OF_TRIANGLE - DEL_X + 3, Y_BASE + BALL_RADIUS ],
	      color: 'rgb(255,70,30)'
	    },
	    { // 4
	      number: 4,
	      pos: [ TIP_OF_TRIANGLE - 2 * DEL_X + 2, Y_BASE - 2 * BALL_RADIUS ],
	      color: 'rgb(255,0,255)'
	    },
	    { // 5
	      number: 5,
	      pos: [ TIP_OF_TRIANGLE - 2 * DEL_X + 2, Y_BASE + 2 * BALL_RADIUS ],
	      color: 'orange'
	    },
	    { // 6
	      number: 6,
	      pos: [ TIP_OF_TRIANGLE - 3 * DEL_X + 1, Y_BASE - BALL_RADIUS ],
	      color: 'rgb(0,200,0)'
	    },
	    { // 7
	      number: 7,
	      pos: [ TIP_OF_TRIANGLE - 3 * DEL_X + 1, Y_BASE + BALL_RADIUS ],
	      color: 'rgb(200,0,0)'
	    },
	    { // 8
	      number: 8,
	      pos: [ TIP_OF_TRIANGLE - 4 * DEL_X, Y_BASE ],
	      color: '#000000'
	    },
	    { // 9
	      number: 9,
	      pos: [ TIP_OF_TRIANGLE - 2 * DEL_X + 2, Y_BASE ],
	      color: 'yellow'
	    }
	  ]
	};
	
	module.exports = BallConstants;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map