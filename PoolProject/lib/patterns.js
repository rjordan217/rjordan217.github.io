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
