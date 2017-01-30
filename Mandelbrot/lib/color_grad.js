var colors = ['#f00','#ff0','#0f0','#0ff','#00f','#f0f','#f00']

var ColorGrad = function(ctx,updateCB) {
  this.ctx = ctx
  this.grad = ctx.createLinearGradient(0,0,ctx.canvas.width,0)
  for(var i = 0; i < 7; i++) {
    this.grad.addColorStop(i / 6, colors[i])
  }
  this.updateColor = updateCB
}

ColorGrad.prototype.launch = function(xCorrection,yCorrection) {
  function resetColor(e) {
    var colorData = this.ctx.getImageData(
      Math.round(e.offsetX * xCorrection),
      Math.round(e.offsetY * yCorrection),
      1,
      1
    ).data.slice(0,3)
    if(colorData[0] || colorData[1] || colorData[2]) this.updateColor(colorData);
  }
  this.ctx.fillStyle = this.grad
  this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height)
  this.ctx.canvas.onclick = resetColor.bind(this)
};

module.exports = ColorGrad;
