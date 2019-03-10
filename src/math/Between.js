/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Compute a random integer between the `min` and `max` values, inclusive.
 *
 * @function Phaser.Math.Between
 * @since 3.0.0
 *
 * @param {integer} min - The minimum value.
 * @param {integer} max - The maximum value.
 *
 * @return {integer} The random integer.
 */
var Between = function (min, max)
{
    return Math.floor(Math.random() * (max - min + 1) + min);
};

module.exports = Between;
