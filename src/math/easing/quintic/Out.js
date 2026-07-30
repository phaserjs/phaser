/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Quintic ease-out.
 *
 * @function Phaser.Math.Easing.Quintic.Out
 * @since 3.0.0
 *
 * @param {number} v - The value to be eased.
 *
 * @return {number} The eased value.
 */
var Out = function (v)
{
    return --v * v * v * v * v + 1;
};

module.exports = Out;
