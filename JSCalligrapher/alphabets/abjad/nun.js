var BezierPath = require('../../utils/bezier_path'),
    i3jam = require('./i3jam.js');

var nunSwoop = BezierPath([[0,0],[35,105],[-125,100],[-90,0]], .003);

module.exports = [[[0,-40], nunSwoop], [[40,-15], i3jam]];
