var BezierPath = require('../../utils/bezier_path');

var firstSwoop = BezierPath([[0,0],[7,47],[-31,45],[-29,8]], .003),
    secondSwoop = BezierPath([[0,0],[3,40],[-40,47],[-33,1]], .003),
    finalSwoop = BezierPath([[0,0],[7,110],[-98,120],[-88,40]], .003);

module.exports = [[[0,-40], firstSwoop], [secondSwoop], [finalSwoop]];
