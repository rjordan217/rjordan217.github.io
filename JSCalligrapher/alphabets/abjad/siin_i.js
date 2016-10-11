var BezierPath = require('../../utils/bezier_path');

var firstSwoop = BezierPath([[0,0],[7,47],[-31,45],[-29,8]], .003),
    secondSwoop = BezierPath([[0,0],[3,40],[-40,47],[-33,1]], .003),
    connector = BezierPath([[0,0],[3,31],[-20,35],[-30,31]], .003);

module.exports = [[[0,-40], firstSwoop], [secondSwoop], [connector]];
