var BezierPath = require('../../utils/bezier_path');

var haaFirstStroke = BezierPath([[0,0],[66,30],[50,71],[-22,67]], .003),
    haaLoop = BezierPath([[0,0],[-60,-11],[-15,-84],[27,-42]], .003),
    haaLastStroke = BezierPath([[0,0],[25,41],[-92,46],[-90,45]], .003);

module.exports = [[[-40, -60], haaFirstStroke], [haaLoop], [haaLastStroke]];
