module.exports = function(length) {
  function runway(t) {
    return [[-length * t, 0], t + 1 / length];
  }

  return runway;
};
