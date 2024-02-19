/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Compute a random integer between the `min` and `max` values, inclusive.
 *
 * @function Phaser.Math.Between
 * @since 3.0.0
 *
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 *
 * @return {number} The random integer.
 */
var Between = function (min, max)
{
    return Math.floor(Math.random() * (max - min + 1) + min);
};

module.exports = Between;
