var Normalize = require('./Normalize');

/**
 * [description]
 *
 * @function Phaser.Math.Angle.Reverse
 * @since 3.0.0
 *
 * @param {number} angle - [description]
 *
 * @return {number} [description]
 */
var Reverse = function (angle)
{
    return Normalize(angle + Math.PI);
};

module.exports = Reverse;
