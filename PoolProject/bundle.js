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
	
	var GameView = __webpack_require__(12);
	var newGame = new GameView(ctx);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Patterns = __webpack_require__(2),
	    Player = __webpack_require__(3),
	    Hole = __webpack_require__(4),
	    Ball = __webpack_require__(5),
	    Cuestick = __webpack_require__(10);
	
	TOP_LEFT = [DIM_X / 2 - REL_DIM, (DIM_Y - REL_DIM) / 2];
	BOTTOM_RIGHT = [DIM_X / 2 + REL_DIM, (DIM_Y + REL_DIM) / 2];
	BALL_RADIUS = REL_DIM * .04222;
	
	var BallConstants = __webpack_require__(11).NineBall;
	
	var Game = function(ctx) {
	  this.ctx = ctx;
	  this.ctx.font = "" + (2 * BALL_RADIUS / 3) + "px Arial";
	
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
	};
	
	Game.prototype.addPlayers = function (playerNames) {
	  this.players = [];
	  var playerNumber = 1;
	  playerNames.forEach(function(name) {
	    this.players.push(new Player(playerNumber, name, this));
	    playerNumber++;
	  }.bind(this));
	  console.log(this.players);
	};
	
	Game.prototype.startGame = function () {
	  this.cuestick.bindKeys(this.drawTable.bind(this), this.runTurn.bind(this));
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
	      });
	      self.updateNextTarget();
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
	
	Game.prototype.gameOver = function () {
	  console.log(this.players[this.currentPlayer].nickname + " lost!");
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
/* 2 */
/***/ function(module, exports) {

	var Patterns = function(ctx, imagesLoadedCB) {
	  var woodImage = new Image();
	  woodImage.src ='./PoolProject/res/wood-pattern.png';
	  var greenFelt = new Image();
	  greenFelt.src = './PoolProject/res/pool_table.jpeg';
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
/* 3 */
/***/ function(module, exports) {

	var Player = function(id, nickname, game) {
	  this.id = id;
	  this.nickname = nickname || "Player " + id;
	  this.nextBallNumber = 1;
	  this.points = 0;
	  this.game = game;
	};
	
	Player.prototype.sinkBall = function (ball, gameOverCB) {
	  if(ball.number === this.nextBall) {
	    this.points++;
	    if(ball.number === 9) this.game.gameWon();
	  } else if (ball.number === 9) {
	    this.game.gameOver();
	  }
	};
	
	Player.prototype.updateNextBall = function (nextNumber) {
	  this.nextBallNumber = nextNumber;
	};
	
	Player.prototype.gameLost = function (gameOverCB) {
	  this.points = 0;
	  gameOverCB();
	};
	
	module.exports = Player;


/***/ },
/* 4 */
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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Utils = __webpack_require__(6),
	    Collidable = __webpack_require__(7),
	    VectorUtils = __webpack_require__(8),
	    Accelerable = __webpack_require__(9);
	
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
	
	};
	
	module.exports = Ball;


/***/ },
/* 6 */
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
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var VectorUtils = __webpack_require__(8);
	
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
	        // otherBall.pos = VectorUtils.vectorSum(otherBall.pos,scaledToRad);
	      }
	    }.bind(this));
	  }
	};
	
	module.exports = Collidable;


/***/ },
/* 8 */
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
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var VectorUtils = __webpack_require__(8);
	
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
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var VectorUtils = __webpack_require__(8);
	
	var Cuestick = function(cueball) {
	  this.centeredOn = cueball.pos.slice();
	  this.cueball = cueball;
	  this.angle = 0;
	  this.drawn = 0;
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
	
	  function _fire(callback) {
	    if(self.drawn > -30) {
	      self.drawn -= 10;
	      callback();
	      _fire(callback);
	    } else {
	      self.impartMomentum(originalDrawn);
	      self.drawn = -50;
	      turnCallback();
	    }
	  }
	  _fire(renderCB);
	};
	
	Cuestick.prototype.keyBinder = function (renderCB, turnCB, e) {
	  e.preventDefault();
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
	};
	
	Cuestick.prototype.clickedBinder = function (renderCB, e) {
	  e.preventDefault();
	  this.clickedFunc = setInterval(function() {
	    this.drawBack(1);
	    renderCB();
	  }.bind(this),25)
	};
	
	Cuestick.prototype.unclickedBinder = function (e) {
	  e.preventDefault();
	  clearInterval(this.clickedFunc);
	};
	
	Cuestick.prototype.hoverBinder = function (renderCB, e) {
	  var mousePos = GET_MOUSE_POS(e);
	  var radial = VectorUtils.radialOf(this.centeredOn, mousePos);
	  this.angle = VectorUtils.directionOf(radial);
	  renderCB();
	};
	
	Cuestick.prototype.bindKeys = function (renderCB, turnCB) {
	  document.addEventListener(
	    "keydown",
	    this.keyBinder.bind(this,renderCB,turnCB),
	    false
	  );
	  document.addEventListener(
	    "mousedown",
	    this.clickedBinder.bind(this, renderCB),
	    false
	  );
	  document.addEventListener(
	    "mouseup",
	    this.unclickedBinder.bind(this),
	    false
	  );
	  document.addEventListener(
	    "mousemove",
	    this.hoverBinder.bind(this, renderCB),
	    false
	  );
	};
	
	Cuestick.prototype.updateCueball = function (newCueball) {
	  this.centeredOn = newCueball.pos.slice();
	  this.cueball = newCueball;
	  this.drawn = 0;
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
/* 11 */
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


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var GameViewElements = __webpack_require__(13),
	    Game = __webpack_require__(1);
	
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


/***/ },
/* 13 */
/***/ function(module, exports) {

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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map