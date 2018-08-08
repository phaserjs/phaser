/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Wrap the given `value` between `min` and `max.
 *
 * @function Phaser.Math.Wrap
 * @since 3.0.0
 *
 * @param {number} value - The value to wrap.
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 *
 * @return {number} The wrapped value.
 */
var Wrap = function (value, min, max)
{
    var range = max - min;

    return (min + ((((value - min) % range) + range) % range));
};

module.exports = Wrap;
