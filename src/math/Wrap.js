/**
 * [description]
 *
 * @function Phaser.Math.Wrap
 * @since 3.0.0
 *
 * @param {number} value - [description]
 * @param {number} min - [description]
 * @param {number} max - [description]
 *
 * @return {number} [description]
 */
var Wrap = function (value, min, max)
{
    var range = max - min;

    return (min + ((((value - min) % range) + range) % range));
};

module.exports = Wrap;
