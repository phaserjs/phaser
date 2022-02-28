/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Copy the values of one Rectangle to a destination Rectangle.
 *
 * @function Phaser.Geom.Rectangle.CopyFrom
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Rectangle} O - [dest,$return]
 *
 * @param {Phaser.Geom.Rectangle} source - The source Rectangle to copy the values from.
 * @param {Phaser.Geom.Rectangle} dest - The destination Rectangle to copy the values to.
 *
 * @return {Phaser.Geom.Rectangle} The destination Rectangle.
 */
var CopyFrom = function (source, dest)
{
    return dest.setTo(source.x, source.y, source.width, source.height);
};

module.exports = CopyFrom;
