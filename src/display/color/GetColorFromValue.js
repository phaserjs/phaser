/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Given a hex color value, such as 0xff00ff (for purple), it will return a
 * numeric representation of it (i.e. 16711935) for use in WebGL tinting.
 *
 * @function Phaser.Display.Color.GetColorFromValue
 * @since 3.50.0
 *
 * @param {number} red - The hex color value, such as 0xff0000.
 *
 * @return {number} The combined color value.
 */
var GetColorFromValue = function (value)
{
    return (value >> 16) + (value & 0xff00) + ((value & 0xff) << 16);
};

module.exports = GetColorFromValue;
