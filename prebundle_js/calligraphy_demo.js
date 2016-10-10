var canvasEl = document.getElementById('drawing-canvas'),
    ctx = canvasEl.getContext('2d');

var startPos = [ 7 * canvasEl.width / 8, canvasEl.height / 4];

var Brush = require('../JSCalligrapher/lib/brush'),
    MultipleBeziers = require('../JSCalligrapher/utils/multiple_beziers'),
    Arabic = require('../JSCalligrapher/alphabets/arabic');

GET_MOUSE_POS = function(e) {
  var rect = canvasEl.getBoundingClientRect();
  return [ e.clientX - rect.left, e.clientY - rect.top ];
};

var brush = new Brush(ctx, startPos, 3 * canvasEl.height / 4);

Array.prototype.deepDup = function() {
  var duplicate = [];
  this.forEach(function(el) {
    var toPush;
    if(el instanceof Array) {
      toPush = el.deepDup();
    } else {
      toPush = el;
    }
    duplicate.push(toPush);
  });
  return duplicate;
};

var phrase = Arabic.alif1.concat(
  Arabic.haa1.concat(
    Arabic.lamalf23.deepDup().concat(
      Arabic.tanwiin.deepDup().concat(
        Arabic.space.concat(
          Arabic.waaw.concat(
            Arabic.siin1.concat(
              Arabic.haa2.concat(
                Arabic.lamalf23.deepDup().concat(
                  Arabic.tanwiin.deepDup()
                )
              )
            )
          )
        )
      )
    )
  )
);

ctx.fillStyle = '#E9FBFF';
ctx.fillRect(0,0,900,500);
ctx.fillStyle = 'black'
brush.cgStart(phrase);
