var BezierPath = require('../../utils/bezier_path'),
    runway = require('./runway')(30);

var haaFirstStroke = BezierPath([[0,0],[-48,-39],[11,-114],[23,-35]], .003),
    haaLoop = BezierPath([[0,0],[-19,36],[-73,79],[-24,97]], .003),
    haaLastStroke = BezierPath([[0,0],[27,-10],[34,-73],[-37,-62]], .003);

module.exports = [[runway], [haaFirstStroke], [haaLoop], [haaLastStroke]];
