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
