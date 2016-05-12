var TIP_OF_TRIANGLE = DIM_X / 2 - REL_DIM / 2;
var Y_BASE = DIM_Y / 2;
var DEL_X = BALL_RADIUS * Math.sqrt(3);

var BallConstants = [
  { // Cueball
    number: 0,
    pos: [ DIM_X / 2 + REL_DIM / 2, Y_BASE ],
    color: '#ffffff'
  },
  { // 1
    number: 1,
    pos: [ TIP_OF_TRIANGLE + 4, Y_BASE ],
    color: 'yellow'
  },
  { // 2
    number: 2,
    pos: [ TIP_OF_TRIANGLE - DEL_X + 3, Y_BASE - BALL_RADIUS ],
    color: 'blue'
  },
  { // 3
    number: 3,
    pos: [ TIP_OF_TRIANGLE - DEL_X + 3, Y_BASE + BALL_RADIUS ],
    color: 'rgb(255,140,60)'
  },
  { // 4
    number: 4,
    pos: [ TIP_OF_TRIANGLE - 2 * DEL_X + 2, Y_BASE - 2 * BALL_RADIUS ],
    color: 'rgb(255,0,255)'
  },
  { // 5
    number: 5,
    pos: [ TIP_OF_TRIANGLE - 2 * DEL_X + 2, Y_BASE ],
    color: 'orange'
  },
  { // 6
    number: 6,
    pos: [ TIP_OF_TRIANGLE - 2 * DEL_X + 2, Y_BASE + 2 * BALL_RADIUS ],
    color: 'rgb(0,200,0)'
  },
  { // 7
    number: 7,
    pos: [ TIP_OF_TRIANGLE - 3 * DEL_X + 1, Y_BASE - 3 * BALL_RADIUS ],
    color: 'rgb(200,0,0)'
  },
  { // 8
    number: 8,
    pos: [ TIP_OF_TRIANGLE - 3 * DEL_X + 1, Y_BASE - BALL_RADIUS ],
    color: '#000000'
  },
  { // 9
    number: 9,
    pos: [ TIP_OF_TRIANGLE - 3 * DEL_X + 1, Y_BASE + BALL_RADIUS ],
    color: 'yellow'
  },
  { // 10
    number: 10,
    pos: [ TIP_OF_TRIANGLE - 3 * DEL_X + 1, Y_BASE + 3 * BALL_RADIUS ],
    color: 'blue'
  },
  { // 11
    number: 11,
    pos: [ TIP_OF_TRIANGLE - 4 * DEL_X, Y_BASE - 4 * BALL_RADIUS ],
    color: 'rgb(255,140,60)'
  },
  { // 12
    number: 12,
    pos: [ TIP_OF_TRIANGLE - 4 * DEL_X, Y_BASE - 2 * BALL_RADIUS ],
    color: 'rgb(255,0,255)'
  },
  { // 13
    number: 13,
    pos: [ TIP_OF_TRIANGLE - 4 * DEL_X, Y_BASE ],
    color: 'orange'
  },
  { // 14
    number: 14,
    pos: [ TIP_OF_TRIANGLE - 4 * DEL_X, Y_BASE + 2 * BALL_RADIUS ],
    color: 'rgb(0,200,0)'
  },
  { // 15
    number: 15,
    pos: [ TIP_OF_TRIANGLE - 4 * DEL_X, Y_BASE + 4 * BALL_RADIUS ],
    color: 'rgb(200,0,0)'
  }
];

module.exports = BallConstants;
