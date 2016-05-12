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
