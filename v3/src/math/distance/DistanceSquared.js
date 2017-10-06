/**
 * [description]
 *
 * @function Phaser.Math.Distance.Squared
 * @since 3.0.0
 *
 * @param {number} x1 - [description]
 * @param {number} y1 - [description]
 * @param {number} x2 - [description]
 * @param {number} y2 - [description]
 *
 * @return {number} [description]
 */
var DistanceSquared = function (x1, y1, x2, y2)
{
    var dx = x1 - x2;
    var dy = y1 - y2;

    return dx * dx + dy * dy;
};

module.exports = DistanceSquared;
