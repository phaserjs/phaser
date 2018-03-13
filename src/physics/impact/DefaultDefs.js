/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var H = 0.5;
var N = 1 / 3;
var M = 2 / 3;

//  Tile ID to Slope defs.
//  First 4 elements = line data, final = solid or non-solid behind the line
    
module.exports = {

    2: [ 0, 1, 1, 0, true ],
    3: [ 0, 1, 1, H, true ],
    4: [ 0, H, 1, 0, true ],
    5: [ 0, 1, 1, M, true ],
    6: [ 0, M, 1, N, true ],
    7: [ 0, N, 1, 0, true ],
    8: [ H, 1, 0, 0, true ],
    9: [ 1, 0, H, 1, true ],
    10: [ H, 1, 1, 0, true ],
    11: [ 0, 0, H, 1, true ],
    12: [ 0, 0, 1, 0, false ],
    13: [ 1, 1, 0, 0, true ],
    14: [ 1, H, 0, 0, true ],
    15: [ 1, 1, 0, H, true ],
    16: [ 1, N, 0, 0, true ],
    17: [ 1, M, 0, N, true ],
    18: [ 1, 1, 0, M, true ],
    19: [ 1, 1, H, 0, true ],
    20: [ H, 0, 0, 1, true ],
    21: [ 0, 1, H, 0, true ],
    22: [ H, 0, 1, 1, true ],
    23: [ 1, 1, 0, 1, false ],
    24: [ 0, 0, 1, 1, true ],
    25: [ 0, 0, 1, H, true ],
    26: [ 0, H, 1, 1, true ],
    27: [ 0, 0, 1, N, true ],
    28: [ 0, N, 1, M, true ],
    29: [ 0, M, 1, 1, true ],
    30: [ N, 1, 0, 0, true ],
    31: [ 1, 0, M, 1, true ],
    32: [ M, 1, 1, 0, true ],
    33: [ 0, 0, N, 1, true ],
    34: [ 1, 0, 1, 1, false ],
    35: [ 1, 0, 0, 1, true ],
    36: [ 1, H, 0, 1, true ],
    37: [ 1, 0, 0, H, true ],
    38: [ 1, M, 0, 1, true ],
    39: [ 1, N, 0, M, true ],
    40: [ 1, 0, 0, N, true ],
    41: [ M, 1, N, 0, true ],
    42: [ M, 0, N, 1, true ],
    43: [ N, 1, M, 0, true ],
    44: [ N, 0, M, 1, true ],
    45: [ 0, 1, 0, 0, false ],
    52: [ 1, 1, M, 0, true ],
    53: [ N, 0, 0, 1, true ],
    54: [ 0, 1, N, 0, true ],
    55: [ M, 0, 1, 1, true ]

};
