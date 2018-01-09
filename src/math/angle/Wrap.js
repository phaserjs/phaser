var MathWrap = require('../Wrap');

/**
 * [description]
 *
 * @function Phaser.Math.Angle.Wrap
 * @since 3.0.0
 *
 * @param {number} angle - [description]
 *
 * @return {number} [description]
 */
var Wrap = function (angle)
{
    return MathWrap(angle, -Math.PI, Math.PI);
};

module.exports = Wrap;
