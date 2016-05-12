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
