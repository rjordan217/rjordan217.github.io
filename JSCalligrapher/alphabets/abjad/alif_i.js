function alif(t) {
  if(t + .003 <= 1) {
    return [[0, t * 125], t + .003];
  } else {
    return [[-80, 60], t + .003];
  }
}

module.exports = [alif];
