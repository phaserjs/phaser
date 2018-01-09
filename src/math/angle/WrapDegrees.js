var Wrap = require('../Wrap');

/**
 * [description]
 *
 * @function Phaser.Math.Angle.WrapDegrees
 * @since 3.0.0
 *
 * @param {number} angle - [description]
 *
 * @return {number} [description]
 */
var WrapDegrees = function (angle)
{
    return Wrap(angle, -180, 180);
};

module.exports = WrapDegrees;
