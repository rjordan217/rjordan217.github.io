var Rotatable = {
  spin: function(rads) {
    this.theta += rads;
    if(this.phi) this.phi += rads;
  }
};

module.exports = Rotatable;
