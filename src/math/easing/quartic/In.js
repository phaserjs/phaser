/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Quartic ease-in.
 *
 * @function Phaser.Math.Easing.Quartic.In
 * @since 3.0.0
 *
 * @param {number} v - The value to be eased.
 *
 * @return {number} The eased value.
 */
var In = function (v)
{
    return v * v * v * v;
};

module.exports = In;
