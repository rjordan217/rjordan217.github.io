var BezierPath = require('../../utils/bezier_path');

var laamStart = BezierPath([[0,0],[-33,0],[-15,-60],[-20,-129]], .003),
    laamEnd = BezierPath([[0,0],[2,125],[2,137],[-60,133]], .003),
    tiltedAlif = BezierPath([[0,0],[24,49],[33,82],[41,121]], .003);

module.exports = [[laamStart], [laamEnd, [0, -125]], [tiltedAlif, [-80, 0]]];
