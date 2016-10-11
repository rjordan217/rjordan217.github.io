var BezierPath = require('../../utils/bezier_path');

var waawStart = BezierPath([[0,0],[-70,-10],[-40,-70],[2,-23]], .003),
    waawEnd = BezierPath([[0,0],[11,21],[-28,108],[-96,80]], .003);
    
module.exports = [[waawStart], [waawEnd, [0, -57]]];
