var BezierPath = require('../../utils/bezier_path');

var haaFirstStroke = BezierPath([[0,0],[2,-19],[25,-12],[134,-15]], .003),
    haaSwoop = BezierPath([[0,0],[-263,49],[-102,239],[7,137]], .003);

module.exports = [[haaFirstStroke], [haaSwoop]];
