/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var GameView = __webpack_require__(1);

	var canvasEl = document.getElementById("asteroids-canvas");
	var ctx = canvasEl.getContext('2d');
	ctx.font = "30px Arial";
	ctx.fillText("Start Fishteroids", canvasEl.width / 2 - 125,canvasEl.height / 2 - 15);
	canvasEl.addEventListener("click", function() {
	  var nouveau = new GameView(canvasEl);
	  nouveau.bindKeyHandlers();
	  nouveau.start();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(2);
	var key = __webpack_require__(8);

	var GameView = function(canvasEl) {
	  this.ctx = canvasEl.getContext("2d");
	  this.game = new Game(this.ctx);
	  this.game.addAsteroids();
	  this.background = new Image();
	  this.background.src = './AsteroidsProject/resources/lava.jpg';
	  this.background.onload = function () {
	    this.ctx.drawImage(this.background, 0, 0);
	  }.bind(this);
	};

	GameView.prototype.start = function(){
	  setInterval(function() {
	    this.game.step();
	    this.game.draw(this.ctx, this.background);
	  }.bind(this),20);
	};

	GameView.prototype.bindKeyHandlers = function(){
	  key('w', function(){ this.ship.power([0,-1]); }.bind(this.game));
	  key('a', function(){ this.ship.power([-1,0]); }.bind(this.game));
	  key('s', function(){ this.ship.power([0,1]); }.bind(this.game));
	  key('d', function(){ this.ship.power([1,0]); }.bind(this.game));
	  key('space', function(){ this.ship.fireBullet(); }.bind(this.game));
	};

	module.exports = GameView;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Asteroid = __webpack_require__(3);
	var Ship = __webpack_require__(6);
	var Bullet = __webpack_require__(7);


	var Game = function(ctx){
	  this.asteroids = [];
	  this.bullets = [];
	  this.ship = new Ship(this.randomPosition(), this);
	  this.allObjects = [this.ship];
	  this.ctx = ctx;
	};

	Game.DIM_X = 800;
	Game.DIM_Y = 400;
	Game.NUM_ASTEROIDS = 4;

	Game.prototype.addAsteroids = function(){
	  for(var i = 0; i < Game.NUM_ASTEROIDS; i++){
	    var newAsteroid = new Asteroid(this.randomPosition(), this);
	    this.asteroids.push(newAsteroid);
	    this.allObjects.push(newAsteroid);
	  }
	};

	Game.prototype.add = function(object) {
	  if (object instanceof Asteroid){
	    this.asteroids.push(object);
	  } else if(object instanceof Bullet){
	    this.bullets.push(object);
	  }
	  this.allObjects.push(object);
	};

	Game.prototype.randomPosition = function(){
	  var X = Math.random() * Game.DIM_X;
	  var Y = Math.random() * Game.DIM_Y;
	  return [X, Y];

	};

	Game.prototype.draw = function(ctx, background){
	  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
	  ctx.drawImage(background, 0, 0);
	  this.allObjects.forEach(function(object){
	    object.draw(ctx);
	  });
	};

	Game.prototype.moveObjects = function(){
	  this.allObjects.forEach(function(object){
	    object.move();
	  });
	};

	Game.prototype.wrap = function(pos){
	  var X;
	  var Y;
	  if (pos[0] < 0) {
	    X = Game.DIM_X + pos[0];
	  } else {
	    X = -Game.DIM_X + pos[0];
	  }

	  if (pos[1] < 0) {
	    Y = Game.DIM_Y + pos[1];
	  } else {
	    Y = -Game.DIM_Y + pos[1];
	  }

	  return [X, Y];
	};

	Game.prototype.checkCollisions = function(){
	  var thisGame = this;
	  thisGame.asteroids.forEach(function(asteroid){
	    if(asteroid.isCollidedWith(thisGame.ship)){
	      thisGame.ship.relocate();
	    }
	  });
	};

	Game.prototype.step = function() {
	  this.moveObjects();
	  this.checkCollisions();
	};

	Game.prototype.remove = function(idx) {
	  this.allObjects.splice(idx,1);
	};

	module.exports = Game;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Utils = __webpack_require__(4);
	var MovingObject = __webpack_require__(5);
	var Game = __webpack_require__(2);

	var Asteroid = function(pos, game) {
	  var hash = {'pos': pos};
	  hash['color'] = Asteroid.COLOR;
	  hash['radius'] = Asteroid.RADIUS;
	  hash['vel'] = Utils.randomVec(Asteroid.MAX_VEL * Math.random());
	  hash['game'] = game;
	  this.thumbnail = new Image(40,40);
	  this.thumbnail.src = './AsteroidsProject/resources/puffy_edit.png';
	  this.imgLoaded = false;
	  this.thumbnail.onload = function() {
	    console.log("Loaded");
	    this.imgLoaded = true;
	  }.bind(this);
	  MovingObject.call(this, hash);
	};

	Utils.inherits(MovingObject, Asteroid);

	// Asteroid.thumbnail = new Image(); TODO: sprites
	// Asteroid.thumbnail.src = '../resources/puffy_edit.jpg';


	Asteroid.prototype.draw = function(ctx){
	  if (this.imgLoaded) {
	    ctx.drawImage(this.thumbnail, this.pos[0] - 60, this.pos[1] - 60);
	  } else {
	    ctx.fillStyle = this.forFill;
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
	  }
	};

	Asteroid.COLOR = "#222222";
	Asteroid.RADIUS = 60;
	Asteroid.MAX_VEL = 10;


	module.exports = Asteroid;


/***/ },
/* 4 */
/***/ function(module, exports) {

	var Utils = {};

	Utils.inherits = function(Parent, Child) {
	  function Surrogate() {}
	  Surrogate.prototype = Parent.prototype;
	  Child.prototype = new Surrogate();
	  Child.prototype.constructor = Child;
	};

	Utils.randomVec = function(length) {
	  var vector = [0,0];
	  var negOrPosX = (Math.random() < .5 ? -1 : 1);
	  var negOrPosY = (Math.random() < .5 ? -1 : 1);
	  var xUnit = Math.random();
	  var yUnit = Math.sqrt(1 - xUnit * xUnit);
	  vector[0] = negOrPosX * xUnit * length;
	  vector[1] = negOrPosY * yUnit * length;
	  return vector;
	};

	module.exports = Utils;


/***/ },
/* 5 */
/***/ function(module, exports) {

	var MovingObject = function(hash){
	  this.pos = hash['pos'];
	  this.vel = hash['vel'];
	  this.radius = hash['radius'];
	  this.color = hash['color'];
	  this.game = hash['game'];
	};

	MovingObject.prototype.draw = function(ctx){
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
	};

	MovingObject.prototype.move = function(){
	  var x = this.pos[0];
	  var y = this.pos[1];
	  var delX = this.vel[0];
	  var delY = this.vel[1];
	  this.pos[0] = x + delX;
	  this.pos[1] = y + delY;
	  var wrapped = this.game.wrap(this.pos);

	  this.pos[0] = ((this.pos[0] > this.game.constructor.DIM_X ||
	    this.pos[0] < 0) ? wrapped[0] : this.pos[0]);
	  this.pos[1] = ((this.pos[1] > this.game.constructor.DIM_Y ||
	    this.pos[1] < 0) ? wrapped[1] : this.pos[1]);
	};

	MovingObject.prototype.isCollidedWith = function(otherObject){
	  var myRadius = this.radius;
	  var theirRadius = otherObject.radius;
	  var distance = function(pos1, pos2){
	    var x1 = pos1[0];
	    var x2 = pos2[0];
	    var y1 = pos1[1];
	    var y2 = pos2[1];

	    return Math.sqrt((x2 - x1)*(x2-x1) + (y2 - y1)*(y2-y1));
	  };
	  return (distance(this.pos, otherObject.pos) <= myRadius + theirRadius);
	};

	module.exports = MovingObject;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Utils = __webpack_require__(4);
	var MovingObject = __webpack_require__(5);
	var Bullet = __webpack_require__(7);
	// var Game = require("./game");

	var Ship = function(pos, game) {
	  var hash = {'pos': pos};
	  hash['color'] = Ship.COLOR;
	  hash['radius'] = Ship.RADIUS;
	  hash['vel'] = [0, 0];
	  hash['game'] = game;
	  MovingObject.call(this, hash);
	};

	Utils.inherits(MovingObject, Ship);

	Ship.prototype.relocate = function(){
	  this.pos = this.game.randomPosition();
	  this.vel = [0, 0];
	};

	Ship.prototype.power = function(impulse){
	  this.vel[0] += impulse[0];
	  this.vel[1] += impulse[1];
	};

	Ship.prototype.fireBullet = function() {
	  var bullet = new Bullet(this.pos, this.vel, this.game);
	};

	Ship.COLOR = "#00FF00";
	Ship.RADIUS = 5;
	Ship.MAX_VEL = 10;


	module.exports = Ship;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var Utils = __webpack_require__(4);
	var MovingObject = __webpack_require__(5);
	var Game = __webpack_require__(2);

	var Bullet = function(pos, vel, game) {
	  var hash = {
	    'pos': [pos[0],pos[1]],
	    'game': game
	  };
	  if (vel[0] === 0 && vel[1] === 0) {
	    hash['vel'] = Utils.randomVec(1.2);
	  } else {
	    hash['vel'] = [vel[0] * 1.2,vel[1] * 1.2];
	  }
	  hash['color'] = Bullet.COLOR;
	  hash['radius'] = Bullet.RADIUS;
	  MovingObject.call(this, hash);
	  game.add(this);
	};

	Utils.inherits(MovingObject, Bullet);

	Bullet.prototype.move = function() {
	  var x = this.pos[0];
	  var y = this.pos[1];
	  var delX = this.vel[0];
	  var delY = this.vel[1];
	  this.pos[0] = x + delX;
	  this.pos[1] = y + delY;
	};

	Bullet.COLOR = "#FF0000";
	Bullet.RADIUS = 5;



	module.exports = Bullet;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	//     keymaster.js
	//     (c) 2011-2013 Thomas Fuchs
	//     keymaster.js may be freely distributed under the MIT license.

	;(function(global){
	  var k,
	    _handlers = {},
	    _mods = { 16: false, 18: false, 17: false, 91: false },
	    _scope = 'all',
	    // modifier keys
	    _MODIFIERS = {
	      '⇧': 16, shift: 16,
	      '⌥': 18, alt: 18, option: 18,
	      '⌃': 17, ctrl: 17, control: 17,
	      '⌘': 91, command: 91
	    },
	    // special keys
	    _MAP = {
	      backspace: 8, tab: 9, clear: 12,
	      enter: 13, 'return': 13,
	      esc: 27, escape: 27, space: 32,
	      left: 37, up: 38,
	      right: 39, down: 40,
	      del: 46, 'delete': 46,
	      home: 36, end: 35,
	      pageup: 33, pagedown: 34,
	      ',': 188, '.': 190, '/': 191,
	      '`': 192, '-': 189, '=': 187,
	      ';': 186, '\'': 222,
	      '[': 219, ']': 221, '\\': 220
	    },
	    code = function(x){
	      return _MAP[x] || x.toUpperCase().charCodeAt(0);
	    },
	    _downKeys = [];

	  for(k=1;k<20;k++) _MAP['f'+k] = 111+k;

	  // IE doesn't support Array#indexOf, so have a simple replacement
	  function index(array, item){
	    var i = array.length;
	    while(i--) if(array[i]===item) return i;
	    return -1;
	  }

	  // for comparing mods before unassignment
	  function compareArray(a1, a2) {
	    if (a1.length != a2.length) return false;
	    for (var i = 0; i < a1.length; i++) {
	        if (a1[i] !== a2[i]) return false;
	    }
	    return true;
	  }

	  var modifierMap = {
	      16:'shiftKey',
	      18:'altKey',
	      17:'ctrlKey',
	      91:'metaKey'
	  };
	  function updateModifierKey(event) {
	      for(k in _mods) _mods[k] = event[modifierMap[k]];
	  };

	  // handle keydown event
	  function dispatch(event) {
	    var key, handler, k, i, modifiersMatch, scope;
	    key = event.keyCode;

	    if (index(_downKeys, key) == -1) {
	        _downKeys.push(key);
	    }

	    // if a modifier key, set the key.<modifierkeyname> property to true and return
	    if(key == 93 || key == 224) key = 91; // right command on webkit, command on Gecko
	    if(key in _mods) {
	      _mods[key] = true;
	      // 'assignKey' from inside this closure is exported to window.key
	      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = true;
	      return;
	    }
	    updateModifierKey(event);

	    // see if we need to ignore the keypress (filter() can can be overridden)
	    // by default ignore key presses if a select, textarea, or input is focused
	    if(!assignKey.filter.call(this, event)) return;

	    // abort if no potentially matching shortcuts found
	    if (!(key in _handlers)) return;

	    scope = getScope();

	    // for each potential shortcut
	    for (i = 0; i < _handlers[key].length; i++) {
	      handler = _handlers[key][i];

	      // see if it's in the current scope
	      if(handler.scope == scope || handler.scope == 'all'){
	        // check if modifiers match if any
	        modifiersMatch = handler.mods.length > 0;
	        for(k in _mods)
	          if((!_mods[k] && index(handler.mods, +k) > -1) ||
	            (_mods[k] && index(handler.mods, +k) == -1)) modifiersMatch = false;
	        // call the handler and stop the event if neccessary
	        if((handler.mods.length == 0 && !_mods[16] && !_mods[18] && !_mods[17] && !_mods[91]) || modifiersMatch){
	          if(handler.method(event, handler)===false){
	            if(event.preventDefault) event.preventDefault();
	              else event.returnValue = false;
	            if(event.stopPropagation) event.stopPropagation();
	            if(event.cancelBubble) event.cancelBubble = true;
	          }
	        }
	      }
	    }
	  };

	  // unset modifier keys on keyup
	  function clearModifier(event){
	    var key = event.keyCode, k,
	        i = index(_downKeys, key);

	    // remove key from _downKeys
	    if (i >= 0) {
	        _downKeys.splice(i, 1);
	    }

	    if(key == 93 || key == 224) key = 91;
	    if(key in _mods) {
	      _mods[key] = false;
	      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = false;
	    }
	  };

	  function resetModifiers() {
	    for(k in _mods) _mods[k] = false;
	    for(k in _MODIFIERS) assignKey[k] = false;
	  };

	  // parse and assign shortcut
	  function assignKey(key, scope, method){
	    var keys, mods;
	    keys = getKeys(key);
	    if (method === undefined) {
	      method = scope;
	      scope = 'all';
	    }

	    // for each shortcut
	    for (var i = 0; i < keys.length; i++) {
	      // set modifier keys if any
	      mods = [];
	      key = keys[i].split('+');
	      if (key.length > 1){
	        mods = getMods(key);
	        key = [key[key.length-1]];
	      }
	      // convert to keycode and...
	      key = key[0]
	      key = code(key);
	      // ...store handler
	      if (!(key in _handlers)) _handlers[key] = [];
	      _handlers[key].push({ shortcut: keys[i], scope: scope, method: method, key: keys[i], mods: mods });
	    }
	  };

	  // unbind all handlers for given key in current scope
	  function unbindKey(key, scope) {
	    var multipleKeys, keys,
	      mods = [],
	      i, j, obj;

	    multipleKeys = getKeys(key);

	    for (j = 0; j < multipleKeys.length; j++) {
	      keys = multipleKeys[j].split('+');

	      if (keys.length > 1) {
	        mods = getMods(keys);
	      }

	      key = keys[keys.length - 1];
	      key = code(key);

	      if (scope === undefined) {
	        scope = getScope();
	      }
	      if (!_handlers[key]) {
	        return;
	      }
	      for (i = 0; i < _handlers[key].length; i++) {
	        obj = _handlers[key][i];
	        // only clear handlers if correct scope and mods match
	        if (obj.scope === scope && compareArray(obj.mods, mods)) {
	          _handlers[key][i] = {};
	        }
	      }
	    }
	  };

	  // Returns true if the key with code 'keyCode' is currently down
	  // Converts strings into key codes.
	  function isPressed(keyCode) {
	      if (typeof(keyCode)=='string') {
	        keyCode = code(keyCode);
	      }
	      return index(_downKeys, keyCode) != -1;
	  }

	  function getPressedKeyCodes() {
	      return _downKeys.slice(0);
	  }

	  function filter(event){
	    var tagName = (event.target || event.srcElement).tagName;
	    // ignore keypressed in any elements that support keyboard data input
	    return !(tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA');
	  }

	  // initialize key.<modifier> to false
	  for(k in _MODIFIERS) assignKey[k] = false;

	  // set current scope (default 'all')
	  function setScope(scope){ _scope = scope || 'all' };
	  function getScope(){ return _scope || 'all' };

	  // delete all handlers for a given scope
	  function deleteScope(scope){
	    var key, handlers, i;

	    for (key in _handlers) {
	      handlers = _handlers[key];
	      for (i = 0; i < handlers.length; ) {
	        if (handlers[i].scope === scope) handlers.splice(i, 1);
	        else i++;
	      }
	    }
	  };

	  // abstract key logic for assign and unassign
	  function getKeys(key) {
	    var keys;
	    key = key.replace(/\s/g, '');
	    keys = key.split(',');
	    if ((keys[keys.length - 1]) == '') {
	      keys[keys.length - 2] += ',';
	    }
	    return keys;
	  }

	  // abstract mods logic for assign and unassign
	  function getMods(key) {
	    var mods = key.slice(0, key.length - 1);
	    for (var mi = 0; mi < mods.length; mi++)
	    mods[mi] = _MODIFIERS[mods[mi]];
	    return mods;
	  }

	  // cross-browser events
	  function addEvent(object, event, method) {
	    if (object.addEventListener)
	      object.addEventListener(event, method, false);
	    else if(object.attachEvent)
	      object.attachEvent('on'+event, function(){ method(window.event) });
	  };

	  // set the handlers globally on document
	  addEvent(document, 'keydown', function(event) { dispatch(event) }); // Passing _scope to a callback to ensure it remains the same by execution. Fixes #48
	  addEvent(document, 'keyup', clearModifier);

	  // reset modifiers to false whenever the window is (re)focused.
	  addEvent(window, 'focus', resetModifiers);

	  // store previously defined key
	  var previousKey = global.key;

	  // restore previously defined key and return reference to our key object
	  function noConflict() {
	    var k = global.key;
	    global.key = previousKey;
	    return k;
	  }

	  // set window.key and window.key.set/get/deleteScope, and the default filter
	  global.key = assignKey;
	  global.key.setScope = setScope;
	  global.key.getScope = getScope;
	  global.key.deleteScope = deleteScope;
	  global.key.filter = filter;
	  global.key.isPressed = isPressed;
	  global.key.getPressedKeyCodes = getPressedKeyCodes;
	  global.key.noConflict = noConflict;
	  global.key.unbind = unbindKey;

	  if(true) module.exports = assignKey;

	})(this);


/***/ }
/******/ ]);