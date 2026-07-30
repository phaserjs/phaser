/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Quartic ease-out.
 *
 * @function Phaser.Math.Easing.Quartic.Out
 * @since 3.0.0
 *
 * @param {number} v - The value to be eased.
 *
 * @return {number} The eased value.
 */
var Out = function (v)
{
    return 1 - (--v * v * v * v);
};

module.exports = Out;
